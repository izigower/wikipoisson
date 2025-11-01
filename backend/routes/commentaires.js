const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Ajouter un commentaire
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { id_espece, note, commentaire } = req.body;
    const userId = req.user.userId;

    if (!id_espece || !note || !commentaire) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (note < 1 || note > 5) {
      return res.status(400).json({ message: 'La note doit être entre 1 et 5' });
    }

    const [result] = await db.execute(
      'INSERT INTO commentaire (note, commentaire, date, validation, user_id, id_espece) VALUES (?, ?, NOW(), 0, ?, ?)',
      [note, commentaire, userId, id_espece]
    );

    res.status(201).json({
      message: 'Commentaire ajouté, en attente de validation',
      id_commentaire: result.insertId
    });
  } catch (error) {
    console.error('Erreur dans /api/commentaires:', error);
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

// Récupérer les commentaires de l'utilisateur (tous statuts)
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [commentaires] = await db.execute(
      `SELECT c.*, e.nom_commun as espece_nom
       FROM commentaire c
       JOIN espece e ON c.id_espece = e.id_espece
       WHERE c.user_id = ?
       ORDER BY c.date DESC`,
      [userId]
    );
    res.json(commentaires);
  } catch (error) {
    console.error('Erreur dans /api/commentaires/mine:', error);
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

// Modifier un commentaire de l'utilisateur
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { note, commentaire } = req.body;
    const userId = req.user.userId;

    if (!note || !commentaire) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (note < 1 || note > 5) {
      return res.status(400).json({ message: 'La note doit être entre 1 et 5' });
    }

    // Vérifier que le commentaire appartient à l'utilisateur
    const [existing] = await db.execute(
      'SELECT * FROM commentaire WHERE id_commentaire = ? AND user_id = ?',
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Commentaire non trouvé ou vous n\'avez pas le droit de le modifier' });
    }

    // Mettre à jour le commentaire et remettre validation à 0 (en attente)
    await db.execute(
      'UPDATE commentaire SET note = ?, commentaire = ?, validation = 0, date = NOW() WHERE id_commentaire = ? AND user_id = ?',
      [note, commentaire, id, userId]
    );

    res.json({ message: 'Commentaire modifié, en attente de validation' });
  } catch (error) {
    console.error('Erreur dans /api/commentaires/:id:', error);
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

// Supprimer un commentaire de l'utilisateur
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Valider les paramètres
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'ID de commentaire invalide' });
    }

    // Vérifier que le commentaire appartient à l'utilisateur
    const [existing] = await db.execute(
      'SELECT * FROM commentaire WHERE id_commentaire = ? AND user_id = ?',
      [parseInt(id), userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Commentaire non trouvé ou vous n\'avez pas le droit de le supprimer' });
    }

    // Supprimer le commentaire
    const [result] = await db.execute(
      'DELETE FROM commentaire WHERE id_commentaire = ? AND user_id = ?',
      [parseInt(id), userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Commentaire non trouvé ou déjà supprimé' });
    }

    res.json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    console.error('Erreur dans /api/commentaires/:id DELETE:', error);
    console.error('Stack:', error.stack);
    
    // S'assurer que la réponse n'a pas déjà été envoyée
    if (!res.headersSent) {
      const isDev = process.env.NODE_ENV !== 'production';
      res.status(500).json({
        message: 'Erreur serveur lors de la suppression',
        ...(isDev && {
          error: error.message,
          code: error.code,
          stack: error.stack
        })
      });
    }
  }
});

module.exports = router;

