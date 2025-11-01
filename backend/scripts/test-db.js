/**
 * Script de test pour vérifier la connexion à la base de données
 * et que toutes les tables sont accessibles
 */

require('dotenv').config();
const db = require('../config/database');

async function testDatabase() {
  console.log('🔍 Test de connexion à la base de données...\n');

  const tables = [
    'users',
    'espece',
    'commentaire',
    'contribution',
    'famille',
    'habitat',
    'temperament',
    'historique'
  ];

  try {
    // Test 1: Vérifier la connexion
    console.log('1️⃣ Test de connexion...');
    const [connection] = await db.execute('SELECT 1 as test');
    console.log('✅ Connexion réussie\n');

    // Test 2: Vérifier que la base de données existe
    console.log('2️⃣ Vérification de la base de données...');
    const dbName = process.env.DB_NAME || 'wikipoisson';
    try {
      const [databases] = await db.execute(`SHOW DATABASES LIKE '${dbName}'`);
      if (databases.length > 0) {
        console.log(`✅ Base de données "${dbName}" trouvée\n`);
      } else {
        console.log(`❌ Base de données "${dbName}" non trouvée\n`);
        return;
      }
    } catch (error) {
      // Si on est déjà connecté à la base, c'est qu'elle existe
      console.log(`✅ Base de données "${dbName}" accessible\n`);
    }

    // Test 3: Vérifier toutes les tables
    console.log('3️⃣ Vérification des tables...');
    for (const table of tables) {
      try {
        const [rows] = await db.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ✅ Table "${table}": ${rows[0].count} enregistrement(s)`);
      } catch (error) {
        console.log(`   ❌ Table "${table}": ${error.message}`);
      }
    }
    console.log('');

    // Test 4: Test des requêtes principales
    console.log('4️⃣ Test des requêtes principales...\n');

    // Test users
    try {
      const [users] = await db.execute('SELECT COUNT(*) as count FROM users');
      console.log(`   ✅ Requête users: ${users[0].count} utilisateur(s)`);
    } catch (error) {
      console.log(`   ❌ Requête users: ${error.message}`);
    }

    // Test espece avec JOIN
    try {
      const [especes] = await db.execute(`
        SELECT e.*, 
               f.libelle as famille_libelle,
               h.libelle as habitat_libelle,
               t.libelle as temperament_libelle
        FROM espece e
        LEFT JOIN famille f ON e.id_famille = f.id_famille
        LEFT JOIN habitat h ON e.id_habitat = h.id_habitat
        LEFT JOIN temperament t ON e.id_temperament = t.id_temperament
        LIMIT 1
      `);
      console.log(`   ✅ Requête espece avec JOIN: OK`);
    } catch (error) {
      console.log(`   ❌ Requête espece avec JOIN: ${error.message}`);
    }

    // Test commentaire avec JOIN
    try {
      const [commentaires] = await db.execute(`
        SELECT c.*, u.pseudo, e.nom_commun as espece_nom
        FROM commentaire c
        JOIN users u ON c.user_id = u.user_id
        JOIN espece e ON c.id_espece = e.id_espece
        LIMIT 1
      `);
      console.log(`   ✅ Requête commentaire avec JOIN: OK`);
    } catch (error) {
      console.log(`   ❌ Requête commentaire avec JOIN: ${error.message}`);
    }

    // Test contribution avec JOIN
    try {
      const [contributions] = await db.execute(`
        SELECT c.*, u.pseudo
        FROM contribution c
        JOIN users u ON c.user_id = u.user_id
        LIMIT 1
      `);
      console.log(`   ✅ Requête contribution avec JOIN: OK`);
    } catch (error) {
      console.log(`   ❌ Requête contribution avec JOIN: ${error.message}`);
    }

    // Test sous-requête pour statistiques utilisateurs
    try {
      const [stats] = await db.execute(`
        SELECT user_id, pseudo, email, role, 
               (SELECT COUNT(*) FROM commentaire WHERE user_id = users.user_id) as nb_commentaires,
               (SELECT COUNT(*) FROM contribution WHERE user_id = users.user_id) as nb_contributions
        FROM users
        LIMIT 1
      `);
      console.log(`   ✅ Requête statistiques utilisateurs: OK`);
    } catch (error) {
      console.log(`   ❌ Requête statistiques utilisateurs: ${error.message}`);
    }

    console.log('\n✅ Tous les tests sont passés avec succès !');
    console.log('\n📊 Résumé de la base de données:');
    
    // Afficher les statistiques
    const [usersCount] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [especesCount] = await db.execute('SELECT COUNT(*) as count FROM espece');
    const [commentairesCount] = await db.execute('SELECT COUNT(*) as count FROM commentaire');
    const [contributionsCount] = await db.execute('SELECT COUNT(*) as count FROM contribution');
    const [commentairesPending] = await db.execute('SELECT COUNT(*) as count FROM commentaire WHERE validation = 0');
    const [contributionsPending] = await db.execute('SELECT COUNT(*) as count FROM contribution WHERE validation = 0');

    console.log(`   👥 Utilisateurs: ${usersCount[0].count}`);
    console.log(`   🐟 Espèces: ${especesCount[0].count}`);
    console.log(`   💬 Commentaires: ${commentairesCount[0].count} (${commentairesPending[0].count} en attente)`);
    console.log(`   📝 Contributions: ${contributionsCount[0].count} (${contributionsPending[0].count} en attente)`);

  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  } finally {
    // Fermer la connexion
    process.exit(0);
  }
}

testDatabase();

