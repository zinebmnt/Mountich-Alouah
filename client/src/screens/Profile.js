// src/screens/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Profile.css';
import Map from '../components/Map';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [geocaches, setGeocaches] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      setError('Veuillez vous connecter');
      return;
    }

    // Récupérer le profil utilisateur
    axios.get('http://localhost:3000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setUser(response.data))
    .catch(() => setError('Erreur lors de la récupération du profil'));

    // Récupérer les géocaches
    axios.get('http://localhost:3000/api/geocaches', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setGeocaches(response.data))
    .catch(err => console.error('Erreur lors de la récupération des géocaches', err));

    // Gérer la géolocalisation avec fallback
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.warn('❌ Erreur géolocalisation :', err.message);
          // Fallback sur Paris
          setUserLocation({ lat: 48.8566, lng: 2.3522 });
        }
      );
    } else {
      setError('La géolocalisation n\'est pas supportée par ce navigateur');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    window.location.href = '/login';
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h2>Profil utilisateur</h2>

      {user ? (
        <div>
          <p><strong>Email :</strong> {user.email}</p>

          {/* Carte affichant la position de l'utilisateur + géocaches */}
          {userLocation && (
            <Map 
              userLocation={userLocation} 
              geocaches={geocaches} 
              setGeocaches={setGeocaches}
            />
          )}

          <div className="button-group">
            <Link to="/add-geocache"><button>➕ Ajouter une géocache</button></Link>
            <Link to="/my-geocaches"><button>📍 Mes géocaches</button></Link>
            <button onClick={handleLogout}>🚪 Se déconnecter</button>
          </div>
        </div>
      ) : (
        <p>Chargement du profil...</p>
      )}
    </div>
  );
}

export default Profile;