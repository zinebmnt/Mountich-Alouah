import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyGeocaches.css';
import { useNavigate } from 'react-router-dom';

function MyGeocaches() {
  const [geocaches, setGeocaches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGeocaches = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const res = await axios.get('http://localhost:3000/api/geocaches/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGeocaches(res.data);
      } catch (err) {
        console.error('Erreur récupération géocaches', err);
      }
    };

    fetchGeocaches();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Êtes-vous sûr de vouloir supprimer cette géocache ?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('jwt_token');
      await axios.delete(`http://localhost:3000/api/geocaches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGeocaches(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      console.error('Erreur suppression géocache', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-geocache/${id}`);
  };

  return (
    <div className="mygeocache-container">
      <h2>📍 Mes géocaches</h2>
      {geocaches.length === 0 ? (
        <p>Vous n'avez encore créé aucune géocache.</p>
      ) : (
        <ul className="mygeocache-list">
          {geocaches.map((cache) => (
            <li key={cache._id} className="mygeocache-item">
              <div className="geocache-info">
                <strong>{cache.title}</strong>
                <p>{cache.description}</p>
                <p>Trouvée {cache.timesFound || 0} fois</p>
              </div>
              <div className="geocache-actions">
                <button onClick={() => handleEdit(cache._id)} className="edit-btn">✏️ Modifier</button>
                <button onClick={() => handleDelete(cache._id)} className="delete-btn">❌ Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyGeocaches;
