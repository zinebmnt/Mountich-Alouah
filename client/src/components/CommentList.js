import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CommentList.css'; // Si tu as un fichier CSS dédié

function CommentList({ geocacheId, limit }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/geocaches/${geocacheId}/comments`)
      .then(res => {
        const data = res.data;
        setComments(limit ? data.slice(0, limit) : data);
      })
      .catch(err => console.error('Erreur chargement commentaires', err));
  }, [geocacheId, limit]);

  return (
    <div className="comments-section">
      <h4>💬 Commentaires</h4>
      {comments.length === 0 ? (
        <p>Aucun commentaire pour cette géocache.</p>
      ) : (
        <ul className="comments-list">
          {comments.map((c, i) => (
            <li key={i}>
              <strong>{c.user?.email || "Utilisateur inconnu"}</strong> : {c.text}
              <br />
              <small>{new Date(c.date).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentList;
