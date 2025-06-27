import axios from 'axios';

// URL de base de l'API (simulée avec JSON Server)
const API_URL = 'http://localhost:3001';

// Fonction pour générer des noms d'utilisateur aléatoires
const generateRandomUsername = (service, type) => {
  const prefixes = ['cool', 'awesome', 'super', 'mega', 'ultra', 'hyper', 'pro', 'master', 'elite'];
  const suffixes = ['user', 'gamer', 'player', 'fan', 'lover', 'hero', 'king', 'queen', 'star'];
  const randomNum = Math.floor(Math.random() * 10000);
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix}_${suffix}${randomNum}`;
};

// Fonction pour générer des mots de passe aléatoires
const generateRandomPassword = (isSecure = true) => {
  const length = isSecure ? 16 : 8;
  const charset = isSecure 
    ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-='
    : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

// Fonction pour générer des emails aléatoires
const generateRandomEmail = (username, service, customDomain = false) => {
  const domains = customDomain 
    ? ['privateemail.com', 'securemail.org', 'protectedmail.net', 'safeemail.io']
    : ['gmail.com', 'outlook.com', 'yahoo.com', 'protonmail.com'];
  
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
};

// Classe de service pour la gestion des comptes
export const accountService = {
  // Récupérer l'historique des comptes
  async getAccountHistory() {
    try {
      // Essayer de récupérer depuis l'API
      const response = await axios.get(`${API_URL}/accounts`);
      return response.data;
    } catch (error) {
      console.warn('Fallback to local storage due to API error:', error);
      
      // Fallback vers le stockage local si l'API n'est pas disponible
      const localAccounts = localStorage.getItem('wegen_accounts');
      return localAccounts ? JSON.parse(localAccounts) : [];
    }
  },
  
  // Générer un nouveau compte
  async generateAccount(type, service, options = {}) {
    try {
      const username = generateRandomUsername(service, type);
      const password = generateRandomPassword(options.securePassword);
      
      // Créer l'objet de compte
      const account = {
        id: Date.now().toString(),
        type,
        service,
        username,
        password,
        isPremium: options.premium || false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 jours
      };
      
      // Ajouter un email pour les comptes de type email
      if (type === 'email') {
        account.email = generateRandomEmail(username, service, options.customDomain);
      }
      
      try {
        // Essayer de sauvegarder dans l'API
        const response = await axios.post(`${API_URL}/accounts`, account);
        return response.data;
      } catch (apiError) {
        console.warn('Fallback to local storage due to API error:', apiError);
        
        // Fallback vers le stockage local si l'API n'est pas disponible
        const localAccounts = localStorage.getItem('wegen_accounts');
        const accounts = localAccounts ? JSON.parse(localAccounts) : [];
        
        accounts.unshift(account); // Ajouter au début du tableau
        localStorage.setItem('wegen_accounts', JSON.stringify(accounts));
        
        return account;
      }
    } catch (error) {
      console.error('Error generating account:', error);
      throw new Error('Impossible de générer le compte');
    }
  },
  
  // Supprimer un compte
  async deleteAccount(id) {
    try {
      // Essayer de supprimer depuis l'API
      await axios.delete(`${API_URL}/accounts/${id}`);
      return true;
    } catch (error) {
      console.warn('Fallback to local storage due to API error:', error);
      
      // Fallback vers le stockage local si l'API n'est pas disponible
      const localAccounts = localStorage.getItem('wegen_accounts');
      
      if (localAccounts) {
        const accounts = JSON.parse(localAccounts);
        const updatedAccounts = accounts.filter(account => account.id !== id);
        localStorage.setItem('wegen_accounts', JSON.stringify(updatedAccounts));
      }
      
      return true;
    }
  },
  
  // Récupérer un compte spécifique
  async getAccount(id) {
    try {
      // Essayer de récupérer depuis l'API
      const response = await axios.get(`${API_URL}/accounts/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Fallback to local storage due to API error:', error);
      
      // Fallback vers le stockage local si l'API n'est pas disponible
      const localAccounts = localStorage.getItem('wegen_accounts');
      
      if (localAccounts) {
        const accounts = JSON.parse(localAccounts);
        return accounts.find(account => account.id === id) || null;
      }
      
      return null;
    }
  }
};

export default accountService;
