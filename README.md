# Mountich-Alouah
# 🌍 GeoFinder — Application de Géocaching (Version Web)

GeoFinder est une application web qui permet aux utilisateurs d'ajouter, localiser, commenter et marquer comme trouvées des géocaches autour d'eux. Elle inclut également un système de classement des utilisateurs et des caches.

---

## 🚀 Fonctionnalités principales

- 🔐 Authentification (inscription & connexion JWT)
- 🗺️ Carte interactive (Leaflet) avec position utilisateur + géocaches
- 🗃️ Ajout, édition et suppression de géocaches
- 💬 Système de commentaires
- ✅ Marquage des caches comme trouvées
- 🏆 Classement :
  - Meilleurs utilisateurs
  - Caches les plus populaires
  - Caches les plus rares

---

## 📁 Structure du projet

```bash
client/
│
├── public/
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Map.js
│   │   ├── CommentList.js
│   │   └── ProtectedRoute.js
│   ├── screens/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Profile.js
│   │   ├── MyGeocaches.js
│   │   ├── AddGeocache.js
│   │   ├── EditGeocache.js
│   │   └── Classement.js (+ variantes)
│   ├── App.js
│   └── index.js

└── package.json

serveur/
├── app.js                     # Point d'entrée de l'application
├── middleware/                # Middlewares personnalisés (authentification JWT, erreurs)
│   └── auth.js
├── models/                    # Modèles Mongoose (User, Geocache, etc.)
│   ├── User.js
│   └── Geocache.js
├── routes/                    # Routes principales
│   ├── authRoutes.js
│   ├── geocacheRoutes.js
│   └── leaderboardRoutes.js
├── package.json
├── package-lock.json
└── node_modules/
```

Ce projet a été réalisé par Salma et Zineb. Voici leurs contributions respectives :
Salma :

    Fonctionnalité d'inscription et d'authentification :

        Mise en place de l'inscription des utilisateurs avec email et mot de passe.

        Implémentation de l'authentification via JWT pour sécuriser l'accès à l'application.

        Création des routes de connexion et de déconnexion.

    Gestion des géocaches :

        Développement de la fonctionnalité permettant à un utilisateur d'ajouter, modifier et supprimer ses géocaches.

        Gestion des commentaires associés aux géocaches (ajout et affichage des commentaires).

Zineb :

    Affichage des géocaches sur la carte :

        Intégration de Leaflet pour afficher la carte et les géocaches dessus.

        Création des fonctionnalités permettant de visualiser les géocaches proches de l'utilisateur.

    Gestion de l'interface utilisateur (UI) :

        Création des différentes pages (accueil, profil utilisateur, ajout de géocache, etc.).

        Développement des composants d'interface utilisateur pour gérer l'affichage et la mise à jour des informations.


