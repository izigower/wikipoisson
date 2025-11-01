const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Récupérer toutes les espèces
router.get('/', async (req, res) => {
  try {
    console.log('📊 Récupération de toutes les espèces depuis la base de données...');
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

    console.log(`✅ ${especes.length} espèces récupérées depuis la base de données`);
    res.json(especes);
  } catch (error) {
    console.error('❌ Erreur dans /api/especes:', error);
    console.error('Code:', error.code);
    console.error('Message:', error.message);
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

// Récupérer une espèce par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📊 Récupération de l'espèce ${id} depuis la base de données...`);

    // Vérifier si l'utilisateur est admin (optionnel, ne bloque pas si pas de token)
    let isAdmin = false;
    let userId = null;
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        isAdmin = decoded.role === 'admin';
        userId = decoded.userId;
      }
    } catch (e) {
      // Token invalide ou absent, on continue sans privilèges admin
    }

    const [especes] = await db.execute(`
      SELECT e.*, 
             f.libelle as famille_libelle,
             f.description as famille_description,
             h.libelle as habitat_libelle,
             h.description as habitat_description,
             t.libelle as temperament_libelle,
             t.description as temperament_description
      FROM espece e
      LEFT JOIN famille f ON e.id_famille = f.id_famille
      LEFT JOIN habitat h ON e.id_habitat = h.id_habitat
      LEFT JOIN temperament t ON e.id_temperament = t.id_temperament
      WHERE e.id_espece = ?
    `, [id]);

    if (especes.length === 0) {
      return res.status(404).json({ message: 'Espèce non trouvée' });
    }

    // Récupérer les commentaires (tous si admin, ou validés + les siens sinon)
    // IMPORTANT: Toujours inclure user_id pour permettre la modification/suppression
    let commentairesQuery;
    let params = [id];
    if (isAdmin) {
      commentairesQuery = `SELECT c.*, u.pseudo, u.email, c.user_id
         FROM commentaire c
         JOIN users u ON c.user_id = u.user_id
         WHERE c.id_espece = ?
         ORDER BY c.date DESC`;
    } else if (userId) {
      commentairesQuery = `SELECT c.*, u.pseudo, c.user_id
         FROM commentaire c
         JOIN users u ON c.user_id = u.user_id
         WHERE c.id_espece = ? AND (c.validation = 1 OR c.user_id = ?)
         ORDER BY c.date DESC`;
      params = [id, userId];
    } else {
      commentairesQuery = `SELECT c.*, u.pseudo, c.user_id
         FROM commentaire c
         JOIN users u ON c.user_id = u.user_id
         WHERE c.id_espece = ? AND c.validation = 1
         ORDER BY c.date DESC`;
    }
    
    const [commentaires] = await db.execute(commentairesQuery, params);

    // S'assurer que user_id est toujours présent dans chaque commentaire
    const commentairesWithUserId = commentaires.map(c => ({
      ...c,
      user_id: c.user_id || c.userId // Garantir que user_id est toujours présent
    }));

    console.log(`✅ Espèce ${id} récupérée avec ${commentairesWithUserId.length} commentaire(s)`);

    res.json({
      espece: especes[0],
      commentaires: commentairesWithUserId,
      isAdmin
    });
  } catch (error) {
    console.error('Erreur dans /api/especes:', error);
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

// Récupérer les tempéraments disponibles (public)
router.get('/temperaments', async (req, res) => {
  try {
    const [temperaments] = await db.execute('SELECT * FROM temperament ORDER BY libelle');
    res.json(temperaments);
  } catch (error) {
    console.error('Erreur dans /api/especes/temperaments:', error);
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

// Récupérer les références (familles, habitats, temperaments) - public
router.get('/references', async (req, res) => {
  try {
    const [familles] = await db.execute('SELECT * FROM famille ORDER BY libelle');
    const [habitats] = await db.execute('SELECT * FROM habitat ORDER BY libelle');
    const [temperaments] = await db.execute('SELECT * FROM temperament ORDER BY libelle');

    res.json({ familles, habitats, temperaments });
  } catch (error) {
    console.error('Erreur dans /api/especes/references:', error);
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

// Rechercher des espèces
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchTerm = `%${query}%`;
    console.log(`🔍 Recherche d'espèces avec le terme: "${query}"`);

    const [especes] = await db.execute(`
      SELECT e.*, 
             f.libelle as famille_libelle,
             h.libelle as habitat_libelle,
             t.libelle as temperament_libelle
      FROM espece e
      LEFT JOIN famille f ON e.id_famille = f.id_famille
      LEFT JOIN habitat h ON e.id_habitat = h.id_habitat
      LEFT JOIN temperament t ON e.id_temperament = t.id_temperament
      WHERE e.nom_commun LIKE ? OR e.nom_scientifique LIKE ?
      ORDER BY e.nom_commun ASC
    `, [searchTerm, searchTerm]);

    console.log(`✅ ${especes.length} espèce(s) trouvée(s) pour "${query}"`);
    res.json(especes);
  } catch (error) {
    console.error('Erreur dans /api/especes:', error);
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

