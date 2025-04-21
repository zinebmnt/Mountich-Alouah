const mongoose = require('mongoose');

// Définition du schéma pour un utilisateur
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // garantit que l'email sera unique dans la collection
  },
  passwordHash: {
    type: String,
    required: true,
  },
  foundCount: {
    type: Number,
    default: 0 // Nombre total de géocaches trouvées
  }
}, { timestamps: true }); // Ajoute `createdAt` et `updatedAt` automatiquement

module.exports = mongoose.model('User', userSchema);
