const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { pseudo, email, mdp } = req.body;

    if (!pseudo || !email || !mdp) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    const [existingUser] = await db.execute(
      'SELECT * FROM users WHERE email = ? OR pseudo = ?',
      [email, pseudo]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email ou pseudo déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(mdp, 10);

    // Créer l'utilisateur
    const [result] = await db.execute(
      'INSERT INTO users (pseudo, email, mdp, role) VALUES (?, ?, ?, ?)',
      [pseudo, email, hashedPassword, 'user']
    );

    const token = jwt.sign(
      { userId: result.insertId, pseudo, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: { userId: result.insertId, pseudo, email, role: 'user' }
    });
  } catch (error) {
    console.error('Erreur dans /api/auth:', error);
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

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, mdp } = req.body;

    if (!email || !mdp) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Trouver l'utilisateur
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = users[0];

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(mdp, user.mdp);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { userId: user.user_id, pseudo: user.pseudo, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        userId: user.user_id,
        pseudo: user.pseudo,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur dans /api/auth:', error);
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

// Vérifier le token
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [users] = await db.execute(
      'SELECT user_id, pseudo, email, role FROM users WHERE user_id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
});

// Modifier le profil utilisateur
const { authMiddleware } = require('../middleware/auth');
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { pseudo, email, mdp } = req.body;
    const userId = req.user.userId;

    if (!pseudo || !email) {
      return res.status(400).json({ message: 'Pseudo et email sont requis' });
    }

    // Vérifier si l'email ou pseudo est déjà utilisé par un autre utilisateur
    const [existingUser] = await db.execute(
      'SELECT * FROM users WHERE (email = ? OR pseudo = ?) AND user_id != ?',
      [email, pseudo, userId]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email ou pseudo déjà utilisé' });
    }

    let updateQuery = 'UPDATE users SET pseudo = ?, email = ?';
    let updateParams = [pseudo, email];

    // Si un nouveau mot de passe est fourni, le hasher et l'ajouter
    if (mdp && mdp.trim() !== '') {
      if (mdp.length < 6) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
      }
      const hashedPassword = await bcrypt.hash(mdp, 10);
      updateQuery += ', mdp = ?';
      updateParams.push(hashedPassword);
    }

    updateQuery += ' WHERE user_id = ?';
    updateParams.push(userId);

    await db.execute(updateQuery, updateParams);

    // Générer un nouveau token avec les nouvelles informations
    const token = jwt.sign(
      { userId, pseudo, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Profil mis à jour avec succès',
      token,
      user: { userId, pseudo, email, role: req.user.role }
    });
  } catch (error) {
    console.error('Erreur dans /api/auth:', error);
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

