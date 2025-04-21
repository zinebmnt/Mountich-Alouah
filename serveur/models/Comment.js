// models/Comment.js
const mongoose = require('mongoose');

// Schéma pour un commentaire sur une cache
const commentSchema = new mongoose.Schema({
    text: {
    type: String,
    required: true
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence à l'utilisateur qui laisse le commentaire
    required: true
    },
    geocache: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Geocache', // Référence à la cache concernée
    required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
