import axios from 'axios';

// Configuration de l'API
const API_URL = 'http://localhost:3001';

// Intercepteur pour ajouter le token d'authentification aux requêtes
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Connexion d'un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {Promise} - Promesse contenant les données de l'utilisateur et le token
 */
export const loginUser = async (email, password) => {
  try {
    // Dans un environnement réel, cela serait un appel API
    // Ici, nous simulons une réponse
    
    // Vérifier les identifiants (simulation)
    const response = await axios.get(`${API_URL}/users?email=${email}`);
    const user = response.data[0];
    
    if (!user || user.password !== password) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    // Générer un token JWT simulé
    const token = `simulated_jwt_token_${Date.now()}`;
    
    // Retirer le mot de passe avant de renvoyer l'utilisateur
    const { password: _, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, token };
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw new Error(error.message || 'Échec de la connexion');
  }
};

/**
 * Inscription d'un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur
 * @returns {Promise} - Promesse contenant les données de l'utilisateur et le token
 */
export const registerUser = async (userData) => {
  try {
    // Vérifier si l'email existe déjà
    const checkEmail = await axios.get(`${API_URL}/users?email=${userData.email}`);
    
    if (checkEmail.data.length > 0) {
      throw new Error('Cet email est déjà utilisé');
    }
    
    // Ajouter l'utilisateur à la base de données
    const response = await axios.post(`${API_URL}/users`, {
      ...userData,
      createdAt: new Date().toISOString(),
      accounts: []
    });
    
    // Générer un token JWT simulé
    const token = `simulated_jwt_token_${Date.now()}`;
    
    // Retirer le mot de passe avant de renvoyer l'utilisateur
    const { password: _, ...userWithoutPassword } = response.data;
    
    return { user: userWithoutPassword, token };
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    throw new Error(error.message || 'Échec de l\'inscription');
  }
};

/**
 * Récupérer les informations de l'utilisateur courant
 * @returns {Promise} - Promesse contenant les données de l'utilisateur
 */
export const getCurrentUser = async () => {
  try {
    // Dans un environnement réel, cela serait un appel API avec le token
    // Ici, nous simulons une réponse en récupérant l'ID de l'utilisateur depuis le token
    
    // Récupérer tous les utilisateurs (simulation)
    const response = await axios.get(`${API_URL}/users`);
    
    // Prendre le premier utilisateur pour simuler (dans un cas réel, on utiliserait le token)
    const user = response.data[0];
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    // Retirer le mot de passe avant de renvoyer l'utilisateur
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw new Error(error.message || 'Échec de la récupération de l\'utilisateur');
  }
};
