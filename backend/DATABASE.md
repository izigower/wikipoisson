# Documentation de la Base de Données

## Configuration

La connexion à la base de données est gérée dans `config/database.js` qui utilise `mysql2` avec un pool de connexions.

### Variables d'environnement requises (.env)

```env
DB_HOST=localhost
DB_PORT=8889
DB_USER=root
DB_PASSWORD=root
DB_NAME=wikipoisson
```

## Structure de la Base de Données

### Tables principales

1. **users** - Utilisateurs de l'application
   - `user_id` (PK, AUTO_INCREMENT)
   - `pseudo` (VARCHAR)
   - `email` (VARCHAR, UNIQUE)
   - `mdp` (VARCHAR, hashé avec bcrypt)
   - `role` (VARCHAR: 'user' ou 'admin')

2. **espece** - Espèces de poissons
   - `id_espece` (PK, AUTO_INCREMENT)
   - `nom_commun`, `nom_scientifique`
   - `description`, `taille_max`, `alimentation`, `temperature`, `dificulte`
   - `id_temperament` (FK vers temperament)
   - `id_famille` (FK vers famille)
   - `id_habitat` (FK vers habitat)
   - `image_1`, `image_2`, `image_3`
   - `cree_le`, `modifie_le`
   - `id_contribution_valide` (FK vers contribution)

3. **commentaire** - Commentaires sur les espèces
   - `id_commentaire` (PK, AUTO_INCREMENT)
   - `note` (TINYINT: 1-5)
   - `commentaire` (TEXT)
   - `date` (DATETIME)
   - `validation` (TINYINT: 0=non validé, 1=validé)
   - `user_id` (FK vers users)
   - `id_espece` (FK vers espece)

4. **contribution** - Contributions d'espèces/modifications
   - `id_contribution` (PK, AUTO_INCREMENT)
   - `date_creation`, `cree_le`
   - `validation` (TINYINT: 0=non validé, 1=validé)
   - `user_id` (FK vers users)
   - `id_espece` (FK vers espece)
   - Données de l'espèce (nom_commun, nom_scientifique, etc.)

5. **famille** - Familles de poissons
   - `id_famille` (PK, AUTO_INCREMENT)
   - `libelle`, `description`

6. **habitat** - Habitats naturels
   - `id_habitat` (PK, AUTO_INCREMENT)
   - `libelle`, `description`

7. **temperament** - Tempéraments comportementaux
   - `id_temperament` (PK, AUTO_INCREMENT)
   - `libelle`, `description`

8. **historique** - Historique des recherches
   - `id_historique` (PK, AUTO_INCREMENT)
   - `recherche` (VARCHAR)
   - `date` (DATETIME)
   - `user_id` (FK vers users)

## Routes et Connexions à la Base de Données

### Routes d'authentification (`routes/auth.js`)
- ✅ `POST /api/auth/register` - Création d'utilisateur
- ✅ `POST /api/auth/login` - Connexion
- ✅ `GET /api/auth/me` - Vérification du token

### Routes des espèces (`routes/especes.js`)
- ✅ `GET /api/especes` - Liste toutes les espèces (avec JOIN sur famille, habitat, temperament)
- ✅ `GET /api/especes/:id` - Détail d'une espèce (avec commentaires validés)
- ✅ `GET /api/especes/search/:query` - Recherche d'espèces

### Routes des commentaires (`routes/commentaires.js`)
- ✅ `POST /api/commentaires` - Ajouter un commentaire (nécessite authentification)

### Routes des contributions (`routes/contributions.js`)
- ✅ `POST /api/contributions` - Soumettre une contribution (nécessite authentification)

### Routes admin (`routes/admin.js`)
- ✅ `GET /api/admin/commentaires/pending` - Commentaires en attente
- ✅ `GET /api/admin/commentaires/all` - Tous les commentaires
- ✅ `PUT /api/admin/commentaires/:id` - Valider/rejeter un commentaire
- ✅ `DELETE /api/admin/commentaires/:id` - Supprimer un commentaire
- ✅ `GET /api/admin/contributions/pending` - Contributions en attente
- ✅ `PUT /api/admin/contributions/:id/validate` - Valider une contribution
- ✅ `PUT /api/admin/contributions/:id/reject` - Rejeter une contribution
- ✅ `GET /api/admin/users` - Liste tous les utilisateurs avec statistiques
- ✅ `PUT /api/admin/users/:id/role` - Modifier le rôle d'un utilisateur
- ✅ `DELETE /api/admin/users/:id` - Supprimer un utilisateur
- ✅ `GET /api/admin/references` - Données de référence (familles, habitats, temperaments)

## Utilisation de la Base de Données

Toutes les routes utilisent le module `database.js` exporté :

```javascript
const db = require('../config/database');

// Exécution d'une requête
const [results] = await db.execute('SELECT * FROM users WHERE user_id = ?', [userId]);
```

### Pool de Connexions

Le pool de connexions permet de :
- Gérer plusieurs requêtes simultanées
- Réutiliser les connexions
- Limiter le nombre de connexions (10 max)
- Gérer automatiquement les erreurs de connexion

## Test de la Connexion

Pour tester la connexion à la base de données :

```bash
node scripts/test-db.js
```

Ce script vérifie :
- ✅ La connexion à MySQL
- ✅ L'existence de la base de données
- ✅ L'existence de toutes les tables
- ✅ Les requêtes principales avec JOIN
- ✅ Les statistiques de la base de données

## Gestion des Erreurs

La configuration de la base de données inclut :
- ✅ Test de connexion au démarrage du serveur
- ✅ Gestion des erreurs de connexion (ECONNREFUSED, PROTOCOL_CONNECTION_LOST, etc.)
- ✅ Messages d'erreur détaillés pour faciliter le diagnostic
- ✅ Logs des erreurs dans toutes les routes

## Sécurité

- ✅ Utilisation de requêtes préparées (protection contre les injections SQL)
- ✅ Hashage des mots de passe avec bcrypt
- ✅ Validation des données avant insertion
- ✅ Vérification des permissions (middleware auth/admin)

## Notes Importantes

1. **Port MySQL MAMP** : Par défaut, MAMP utilise le port **8889** pour MySQL
2. **Fichier .env** : Doit être créé dans le dossier `backend/` avec les bonnes valeurs
3. **Base de données** : La base `wikipoisson` doit exister avant de démarrer le serveur
4. **Connexion** : Le serveur teste automatiquement la connexion au démarrage

