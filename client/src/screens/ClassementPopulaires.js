import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Classement.css';

function ClassementPopulaires() {
  const [caches, setCaches] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/leaderboard/popular-caches')
      .then(res => setCaches(res.data))
      .catch(() => console.error("Erreur populaires"));
  }, []);

  return (
    <div className="classement-container">
      <h2>🔥 Caches les plus populaires</h2>
      <ul className="classement-liste">
        {caches.map((c, i) => (
          <li
            key={c._id}
            className={`user-item ${i < 3 ? 'active' : 'inactive'}`}
          >
            <span className="rank-badge">{i + 1}</span>
            <span className="user-email">{c.title || "Sans titre"}</span>
            <span className="user-count">
              — {c.timesFound} {c.timesFound === 1 ? 'fois trouvée' : 'fois trouvée'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClassementPopulaires;
