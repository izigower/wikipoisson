# Vérification de la Connexion à la Base de Données

## ✅ Toutes les routes sont connectées à la base de données

### Routes des Espèces (`routes/especes.js`)

#### ✅ `GET /api/especes`
- **Connexion BDD** : ✅ Utilise `db.execute()`
- **Requête SQL** : 
  ```sql
  SELECT e.*, f.libelle as famille_libelle, h.libelle as habitat_libelle, t.libelle as temperament_libelle
  FROM espece e
  LEFT JOIN famille f ON e.id_famille = f.id_famille
  LEFT JOIN habitat h ON e.id_habitat = h.id_habitat
  LEFT JOIN temperament t ON e.id_temperament = t.id_temperament
  ORDER BY e.nom_commun ASC
  ```
- **Logs** : Affiche le nombre d'espèces récupérées

#### ✅ `GET /api/especes/:id`
- **Connexion BDD** : ✅ Utilise `db.execute()` (2 requêtes)
- **Requêtes SQL** :
  1. Récupération de l'espèce avec JOIN sur famille, habitat, temperament
  2. Récupération des commentaires avec JOIN sur users
- **Logs** : Affiche l'ID de l'espèce et le nombre de commentaires

#### ✅ `GET /api/especes/search/:query`
- **Connexion BDD** : ✅ Utilise `db.execute()`
- **Requête SQL** : Recherche avec LIKE sur nom_commun et nom_scientifique
- **Logs** : Affiche le terme de recherche et le nombre de résultats

### Routes Admin pour les Espèces (`routes/admin.js`)

#### ✅ `GET /api/admin/especes`
- **Connexion BDD** : ✅ Utilise `db.execute()`
- **Requête SQL** : Même requête que `/api/especes` mais pour les admins
- **Logs** : Affiche le nombre d'espèces récupérées

#### ✅ `POST /api/admin/especes`
- **Connexion BDD** : ✅ Utilise `db.execute()`
- **Requête SQL** : INSERT INTO espece avec tous les champs
- **Logs** : Affiche le nom de l'espèce ajoutée et son ID

#### ✅ `PUT /api/admin/especes/:id`
- **Connexion BDD** : ✅ Utilise `db.execute()`
- **Requête SQL** : UPDATE espece avec tous les champs modifiables
- **Logs** : Affiche l'ID et le nom de l'espèce modifiée

#### ✅ `DELETE /api/admin/especes/:id`
- **Connexion BDD** : ✅ Utilise `db.execute()` (3 requêtes)
- **Requêtes SQL** :
  1. DELETE FROM commentaire WHERE id_espece = ?
  2. DELETE FROM contribution WHERE id_espece = ?
  3. DELETE FROM espece WHERE id_espece = ?
- **Logs** : Affiche le nombre de commentaires et contributions supprimés

### Routes des Commentaires (`routes/commentaires.js`)

#### ✅ `POST /api/commentaires`
- **Connexion BDD** : ✅ Utilise `db.execute()`
- **Requête SQL** : INSERT INTO commentaire

### Routes des Contributions (`routes/contributions.js`)

#### ✅ `POST /api/contributions`
- **Connexion BDD** : ✅ Utilise `db.execute()`
- **Requête SQL** : INSERT INTO contribution

### Routes d'Authentification (`routes/auth.js`)

#### ✅ `POST /api/auth/register`
- **Connexion BDD** : ✅ Utilise `db.execute()` (2 requêtes)
- **Requêtes SQL** :
  1. SELECT pour vérifier l'unicité
  2. INSERT INTO users

#### ✅ `POST /api/auth/login`
- **Connexion BDD** : ✅ Utilise `db.execute()`
- **Requête SQL** : SELECT FROM users WHERE email = ?

#### ✅ `GET /api/auth/me`
- **Connexion BDD** : ✅ Utilise `db.execute()`
- **Requête SQL** : SELECT FROM users WHERE user_id = ?

#### ✅ `PUT /api/auth/profile`
- **Connexion BDD** : ✅ Utilise `db.execute()` (2 requêtes)
- **Requêtes SQL** :
  1. SELECT pour vérifier l'unicité
  2. UPDATE users

### Routes Admin (`routes/admin.js`)

Toutes les routes admin utilisent `db.execute()` :
- ✅ Commentaires (GET, PUT, DELETE)
- ✅ Contributions (GET, PUT)
- ✅ Utilisateurs (GET, PUT, DELETE)
- ✅ Espèces (GET, POST, PUT, DELETE)
- ✅ Références (GET)

## 📊 Test de Connexion

Pour tester la connexion, exécutez :
```bash
cd backend
node scripts/test-db.js
```

## 🔍 Logs de Diagnostic

Toutes les routes importantes affichent maintenant des logs dans la console :
- 📊 Récupération de données
- ✅ Succès des opérations
- ❌ Erreurs détaillées

## ✅ Vérification

Toutes les routes utilisent bien :
- ✅ `const db = require('../config/database')`
- ✅ `await db.execute()` pour toutes les requêtes SQL
- ✅ Requêtes préparées (protection contre les injections SQL)
- ✅ Gestion d'erreurs complète

**Conclusion** : Toutes les espèces sont bien connectées à la base de données MySQL via le pool de connexions configuré dans `config/database.js`.

