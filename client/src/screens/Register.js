// src/screens/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/users/register', {
        email,
        password,
      });

      // Sauvegarder le token et rediriger vers la page de profil
      localStorage.setItem('jwt_token', response.data.token);
      window.location.href = '/profile';
    } catch (err) {
      // Si une erreur est reçue du serveur, afficher le message d'erreur
      if (err.response && err.response.data.message) {
        setError(err.response.data.message); // Afficher le message d'erreur spécifique du serveur
      } else {
        setError('Erreur lors de l\'inscription'); // Erreur générique en cas d'échec
      }
    }
  };

  return (
    <div>
      <h2>S'inscrire</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">S'inscrire</button>
      </form>
      {/* Afficher l'erreur, si elle existe */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Register;
