import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Classement.css'; // Assure-toi d'importer le CSS

function ClassementUtilisateurs() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/leaderboard/top-users')
      .then(res => setUsers(res.data))
      .catch(() => console.error("Erreur utilisateurs"));
  }, []);

  return (
    <div className="classement-container">
      <h2>⭐ Meilleurs utilisateurs</h2>
      <ul className="classement-liste">
        {users.map((u, i) => (
          <li
            key={u._id}
            className={`user-item ${i < 3 ? 'active' : 'inactive'}`}
          >
            <span className="rank-badge">{i + 1}</span>
            <span className="user-email">{u.email}</span>
            <span className="user-count">
              — {u.foundCount || 0} {u.foundCount === 1 ? 'cache trouvée' : 'caches trouvées'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClassementUtilisateurs;
