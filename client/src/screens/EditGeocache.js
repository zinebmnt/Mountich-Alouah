import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditGeocache.css'; // si tu veux styliser

function EditGeocache() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [geocache, setGeocache] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3000/api/geocaches/${id}`)
      .then(res => setGeocache(res.data))
      .catch(err => {
        console.error('Erreur de récupération', err);
        setError("Impossible de récupérer la géocache.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGeocache(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwt_token');
      await axios.put(
        `http://localhost:3000/api/geocaches/${id}`,
        geocache,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Géocache mise à jour !');
      navigate('/my-geocaches');
    } catch (err) {
      console.error('Erreur mise à jour', err);
      setError(err.response?.data?.message || "Erreur lors de la mise à jour.");
    }
  };

  if (!geocache) return <p>Chargement...</p>;

  return (
    <div className="edit-container">
      <h2>🛠️ Modifier une géocache</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="edit-form">
        <label>Titre</label>
        <input
          type="text"
          name="title"
          value={geocache.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={geocache.description}
          onChange={handleChange}
          required
        />

        <label>Difficulté (1 à 5)</label>
        <input
          type="number"
          name="difficulty"
          min="1"
          max="5"
          value={geocache.difficulty || ''}
          onChange={handleChange}
        />

        <button type="submit" className="save-btn">💾 Sauvegarder</button>
      </form>
    </div>
  );
}

export default EditGeocache;
