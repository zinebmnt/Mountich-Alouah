// src/components/FoundForm.js
import React, { useState } from 'react';
import axios from 'axios';

function FoundForm({ geocacheId }) {
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');

  const handleFound = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const res = await axios.post(`http://localhost:3000/api/geocaches/${geocacheId}/found`, {
        comment
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setStatus(res.data.message);
      setComment('');
    } catch (err) {
      setStatus("❌ Une erreur est survenue");
    }
  };

  return (
    <div>
      <textarea
        placeholder="Commentaire..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        style={{ width: '100%', marginTop: '10px' }}
      />
      <button onClick={handleFound} style={{ marginTop: '5px' }}>
        ✅ Marquer comme trouvée
      </button>
      {status && <p style={{ fontSize: '0.9rem', marginTop: '5px', color: 'green' }}>{status}</p>}
    </div>
  );
}

export default FoundForm;
