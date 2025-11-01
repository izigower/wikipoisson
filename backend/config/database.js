const mysql = require('mysql2');
require('dotenv').config();

// Configuration de la connexion à la base de données
const dbConfig = {
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // XAMPP par défaut
  user: process.env.DB_USER ?? 'root',
  // Ne pas remplacer un mot de passe vide par une valeur par défaut
  password: process.env.DB_PASSWORD ?? '', // XAMPP par défaut (pas de mot de passe)
  database: process.env.DB_NAME ?? 'wikipoisson',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Options supplémentaires pour améliorer la stabilité
  reconnect: true,
  idleTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000
};

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

// Gestion des erreurs de connexion
pool.on('error', (err) => {
  console.error('❌ Erreur de connexion MySQL:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('La connexion à la base de données a été perdue.');
    console.error('Tentative de reconnexion automatique...');
  } else if (err.code === 'ECONNREFUSED') {
    console.error('Connexion refusée. Vérifiez que MySQL est démarré.');
  } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('Accès refusé. Vérifiez les identifiants dans le fichier .env');
  } else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_QUIT') {
    console.error('Tentative d\'utilisation d\'une connexion fermée. Reconnexion...');
  } else {
    console.error('Erreur MySQL non gérée:', err.code, err.message);
  }
});

// Gestion des connexions libérées
pool.on('connection', (connection) => {
  connection.on('error', (err) => {
    console.error('❌ Erreur sur une connexion MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Connexion perdue, elle sera automatiquement recréée.');
    }
  });
});

// Test de connexion au démarrage
promisePool.getConnection()
  .then(connection => {
    console.log('✅ Connexion à la base de données réussie');
    console.log(`   📊 Base de données: ${dbConfig.database}`);
    console.log(`   🖥️  Serveur: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   👤 Utilisateur: ${dbConfig.user}`);
    connection.release();
  })
  .catch(error => {
    console.error('\n❌ Erreur de connexion à la base de données:');
    console.error('   Code:', error.code);
    console.error('   Message:', error.message);
    console.error('\n📋 Vérifiez que:');
    console.error('   1. XAMPP est démarré et MySQL est actif');
    console.error('   2. Le fichier .env existe dans le dossier backend/');
    console.error('   3. Le port MySQL est correct (3306 pour XAMPP par défaut)');
    console.error('   4. La base de données "' + dbConfig.database + '" existe');
    console.error('   5. Les identifiants sont corrects (user/password)');
    console.error('\n💡 Pour tester la connexion, exécutez:');
    console.error('   node scripts/test-db.js\n');
  });

module.exports = promisePool;

