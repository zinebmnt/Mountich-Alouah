const leaderboardRoutes = require('./routes/leaderboardRoutes');

// 📦 Import du framework Express pour créer le serveur

const express = require('express');

// 📦 Import de Mongoose pour interagir avec MongoDB
const mongoose = require('mongoose');

// 📦 Import de CORS pour autoriser les appels depuis une autre origine (ex: ton appli mobile)
const cors = require('cors');

// 📦 Import de dotenv pour charger les variables d'environnement depuis un fichier .env
const dotenv = require('dotenv');

// 📦 Import de body-parser pour lire le corps (body) des requêtes JSON
const bodyParser = require('body-parser');

// 📦 Import des routes utilisateur et géocache
const userRoutes = require('./routes/userRoutes'); // Routes utilisateurs
const geocacheRoutes = require('./routes/geocachesRoutes');  // Routes géocaches

// 📥 Charger les variables d'environnement définies dans le fichier .env
dotenv.config();

// 🚀 Initialisation de l'application Express
const app = express();

// 📍 Port sur lequel le serveur va écouter (3000 par défaut ou défini dans le .env)
const PORT = process.env.PORT || 3000;

// 🔗 Middleware pour permettre les requêtes cross-origin (ex: React Native → Express)
app.use(cors());

// 🧠 Middleware pour lire les corps JSON des requêtes entrantes (POST, PUT, etc.)
app.use(bodyParser.json());

// ✅ Route de test (GET /) qui renvoie un message simple
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API Geocaching 🧭');
});

// 🔌 Connexion à la base MongoDB grâce à l'URL définie dans .env
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,          // pour éviter les warnings
  useUnifiedTopology: true        // nouvelle gestion des connexions Mongo
})
.then(() => {
  // ✅ Si la connexion réussit, on affiche un message et on lance le serveur
  console.log('✅ Connexion à MongoDB réussie');

  // 📡 Le serveur écoute les requêtes sur le port défini
  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  });

  // 📡 Utilisation des routes pour les utilisateurs et géocaches après la connexion réussie à MongoDB
  app.use('/api/users', userRoutes); // Ceci mappe la route '/api/users/register' et '/api/users/login'
  app.use('/api/geocaches', geocacheRoutes); // Ceci mappe la route '/api/geocaches' pour gérer les géocaches
  app.use('/api/leaderboard', leaderboardRoutes);


})
.catch(err => {
  // ❌ Si la connexion échoue, on affiche une erreur
  console.error('Erreur MongoDB ❌', err);
});
