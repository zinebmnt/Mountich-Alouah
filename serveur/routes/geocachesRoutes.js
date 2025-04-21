const express = require('express');
const Geocache = require('../models/Geocache');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Créer une géocache
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, coordinates } = req.body;
  const userId = req.userId;

  try {
    if (!title || !description || !coordinates) {
      return res.status(400).json({ message: 'Tous les champs doivent être remplis' });
    }

    const newGeocache = new Geocache({
      title,
      description,
      coordinates,
      creator: userId
    });

    await newGeocache.save();
    res.status(201).json(newGeocache);
  } catch (err) {
    console.error('Erreur création géocache', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Obtenir toutes les géocaches
router.get('/', async (req, res) => {
  try {
    const geocaches = await Geocache.find();
    res.status(200).json(geocaches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur récupération des géocaches' });
  }
});

// Marquer une géocache comme trouvée
// Marquer une géocache comme trouvée
router.post('/:id/found', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Trouver la géocache
    const geocache = await Geocache.findById(id);
    if (!geocache) {
      return res.status(404).json({ message: 'Géocache non trouvée' });
    }

    // Trouver l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'utilisateur n'a pas déjà trouvé cette géocache
    if (!geocache.foundBy.includes(userId)) {
      // Ajouter l'utilisateur à la liste des personnes qui ont trouvé cette géocache
      geocache.foundBy.push(userId);
      
      // Incrémenter le compteur de times found pour cette géocache
      geocache.timesFound += 1;
      await geocache.save();
      
      // Si l'utilisateur a un tableau de géocaches trouvées, ajouter celle-ci
      if (!user.foundCaches) {
        user.foundCaches = [];
      }
      
      // Ajouter cette géocache aux caches trouvées par l'utilisateur
      if (!user.foundCaches.includes(id)) {
        user.foundCaches.push(id);
        
        // Si l'utilisateur a un compteur de caches trouvées, l'incrémenter
        if (user.foundCount !== undefined) {
          user.foundCount += 1;
        }
        
        await user.save();
      }
    }

    res.status(200).json({ 
      message: '✅ Géocache marquée comme trouvée',
      geocache: geocache,
      userFoundCount: user.foundCount || user.foundCaches.length
    });
  } catch (err) {
    console.error('Erreur lors du marquage comme trouvée', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Ajouter un commentaire à une géocache
router.post('/:id/comment', authMiddleware, async (req, res) => {
  const { comment } = req.body;
  const userId = req.userId;

  try {
    const geocache = await Geocache.findById(req.params.id);
    if (!geocache) {
      return res.status(404).json({ message: 'Géocache non trouvée' });
    }

    geocache.comments.push({
      user: userId,
      text: comment,
      date: new Date()
    });

    await geocache.save();
    res.status(200).json({ message: '💬 Commentaire ajouté avec succès' });
  } catch (err) {
    console.error('Erreur ajout commentaire', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Modifier une géocache
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, coordinates, difficulty } = req.body;
  const userId = req.userId;

  try {
    const geocache = await Geocache.findById(req.params.id);
    if (!geocache) {
      return res.status(404).json({ message: 'Géocache non trouvée' });
    }

    if (geocache.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Non autorisé à modifier cette géocache' });
    }

    geocache.title = title || geocache.title;
    geocache.description = description || geocache.description;
    geocache.coordinates = coordinates || geocache.coordinates;
    geocache.difficulty = difficulty || geocache.difficulty;

    await geocache.save();
    res.status(200).json(geocache);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les géocaches de l'utilisateur connecté
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const geocaches = await Geocache.find({ creator: req.userId });
    res.status(200).json(geocaches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur récupération des géocaches' });
  }
});
// Récupérer les commentaires d'une géocache
router.get('/:id/comments', async (req, res) => {
  try {
    const geocache = await Geocache.findById(req.params.id).populate('comments.user', 'email');
    if (!geocache) {
      return res.status(404).json({ message: 'Géocache non trouvée' });
    }
    res.status(200).json(geocache.comments);
  } catch (err) {
    console.error('Erreur récupération des commentaires', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer une géocache par ID
router.get('/:id', async (req, res) => {
  try {
    const geocache = await Geocache.findById(req.params.id);
    if (!geocache) {
      return res.status(404).json({ message: 'Géocache non trouvée' });
    }
    res.status(200).json(geocache);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de la géocache' });
  }
});
// Supprimer une géocache
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const geocache = await Geocache.findById(req.params.id);
    if (!geocache) return res.status(404).json({ message: 'Géocache non trouvée' });

    if (geocache.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé à supprimer cette géocache' });
    }

    await geocache.deleteOne();
    res.status(200).json({ message: 'Géocache supprimée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour marquer une géocache comme trouvée
router.post('/:id/found', authMiddleware, async (req, res) => {
  const geocache = await Geocache.findById(req.params.id);
  if (!geocache) {
    return res.status(404).json({ message: 'Géocache non trouvée' });
  }
  geocache.foundCount += 1; // Incrémente le compteur des géocaches trouvées
  await geocache.save();
  res.status(200).json({ message: 'Géocache marquée comme trouvée' });
});



module.exports = router;
