import React, { useState } from 'react';
import axios from 'axios';

function AddGeocache() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');  // Nouveau state pour le message de succès

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwt_token');
    if (!token) {
      setError('Veuillez vous connecter');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/geocaches', {
        title,
        description,
        coordinates,
        difficulty,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si la géocache est ajoutée avec succès, afficher le message de succès et rediriger vers le profil
      setSuccessMessage('Géocache ajoutée avec succès!');
      
      // Rediriger vers la page de profil après un délai de 2 secondes
      setTimeout(() => {
        window.location.href = '/profile';
      }, 2000);  // 2000 ms = 2 secondes
    } catch (err) {
      setError('Erreur lors de l\'ajout de la géocache');
    }
  };

  return (
    <div>
      <h2>Ajouter une géocache</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Difficulté"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        />
        <input
          type="number"
          placeholder="Latitude"
          value={coordinates.lat}
          onChange={(e) => setCoordinates({ ...coordinates, lat: e.target.value })}
        />
        <input
          type="number"
          placeholder="Longitude"
          value={coordinates.lng}
          onChange={(e) => setCoordinates({ ...coordinates, lng: e.target.value })}
        />
        <button type="submit">Ajouter</button>
      </form>
      
      {/* Afficher le message d'erreur */}
      {error && <p>{error}</p>}
      
      {/* Afficher le message de succès */}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default AddGeocache;
