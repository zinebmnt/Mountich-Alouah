import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Assurez-vous d'avoir ce fichier CSS pour le style
function Header() {
  const isLoggedIn = !!localStorage.getItem('jwt_token');

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">🔍 <strong>GeoFinder</strong></Link>
      </div>

      <nav className="nav-links">
        <Link to="/">Accueil</Link>
        
        {!isLoggedIn && (
          <>
            <Link to="/register">S'inscrire</Link>
            <Link to="/login">Se connecter</Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <Link to="/profile">Profil</Link>
            <Link to="/classement">Classement</Link>  

            <Link
              to="/"
              onClick={() => {
                localStorage.removeItem('jwt_token');
                window.location.reload();
              }}
            >
              Se déconnecter
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
