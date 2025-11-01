const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Ajouter une contribution (nouvelle espèce ou modification)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      id_espece,
      nom_commun,
      nom_scientifique,
      description,
      taille_max,
      alimentation,
      temperature,
      dificulte,
      famille,
      habitat,
      temperament,
      image_1,
      image_2,
      image_3
    } = req.body;

    const userId = req.user.userId;

    console.log('📝 Contribution reçue:', {
      id_espece,
      nom_commun,
      nom_scientifique,
      hasDescription: !!description
    });

    // Déterminer si c'est une nouvelle espèce (id_espece absent, 0, null, undefined ou vide)
    const hasIdEspece = id_espece && id_espece !== 0 && id_espece !== '0' && id_espece !== '' && id_espece !== null && id_espece !== undefined;
    const isNewSpecies = !hasIdEspece;

    let finalIdEspece = 0; // 0 pour nouvelle espèce
    let mergedValues = {};

    if (hasIdEspece) {
      // MODIFICATION d'une espèce existante
      finalIdEspece = parseInt(id_espece);
      
      // Vérifier que l'espèce existe
      const [existing] = await db.execute(
        `SELECT nom_commun, nom_scientifique, description, taille_max, alimentation,
                temperature, dificulte, id_temperament, id_famille, id_habitat,
                image_1, image_2, image_3
         FROM espece WHERE id_espece = ?`,
        [finalIdEspece]
      );
      
      if (existing.length === 0) {
        return res.status(404).json({ message: 'Espèce introuvable pour modification' });
      }
      
      const current = existing[0];
      
      // Fusionner les valeurs
      mergedValues = {
        nom_commun: nom_commun || current.nom_commun,
        nom_scientifique: nom_scientifique || current.nom_scientifique,
        description: description || current.description,
        taille_max: taille_max !== undefined && taille_max !== null && taille_max !== '' ? taille_max : current.taille_max,
        alimentation: alimentation || current.alimentation,
        temperature: temperature !== undefined && temperature !== null && temperature !== '' ? temperature : current.temperature,
        dificulte: dificulte || current.dificulte,
        id_temperament: current.id_temperament || 0,
        id_famille: current.id_famille || 0,
        id_habitat: current.id_habitat || 0,
        image_1: image_1 || current.image_1,
        image_2: image_2 || current.image_2,
        image_3: image_3 || current.image_3
      };
      
      // Ajouter tempérament en texte si fourni
      if (temperament && temperament.trim() !== '') {
        mergedValues.description = mergedValues.description 
          ? `${mergedValues.description}\n[Tempérament proposé] ${temperament}`
          : `[Tempérament proposé] ${temperament}`;
      }
    } else {
      // NOUVELLE ESPÈCE
      // Validation des champs requis
      if (!nom_commun || !nom_scientifique || !description) {
        return res.status(400).json({ 
          message: 'Pour créer une nouvelle fiche, le nom commun, le nom scientifique et la description sont obligatoires' 
        });
      }
      
      // Construire la description complète avec famille, habitat, tempérament
      let fullDescription = description || '';
      if (famille && famille.trim() !== '') {
        fullDescription += (fullDescription ? '\n\n' : '') + `[Famille] ${famille}`;
      }
      if (habitat && habitat.trim() !== '') {
        fullDescription += (fullDescription ? '\n\n' : '') + `[Habitat] ${habitat}`;
      }
      if (temperament && temperament.trim() !== '') {
        fullDescription += (fullDescription ? '\n\n' : '') + `[Tempérament] ${temperament}`;
      }
      
      mergedValues = {
        nom_commun: nom_commun,
        nom_scientifique: nom_scientifique,
        description: fullDescription,
        taille_max: taille_max || null,
        alimentation: alimentation || null,
        temperature: temperature || null,
        dificulte: dificulte || null,
        id_temperament: 0,
        id_famille: 0,
        id_habitat: 0,
        image_1: image_1 || null,
        image_2: image_2 || null,
        image_3: image_3 || null
      };
    }

    // Convertir les valeurs numériques
    let finalTailleMax = null;
    if (mergedValues.taille_max !== null && mergedValues.taille_max !== undefined && mergedValues.taille_max !== '') {
      finalTailleMax = parseFloat(mergedValues.taille_max);
      if (isNaN(finalTailleMax)) finalTailleMax = null;
    }

    let finalTemperature = null;
    if (mergedValues.temperature !== null && mergedValues.temperature !== undefined && mergedValues.temperature !== '') {
      finalTemperature = parseFloat(mergedValues.temperature);
      if (isNaN(finalTemperature)) finalTemperature = null;
    }

    // Insérer la contribution
    const [result] = await db.execute(
      `INSERT INTO contribution 
       (date_creation, validation, user_id, id_espece, nom_commun, nom_scientifique, 
        description, taille_max, alimentation, temperature, dificulte, cree_le,
        id_temperament, id_famille, id_habitat, image_1, image_2, image_3)
       VALUES (NOW(), 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        finalIdEspece,
        mergedValues.nom_commun,
        mergedValues.nom_scientifique,
        mergedValues.description,
        finalTailleMax,
        mergedValues.alimentation,
        finalTemperature,
        mergedValues.dificulte,
        mergedValues.id_temperament,
        mergedValues.id_famille,
        mergedValues.id_habitat,
        mergedValues.image_1,
        mergedValues.image_2,
        mergedValues.image_3
      ]
    );

    console.log('✅ Contribution créée avec succès, ID:', result.insertId);

    res.status(201).json({
      message: isNewSpecies 
        ? 'Nouvelle fiche proposée avec succès ! Elle sera ajoutée après validation par un administrateur.'
        : 'Modification proposée avec succès ! Elle sera appliquée après validation par un administrateur.',
      id_contribution: result.insertId,
      isNewSpecies
    });
  } catch (error) {
    console.error('❌ Erreur dans /api/contributions:', error);
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    
    const isDev = process.env.NODE_ENV !== 'production';
    let errorMessage = 'Erreur lors de la soumission de la contribution';
    
    if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
      errorMessage = 'Un champ requis est manquant';
    } else if (error.code === 'ER_BAD_NULL_ERROR') {
      errorMessage = 'Un champ obligatoire est manquant';
    }
    
    res.status(500).json({ 
      message: errorMessage,
      ...(isDev && { 
        error: error.message,
        code: error.code
      })
    });
  }
});

// Récupérer les contributions de l'utilisateur (tous statuts)
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [contributions] = await db.execute(
      `SELECT c.*, e.nom_commun as espece_nom_actuel
       FROM contribution c
       LEFT JOIN espece e ON c.id_espece = e.id_espece
       WHERE c.user_id = ?
       ORDER BY c.date_creation DESC`,
      [userId]
    );
    res.json(contributions);
  } catch (error) {
    console.error('Erreur dans /api/contributions/mine:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({
      message: 'Erreur serveur',
      ...(isDev && {
        error: error.message,
        code: error.code
      })
    });
  }
});

module.exports = router;
