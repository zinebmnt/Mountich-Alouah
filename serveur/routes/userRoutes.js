// routes/userRoutes.js

// On importe les modules nécessaires
const express = require('express'); // Pour gérer les requêtes HTTP
const bcrypt = require('bcrypt');  // Pour le hashage des mots de passe
const jwt = require('jsonwebtoken');  // Pour générer le token JWT
const User = require('../models/User');  // Pour accéder au modèle User

// Création du router Express
const router = express.Router();

// Route pour l'inscription (POST /register)
router.post('/register', async (req, res) => {
  try {
    // Récupérer les données envoyées par le client (email et password)
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà dans la base de données
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hashage du mot de passe avant de le stocker
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un nouvel utilisateur
    const newUser = new User({
        email,
        passwordHash: hashedPassword  // On stocke le mot de passe haché
    });

    // Sauvegarde du nouvel utilisateur dans la base de données
    await newUser.save();

    // Création d'un token JWT
    const token = jwt.sign(
        { userId: newUser._id }, // On met l'ID de l'utilisateur dans le token
        process.env.JWT_SECRET,  // La clé secrète (voir .env)
        { expiresIn: '24h' }  // Le token expire dans 24 heures
    );

    // Envoi du token JWT en réponse
    res.status(201).json({ token });
  } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
  }
});
// Route pour la connexion (POST /login)
router.post('/login', async (req, res) => {
  try {
    // Récupérer les données envoyées par le client (email et password)
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe dans la base de données
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Comparer le mot de passe envoyé avec le mot de passe haché dans la base de données
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Si le mot de passe est correct, générer un token JWT
    const token = jwt.sign(
      { userId: user._id },  // L'ID de l'utilisateur est inclus dans le token
      process.env.JWT_SECRET,  // La clé secrète pour signer le token
      { expiresIn: '24h' }    // Le token expirera dans 24 heures
    );

    // Envoi du token JWT en réponse
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
// Route pour la connexion (POST /login)
router.post('/disconnect', async (req, res) => {
  try {
    // Récupérer les données envoyées par le client (email et password)
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe dans la base de données
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Comparer le mot de passe envoyé avec le mot de passe haché dans la base de données
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Si le mot de passe est correct, générer un token JWT
    const token = jwt.sign(
      { userId: user._id },  // L'ID de l'utilisateur est inclus dans le token
      process.env.JWT_SECRET,  // La clé secrète pour signer le token
      { expiresIn: '24h' }    // Le token expirera dans 24 heures
    );

    // Envoi du token JWT en réponse
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
// Route pour la déconnexion (POST /logout)
router.post('/logout', (req, res) => {
  // On ne fait rien côté serveur, juste un retour pour signaler la déconnexion
  res.status(200).json({ message: 'Déconnexion réussie' });
});
router.get('/profile', async (req, res) => {
  try {
    // Récupérer le token depuis l'en-tête de la requête
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    // Décoder le token et extraire l'ID de l'utilisateur
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur en fonction de l'ID du token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Retourner les informations de l'utilisateur
    res.status(200).json({ email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Export du router pour l'utiliser dans app.js
module.exports = router;
