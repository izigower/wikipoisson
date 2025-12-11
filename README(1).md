# WikiPoisson - Forum sur les espèces de poissons

Application web complète (frontend React + backend Node.js) pour un forum sur les espèces de poissons d'aquarium.

## Fonctionnalités

- 🐟 **Base de données d'espèces** : Consultation des espèces avec détails complets
- 💬 **Commentaires** : Ajout de commentaires et notes sur les espèces
- ✏️ **Contributions** : Système de contributions pour enrichir la base de données
- 👤 **Authentification** : Inscription et connexion utilisateurs
- 🔐 **Panel Admin** : Gestion des commentaires et contributions en attente de validation

## Structure du projet

```
Wikipoisson/
├── backend/          # API Node.js/Express
│   ├── config/       # Configuration base de données
│   ├── middleware/   # Middleware d'authentification
│   ├── routes/       # Routes API
│   └── server.js     # Point d'entrée serveur
├── frontend/         # Application React
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages de l'application
│   │   ├── context/     # Context React (Auth)
│   │   └── App.js       # Composant principal
│   └── public/
└── wikipoisson (3).sql  # Base de données SQL
```

## Installation

### Prérequis

- Node.js (v14 ou supérieur)
- MySQL/MariaDB
- npm ou yarn

### Configuration Backend

1. Installer les dépendances :
```bash
cd backend
npm install
```

2. Créer un fichier `.env` dans le dossier `backend` :
```
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=wikipoisson
JWT_SECRET=votre_secret_jwt_ici
```

3. Importer la base de données :
```bash
mysql -u root -p < ../wikipoisson\ \(3\).sql
```

4. Démarrer le serveur :
```bash
npm start
# ou en mode développement
npm run dev
```

Le backend sera accessible sur `http://localhost:5001`

### Configuration Frontend

1. Installer les dépendances :
```bash
cd frontend
npm install
```

2. Créer un fichier `.env` dans le dossier `frontend` :
```
REACT_APP_API_URL=http://localhost:5001/api
```

3. Démarrer l'application :
```bash
npm start
```

Le frontend sera accessible sur `http://localhost:3000`

## Utilisation

### Comptes par défaut

D'après la base de données, vous pouvez vous connecter avec :
- **Admin** : `aa@aa.fr` / `aa` (ou `aurele.beauvieux@gmail.com`)
- **Utilisateur** : `aurele2003.beauvieux@gmail.com` / mot de passe dans la BDD

### Pages disponibles

- **/** : Page d'accueil
- **/especes** : Liste des espèces
- **/especes/:id** : Détail d'une espèce avec commentaires
- **/login** : Connexion
- **/register** : Inscription
- **/admin** : Panel administrateur (réservé aux admins)

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Vérifier le token

### Espèces
- `GET /api/especes` - Liste des espèces
- `GET /api/especes/:id` - Détail d'une espèce
- `GET /api/especes/search/:query` - Recherche d'espèces

### Commentaires
- `POST /api/commentaires` - Ajouter un commentaire (auth requis)

### Contributions
- `POST /api/contributions` - Ajouter une contribution (auth requis)

### Admin
- `GET /api/admin/commentaires/pending` - Commentaires en attente
- `PUT /api/admin/commentaires/:id` - Valider/rejeter un commentaire
- `GET /api/admin/contributions/pending` - Contributions en attente
- `PUT /api/admin/contributions/:id/validate` - Valider une contribution
- `PUT /api/admin/contributions/:id/reject` - Rejeter une contribution

## Technologies utilisées

### Backend
- Node.js
- Express.js
- MySQL2
- bcryptjs (hashage mots de passe)
- jsonwebtoken (authentification)
- CORS

### Frontend
- React 18
- React Router DOM
- Axios
- React Icons

## Notes

- Les commentaires et contributions nécessitent une validation admin avant d'être visibles
- Les mots de passe sont hashés avec bcrypt
- L'authentification utilise JWT (JSON Web Tokens)
- Le panel admin est protégé et accessible uniquement aux utilisateurs avec le rôle "admin"

