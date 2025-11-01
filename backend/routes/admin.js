const express = require('express');
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Middleware pour toutes les routes admin
router.use(authMiddleware, adminMiddleware);

// Récupérer les commentaires en attente de validation
router.get('/commentaires/pending', async (req, res) => {
  try {
    const [commentaires] = await db.execute(`
      SELECT c.*, u.pseudo, e.nom_commun as espece_nom
      FROM commentaire c
      JOIN users u ON c.user_id = u.user_id
      JOIN espece e ON c.id_espece = e.id_espece
      WHERE c.validation = 0
      ORDER BY c.date DESC
    `);

    res.json(commentaires);
  } catch (error) {
    console.error('Erreur dans /api/admin:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Récupérer tous les commentaires
router.get('/commentaires/all', async (req, res) => {
  try {
    const [commentaires] = await db.execute(`
      SELECT c.*, u.pseudo, u.email, e.nom_commun as espece_nom
      FROM commentaire c
      JOIN users u ON c.user_id = u.user_id
      JOIN espece e ON c.id_espece = e.id_espece
      ORDER BY c.date DESC
    `);

    res.json(commentaires);
  } catch (error) {
    console.error('Erreur dans /api/admin:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Supprimer un commentaire
router.delete('/commentaires/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      'DELETE FROM commentaire WHERE id_commentaire = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    res.json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    console.error('Erreur dans /api/admin:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Valider ou rejeter un commentaire
router.put('/commentaires/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { validation } = req.body;

    if (![ -1, 0, 1 ].includes(validation)) {
      return res.status(400).json({ message: 'Validation doit être -1 (rejeté), 0 (en attente) ou 1 (validé)' });
    }

    await db.execute(
      'UPDATE commentaire SET validation = ? WHERE id_commentaire = ?',
      [validation, id]
    );

    let msg = 'Commentaire mis à jour';
    if (validation === 1) msg = 'Commentaire validé';
    if (validation === -1) msg = 'Commentaire rejeté';
    res.json({ message: msg });
  } catch (error) {
    console.error('Erreur dans /api/admin:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Récupérer les contributions en attente
router.get('/contributions/pending', async (req, res) => {
  try {
    const [contributions] = await db.execute(`
      SELECT c.*, u.pseudo, e.nom_commun as espece_nom_actuel
      FROM contribution c
      JOIN users u ON c.user_id = u.user_id
      LEFT JOIN espece e ON c.id_espece = e.id_espece
      WHERE c.validation = 0
      ORDER BY c.date_creation DESC
    `);

    res.json(contributions);
  } catch (error) {
    console.error('Erreur dans /api/admin:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Valider une contribution
router.put('/contributions/:id/validate', async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer la contribution
    const [contributions] = await db.execute(
      'SELECT * FROM contribution WHERE id_contribution = ?',
      [id]
    );

    if (contributions.length === 0) {
      return res.status(404).json({ message: 'Contribution non trouvée' });
    }

    const contribution = contributions[0];

    // Vérifier si l'espèce existe (id_espece = 0 ou null signifie nouvelle espèce)
    const isNewSpecies = !contribution.id_espece || contribution.id_espece === 0;
    
    let especes = [];
    if (!isNewSpecies) {
      [especes] = await db.execute(
        'SELECT * FROM espece WHERE id_espece = ?',
        [contribution.id_espece]
      );
    }

    if (especes.length > 0) {
      // Mettre à jour l'espèce existante
      // Utiliser les valeurs de la contribution si elles existent, sinon garder les valeurs actuelles
      const especeActuelle = especes[0];
      await db.execute(
        `UPDATE espece SET
         nom_commun = ?, nom_scientifique = ?, description = ?,
         taille_max = ?, alimentation = ?, temperature = ?, dificulte = ?,
         id_temperament = ?, id_famille = ?, id_habitat = ?,
         image_1 = ?, image_2 = ?, image_3 = ?,
         modifie_le = NOW(), id_contribution_valide = ?
         WHERE id_espece = ?`,
        [
          contribution.nom_commun || especeActuelle.nom_commun,
          contribution.nom_scientifique || especeActuelle.nom_scientifique,
          contribution.description || especeActuelle.description,
          contribution.taille_max !== null && contribution.taille_max !== undefined ? contribution.taille_max : especeActuelle.taille_max,
          contribution.alimentation || especeActuelle.alimentation,
          contribution.temperature !== null && contribution.temperature !== undefined ? contribution.temperature : especeActuelle.temperature,
          contribution.dificulte || especeActuelle.dificulte,
          contribution.id_temperament || especeActuelle.id_temperament,
          contribution.id_famille || especeActuelle.id_famille,
          contribution.id_habitat || especeActuelle.id_habitat,
          contribution.image_1 || especeActuelle.image_1,
          contribution.image_2 || especeActuelle.image_2,
          contribution.image_3 || especeActuelle.image_3,
          contribution.id_contribution,
          contribution.id_espece
        ]
      );
    } else {
      // Créer une nouvelle espèce
      // S'assurer que les champs NOT NULL ont des valeurs valides
      const finalIdTemperament = (contribution.id_temperament && contribution.id_temperament !== 0) ? parseInt(contribution.id_temperament) : 0;
      const finalIdFamille = (contribution.id_famille && contribution.id_famille !== 0) ? parseInt(contribution.id_famille) : 0;
      const finalIdHabitat = (contribution.id_habitat && contribution.id_habitat !== 0) ? parseInt(contribution.id_habitat) : 0;
      // image_1 est NOT NULL, donc on doit fournir une valeur (chaîne vide si null)
      const finalImage1 = contribution.image_1 && contribution.image_1.trim() !== '' ? contribution.image_1 : '';
      
      console.log('📝 Création nouvelle espèce:', {
        nom_commun: contribution.nom_commun,
        nom_scientifique: contribution.nom_scientifique,
        id_temperament: finalIdTemperament,
        id_famille: finalIdFamille,
        id_habitat: finalIdHabitat,
        image_1: finalImage1 || '(vide)',
        hasDescription: !!contribution.description
      });
      
      // Validation des champs requis
      if (!contribution.nom_commun || !contribution.nom_scientifique || !contribution.description) {
        return res.status(400).json({ 
          message: 'Les champs nom commun, nom scientifique et description sont requis pour créer une nouvelle espèce' 
        });
      }
      
      const [result] = await db.execute(
        `INSERT INTO espece 
         (nom_commun, nom_scientifique, description, taille_max, alimentation,
          temperature, dificulte, cree_le, modifie_le, id_temperament,
          id_famille, id_habitat, id_contribution_valide, image_1, image_2, image_3)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?)`,
        [
          contribution.nom_commun,
          contribution.nom_scientifique,
          contribution.description,
          contribution.taille_max || null,
          contribution.alimentation || null,
          contribution.temperature || null,
          contribution.dificulte || null,
          finalIdTemperament,
          finalIdFamille,
          finalIdHabitat,
          contribution.id_contribution || null,
          finalImage1,
          contribution.image_2 || null,
          contribution.image_3 || null
        ]
      );
      
      // Mettre à jour l'id_espece de la contribution avec l'ID de la nouvelle espèce créée
      const newEspeceId = result.insertId;
      await db.execute(
        'UPDATE contribution SET validation = 1, id_espece = ? WHERE id_contribution = ?',
        [newEspeceId, id]
      );
      
      res.json({ 
        message: 'Contribution validée et nouvelle espèce créée',
        id_espece: newEspeceId
      });
      return;
    }

    // Marquer la contribution comme validée (pour les modifications d'espèces existantes)
    await db.execute(
      'UPDATE contribution SET validation = 1 WHERE id_contribution = ?',
      [id]
    );

    res.json({ message: 'Contribution validée et modification appliquée' });
  } catch (error) {
    console.error('❌ Erreur dans /api/admin/contributions/:id/validate:', error);
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    const isDev = process.env.NODE_ENV !== 'production';
    let errorMessage = 'Erreur lors de la validation de la contribution';
    
    if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
      errorMessage = 'Un champ requis est manquant dans la base de données';
    } else if (error.code === 'ER_BAD_NULL_ERROR') {
      errorMessage = 'Un champ NOT NULL est manquant ou invalide';
    } else if (error.message && error.message.includes('image_1')) {
      errorMessage = 'L\'image principale (image_1) est requise pour créer une nouvelle espèce';
    }
    
    res.status(500).json({ 
      message: errorMessage,
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Rejeter une contribution
router.put('/contributions/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      'UPDATE contribution SET validation = -1 WHERE id_contribution = ?',
      [id]
    );

    res.json({ message: 'Contribution rejetée' });
  } catch (error) {
    console.error('Erreur dans /api/admin:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Récupérer les modifications exécutées (commentaires validés + contributions appliquées)
router.get('/modifications-executed', async (req, res) => {
  try {
    // Récupérer les commentaires validés
    const [commentairesValides] = await db.execute(`
      SELECT 
        c.*, 
        u.pseudo, 
        e.nom_commun as espece_nom,
        'commentaire' as type_modification
      FROM commentaire c
      JOIN users u ON c.user_id = u.user_id
      JOIN espece e ON c.id_espece = e.id_espece
      WHERE c.validation = 1
      ORDER BY c.date DESC
    `);

    // Récupérer les contributions appliquées (validées)
    const [contributionsAppliquees] = await db.execute(`
      SELECT 
        c.*, 
        u.pseudo, 
        e.nom_commun as espece_nom_actuel,
        'contribution' as type_modification
      FROM contribution c
      JOIN users u ON c.user_id = u.user_id
      LEFT JOIN espece e ON c.id_espece = e.id_espece
      WHERE c.validation = 1
      ORDER BY c.date_creation DESC
    `);

    // Combiner et formater les résultats
    const modifications = [
      ...commentairesValides.map(c => ({
        ...c,
        date_modification: c.date,
        type: 'commentaire'
      })),
      ...contributionsAppliquees.map(c => ({
        ...c,
        date_modification: c.date_creation,
        type: 'contribution'
      }))
    ].sort((a, b) => new Date(b.date_modification) - new Date(a.date_modification));

    res.json(modifications);
  } catch (error) {
    console.error('Erreur dans /api/admin/modifications-executed:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.execute(`
      SELECT user_id, pseudo, email, role, 
             (SELECT COUNT(*) FROM commentaire WHERE user_id = users.user_id) as nb_commentaires,
             (SELECT COUNT(*) FROM contribution WHERE user_id = users.user_id) as nb_contributions
      FROM users
      ORDER BY user_id DESC
    `);

    res.json(users);
  } catch (error) {
    console.error('Erreur dans /api/admin:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Modifier le rôle d'un utilisateur
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide. Doit être "user" ou "admin"' });
    }

    // Empêcher de modifier son propre rôle
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas modifier votre propre rôle' });
    }

    const [result] = await db.execute(
      'UPDATE users SET role = ? WHERE user_id = ?',
      [role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: `Rôle modifié en "${role}" avec succès` });
  } catch (error) {
    console.error('Erreur dans /api/admin:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Empêcher de supprimer son propre compte
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    // Supprimer d'abord les commentaires et contributions de l'utilisateur
    await db.execute('DELETE FROM commentaire WHERE user_id = ?', [id]);
    await db.execute('DELETE FROM contribution WHERE user_id = ?', [id]);

    // Supprimer l'utilisateur
    const [result] = await db.execute(
      'DELETE FROM users WHERE user_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur et toutes ses données supprimés avec succès' });
  } catch (error) {
    console.error('Erreur dans /api/admin:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Récupérer les données de référence
router.get('/references', async (req, res) => {
  try {
    const [familles] = await db.execute('SELECT * FROM famille ORDER BY libelle');
    const [habitats] = await db.execute('SELECT * FROM habitat ORDER BY libelle');
    const [temperaments] = await db.execute('SELECT * FROM temperament ORDER BY libelle');

    res.json({ familles, habitats, temperaments });
  } catch (error) {
    console.error('Erreur dans /api/admin:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Récupérer toutes les espèces (pour admin)
router.get('/especes', async (req, res) => {
  try {
    console.log('📊 Admin: Récupération de toutes les espèces depuis la base de données...');
    const [especes] = await db.execute(`
      SELECT e.*, 
             f.libelle as famille_libelle,
             h.libelle as habitat_libelle,
             t.libelle as temperament_libelle
      FROM espece e
      LEFT JOIN famille f ON e.id_famille = f.id_famille
      LEFT JOIN habitat h ON e.id_habitat = h.id_habitat
      LEFT JOIN temperament t ON e.id_temperament = t.id_temperament
      ORDER BY e.nom_commun ASC
    `);

    console.log(`✅ Admin: ${especes.length} espèces récupérées depuis la base de données`);
    res.json(especes);
  } catch (error) {
    console.error('Erreur dans /api/admin:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Ajouter une nouvelle espèce
router.post('/especes', async (req, res) => {
  try {
    const {
      nom_commun,
      nom_scientifique,
      description,
      taille_max,
      alimentation,
      temperature,
      dificulte,
      id_temperament,
      id_famille,
      id_habitat,
      image_1,
      image_2,
      image_3
    } = req.body;

    if (!nom_commun || !nom_scientifique || !description) {
      return res.status(400).json({ message: 'Nom commun, nom scientifique et description sont requis' });
    }

    console.log(`📝 Admin: Ajout d'une nouvelle espèce "${nom_commun}" dans la base de données...`);

    const [result] = await db.execute(
      `INSERT INTO espece 
       (nom_commun, nom_scientifique, description, taille_max, alimentation,
        temperature, dificulte, cree_le, modifie_le, id_temperament,
        id_famille, id_habitat, image_1, image_2, image_3)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, ?)`,
      [
        nom_commun,
        nom_scientifique,
        description,
        taille_max || null,
        alimentation || null,
        temperature || null,
        dificulte || null,
        id_temperament || null,
        id_famille || null,
        id_habitat || null,
        image_1 || null,
        image_2 || null,
        image_3 || null
      ]
    );

    console.log(`✅ Admin: Espèce "${nom_commun}" ajoutée avec succès (ID: ${result.insertId})`);

    res.status(201).json({
      message: 'Espèce ajoutée avec succès',
      id_espece: result.insertId
    });
  } catch (error) {
    console.error('Erreur dans /api/admin:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Modifier une espèce
router.put('/especes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom_commun,
      nom_scientifique,
      description,
      taille_max,
      alimentation,
      temperature,
      dificulte,
      id_temperament,
      id_famille,
      id_habitat,
      image_1,
      image_2,
      image_3
    } = req.body;

    if (!nom_commun || !nom_scientifique || !description) {
      return res.status(400).json({ message: 'Nom commun, nom scientifique et description sont requis' });
    }

    console.log(`📝 Admin: Modification de l'espèce ${id} ("${nom_commun}") dans la base de données...`);

    const [result] = await db.execute(
      `UPDATE espece SET
       nom_commun = ?, nom_scientifique = ?, description = ?,
       taille_max = ?, alimentation = ?, temperature = ?, dificulte = ?,
       id_temperament = ?, id_famille = ?, id_habitat = ?,
       image_1 = ?, image_2 = ?, image_3 = ?,
       modifie_le = NOW()
       WHERE id_espece = ?`,
      [
        nom_commun,
        nom_scientifique,
        description,
        taille_max || null,
        alimentation || null,
        temperature || null,
        dificulte || null,
        id_temperament || null,
        id_famille || null,
        id_habitat || null,
        image_1 || null,
        image_2 || null,
        image_3 || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Espèce non trouvée' });
    }

    console.log(`✅ Admin: Espèce ${id} modifiée avec succès dans la base de données`);
    res.json({ message: 'Espèce modifiée avec succès' });
  } catch (error) {
    console.error('Erreur dans /api/admin:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Supprimer une espèce
router.delete('/especes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🗑️ Admin: Suppression de l'espèce ${id} de la base de données...`);

    // Supprimer d'abord les commentaires et contributions liés
    const [commentairesDeleted] = await db.execute('DELETE FROM commentaire WHERE id_espece = ?', [id]);
    const [contributionsDeleted] = await db.execute('DELETE FROM contribution WHERE id_espece = ?', [id]);
    
    console.log(`   - ${commentairesDeleted.affectedRows} commentaire(s) supprimé(s)`);
    console.log(`   - ${contributionsDeleted.affectedRows} contribution(s) supprimée(s)`);

    // Supprimer l'espèce
    const [result] = await db.execute(
      'DELETE FROM espece WHERE id_espece = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Espèce non trouvée' });
    }

    console.log(`✅ Admin: Espèce ${id} supprimée avec succès de la base de données`);
    res.json({ message: 'Espèce supprimée avec succès' });
  } catch (error) {
    console.error('Erreur dans /api/admin:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Ajouter une famille
router.post('/familles', async (req, res) => {
  try {
    const { libelle, description } = req.body;

    if (!libelle) {
      return res.status(400).json({ message: 'Le libellé est requis' });
    }

    const [result] = await db.execute(
      'INSERT INTO famille (libelle, description) VALUES (?, ?)',
      [libelle, description || null]
    );

    res.status(201).json({
      message: 'Famille ajoutée avec succès',
      id_famille: result.insertId
    });
  } catch (error) {
    console.error('Erreur dans /api/admin/familles:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Ajouter un habitat
router.post('/habitats', async (req, res) => {
  try {
    const { libelle, description } = req.body;

    if (!libelle) {
      return res.status(400).json({ message: 'Le libellé est requis' });
    }

    const [result] = await db.execute(
      'INSERT INTO habitat (libelle, description) VALUES (?, ?)',
      [libelle, description || null]
    );

    res.status(201).json({
      message: 'Habitat ajouté avec succès',
      id_habitat: result.insertId
    });
  } catch (error) {
    console.error('Erreur dans /api/admin/habitats:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

// Ajouter un tempérament
router.post('/temperaments', async (req, res) => {
  try {
    const { libelle, description } = req.body;

    if (!libelle) {
      return res.status(400).json({ message: 'Le libellé est requis' });
    }

    const [result] = await db.execute(
      'INSERT INTO temperament (libelle, description) VALUES (?, ?)',
      [libelle, description || null]
    );

    res.status(201).json({
      message: 'Tempérament ajouté avec succès',
      id_temperament: result.insertId
    });
  } catch (error) {
    console.error('Erreur dans /api/admin/temperaments:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(isDev && { 
        error: error.message,
        code: error.code,
        stack: error.stack 
      })
    });
  }
});

module.exports = router;

