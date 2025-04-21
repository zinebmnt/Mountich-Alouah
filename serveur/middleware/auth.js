const jwt = require('jsonwebtoken');  // Bibliothèque pour manipuler les tokens JWT

// Fonction middleware pour vérifier l'authentification
function authMiddleware(req, res, next) {
  // Récupère le token JWT de l'en-tête 'Authorization' de la requête
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extrait le token JWT

  // Si aucun token n'est présent, retourner une erreur 401 (non autorisé)
  if (!token) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  try {
    // Vérifie le token JWT et décode les informations qu'il contient (par exemple, l'ID de l'utilisateur)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // La clé secrète est définie dans .env

    // Ajouter l'ID utilisateur à la requête (pour pouvoir l'utiliser dans la route)
    req.userId = decoded.userId;

    // Passe à la prochaine étape (middleware suivant ou la route)
    next();
  } catch (error) {
    // Si le token est invalide, retourne une erreur
    res.status(401).json({ message: 'Token invalide' });
  }
}

module.exports = authMiddleware;  // On exporte ce middleware pour pouvoir l'utiliser ailleurs
