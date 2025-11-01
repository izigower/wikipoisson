const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const especesRoutes = require('./routes/especes');
const commentairesRoutes = require('./routes/commentaires');
const contributionsRoutes = require('./routes/contributions');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/especes', especesRoutes);
app.use('/api/commentaires', commentairesRoutes);
app.use('/api/contributions', contributionsRoutes);
app.use('/api/admin', adminRoutes);

// Route de test
app.get('/api', (req, res) => {
  res.json({ message: 'API WikiPoisson fonctionnelle' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

