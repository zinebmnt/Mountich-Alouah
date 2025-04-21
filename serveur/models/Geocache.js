// models/Geocache.js
const mongoose = require('mongoose');

// Schéma pour une géocache
const geocacheSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foundBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  timesFound: {
    type: Number,
    default: 0
  },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],  
}, { timestamps: true });

module.exports = mongoose.model('Geocache', geocacheSchema);