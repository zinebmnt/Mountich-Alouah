import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CommentList from './CommentList';
import './Map.css'; // <-- ajoute ça tout en haut


// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function MapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function Map({ userLocation, geocaches, setGeocaches }) {
  const defaultPosition = [48.8566, 2.3522];
  const [position, setPosition] = useState(userLocation || defaultPosition);
  const [selectedGeocache, setSelectedGeocache] = useState(null);
  const [selectedModalGeocache, setSelectedModalGeocache] = useState(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (userLocation) {
      setPosition([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  const handleCommentSubmit = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) return navigate('/login');

      await axios.post(`http://localhost:3000/api/geocaches/${selectedGeocache._id}/comment`, { comment }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatus('✅ Commentaire ajouté');
      setComment('');
      const refreshed = await axios.get('http://localhost:3000/api/geocaches');
      setGeocaches(refreshed.data);
    } catch (err) {
      setStatus('❌ Erreur commentaire');
    }
  };

  const handleMarkAsFound = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) return navigate('/login');

      await axios.post(`http://localhost:3000/api/geocaches/${selectedGeocache._id}/found`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatus('✅ Marqué comme trouvée');
      const refreshed = await axios.get('http://localhost:3000/api/geocaches');
      setGeocaches(refreshed.data);
    } catch (err) {
      setStatus('❌ Erreur trouvée');
    }
  };

  return (
    <div style={{ height: '500px', marginBottom: '30px' }}>
      <MapContainer center={position} zoom={13} style={{ height: '100%' }} scrollWheelZoom>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapView center={position} />
        <Marker position={position}><Popup>📍 Vous êtes ici</Popup></Marker>

        {geocaches.map((geocache) => (
          <Marker key={geocache._id} position={[geocache.coordinates?.lat || 0, geocache.coordinates?.lng || 0]}
            eventHandlers={{ click: () => setSelectedGeocache(geocache) }}>
            <Popup>
              <strong>{geocache.title}</strong><br />
              {geocache.description}<br />
              Trouvée : {geocache.timesFound} fois
              <CommentList geocacheId={geocache._id} limit={2} />
              <button onClick={() => setSelectedModalGeocache(geocache)} className="open-modal-btn">
                Voir tous les commentaires
              </button>
              <button onClick={() => setSelectedGeocache(geocache)} className="open-modal-btn">
                Détails & Commenter
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Modal: Tous les commentaires */}
      {selectedModalGeocache && (
        <div className="modal-overlay" onClick={() => setSelectedModalGeocache(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>💬 Commentaires de <strong>{selectedModalGeocache.title}</strong></h3>
            <CommentList geocacheId={selectedModalGeocache._id} />
            <button onClick={() => setSelectedModalGeocache(null)} className="close-btn">Fermer</button>
          </div>
        </div>
      )}

      {/* Modal: Détails & Commentaire */}
      {selectedGeocache && (
        <div className="modal-overlay" onClick={() => setSelectedGeocache(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedGeocache.title}</h2>
            <p>{selectedGeocache.description}</p>
            <p>Trouvée : {selectedGeocache.timesFound} fois</p>

            <button onClick={handleMarkAsFound}>✅ Marquer comme trouvée</button>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Ajouter un commentaire" />
            <button onClick={handleCommentSubmit}>Envoyer</button>
            <button className="close-btn" onClick={() => setSelectedGeocache(null)}>Fermer</button>

            {status && <p>{status}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Map;
