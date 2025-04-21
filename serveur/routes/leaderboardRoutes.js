// routes/leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Geocache = require('../models/Geocache');

// Classement : top joueurs
router.get('/top-users', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ foundCount: -1 })
      .limit(10)
      .select('email foundCount avatarUrl');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
  }
});

// Classement : caches les plus populaires
router.get('/popular-caches', async (req, res) => {
  try {
    const caches = await Geocache.find()
      .sort({ timesFound: -1 })
      .limit(10);
    res.json(caches);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des géocaches populaires." });
  }
});

// Classement : caches les plus rares
router.get('/rare-caches', async (req, res) => {
  try {
    const caches = await Geocache.find()
      .sort({ timesFound: 1 })
      .limit(10);
    res.json(caches);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des géocaches rares." });
  }
});

module.exports = router;
