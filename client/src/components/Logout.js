// src/components/Logout.js
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';  // Pour rediriger après la déconnexion

function Logout() {
  const history = useHistory();

  useEffect(() => {
    // Supprimer le token du localStorage
    localStorage.removeItem('jwt_token');

    // Rediriger l'utilisateur vers la page de connexion
    history.push('/login');
  }, [history]);

  return (
    <div>
      <p>Déconnexion en cours...</p>
    </div>
  );
}

export default Logout;
