import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

// Configuration de l'API
const API_URL = 'http://localhost:3001';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Récupérer l'utilisateur depuis l'API
          const response = await axios.get(`${API_URL}/users/1`);
          setUser(response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Vérifier les identifiants
      const response = await axios.get(`${API_URL}/users?email=${email}`);
      const userData = response.data[0];
      
      if (!userData || userData.password !== password) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Générer un token simulé
      const token = `simulated_jwt_token_${Date.now()}`;
      localStorage.setItem('token', token);
      
      // Retirer le mot de passe avant de stocker l'utilisateur
      const { password: _, ...userWithoutPassword } = userData;
      setUser(userWithoutPassword);
      
      toast.success('Connexion réussie !');
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error(error.message || 'Échec de la connexion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (username, email, password) => {
    setLoading(true);
    try {
      // Vérifier si l'email existe déjà
      const checkEmail = await axios.get(`${API_URL}/users?email=${email}`);
      
      if (checkEmail.data.length > 0) {
        throw new Error('Cet email est déjà utilisé');
      }
      
      // Créer un nouvel utilisateur
      const newUser = {
        username,
        email,
        password,
        fullName: username,
        createdAt: new Date().toISOString(),
        accountsGenerated: 0,
        role: 'user',
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        settings: {
          theme: 'light',
          language: 'fr',
          notificationsEnabled: true,
          autoLogout: 30,
          securityLevel: 'standard'
        }
      };
      
      // Ajouter l'utilisateur à la base de données
      const response = await axios.post(`${API_URL}/users`, newUser);
      
      // Générer un token simulé
      const token = `simulated_jwt_token_${Date.now()}`;
      localStorage.setItem('token', token);
      
      // Retirer le mot de passe avant de stocker l'utilisateur
      const { password: _, ...userWithoutPassword } = response.data;
      setUser(userWithoutPassword);
      
      toast.success('Inscription réussie !');
      return true;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      toast.error(error.message || 'Échec de l\'inscription');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Vous êtes déconnecté');
  };

  // Fonction pour supprimer le compte
  const deleteAccount = async () => {
    if (!user) return;
    
    try {
      await axios.delete(`${API_URL}/users/${user.id}`);
      localStorage.removeItem('token');
      setUser(null);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      throw error;
    }
  };

  // Fonction pour mettre à jour le profil
  const updateUserProfile = async (profileData) => {
    if (!user) return false;
    
    try {
      const response = await axios.patch(`${API_URL}/users/${user.id}`, profileData);
      setUser(response.data);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  };

  // Fonction pour mettre à jour le mot de passe
  const updateUserPassword = async (currentPassword, newPassword) => {
    if (!user) return false;
    
    try {
      // Vérifier le mot de passe actuel
      const response = await axios.get(`${API_URL}/users/${user.id}`);
      const userData = response.data;
      
      if (userData.password !== currentPassword) {
        throw new Error('Mot de passe actuel incorrect');
      }
      
      // Mettre à jour le mot de passe
      await axios.patch(`${API_URL}/users/${user.id}`, { password: newPassword });
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    deleteAccount,
    updateUserProfile,
    updateUserPassword,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
