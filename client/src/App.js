// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Register from './screens/Register';
import Login from './screens/Login';
import Profile from './screens/Profile';
import AddGeocache from './screens/AddGeocache';
import EditGeocache from './screens/EditGeocache';
import MyGeocaches from './screens/MyGeocaches';
import Classement from './screens/Classement';
import ClassementUtilisateurs from './screens/ClassementUtilisateurs';
import ClassementPopulaires from './screens/ClassementPopulaires';
import ClassementRares from './screens/ClassementRares';
import Header from './components/Header';

import './App.css';

function Accueil() {
  return (
    <div className="home-hero">
      <h1>🎯 Bienvenue sur <span>GeoFinder</span></h1>
      <p>Rejoignez l'aventure, cachez et trouvez des trésors autour de vous !</p>
      <div className="cta-buttons">
        <Link to="/register"><button className="cta">S'inscrire</button></Link>
        <Link to="/login"><button className="cta">Se connecter</button></Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Accueil />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Routes protégées */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/add-geocache" element={<ProtectedRoute><AddGeocache /></ProtectedRoute>} />
          <Route path="/edit-geocache/:id" element={<ProtectedRoute><EditGeocache /></ProtectedRoute>} />
          <Route path="/my-geocaches" element={<ProtectedRoute><MyGeocaches /></ProtectedRoute>} />

          <Route path="/classement" element={<ProtectedRoute><Classement /></ProtectedRoute>} />
          <Route path="/classement/utilisateurs" element={<ProtectedRoute><ClassementUtilisateurs /></ProtectedRoute>} />
          <Route path="/classement/populaires" element={<ProtectedRoute><ClassementPopulaires /></ProtectedRoute>} />
          <Route path="/classement/rares" element={<ProtectedRoute><ClassementRares /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
