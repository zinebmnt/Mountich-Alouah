import React from 'react';
import { Link } from 'react-router-dom';
import './Classement.css';

function Classement() {
  return (
    <div className="classement-container">
      <h2>🏆 Classement</h2>
      <div className="classement-cards">
        <Link to="/classement/utilisateurs" className="card-link">
          <div className="classement-card">
            <div className="emoji">⭐</div>
            <div className="title">Meilleurs utilisateurs</div>
          </div>
        </Link>

        <Link to="/classement/populaires" className="card-link">
          <div className="classement-card">
            <div className="emoji">🔥</div>
            <div className="title">Caches les plus populaires</div>
          </div>
        </Link>

        <Link to="/classement/rares" className="card-link">
          <div className="classement-card">
            <div className="emoji">🧊</div>
            <div className="title">Caches les plus rares</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Classement;
