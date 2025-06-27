import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiSave, 
  FiRefreshCw, 
  FiMoon, 
  FiSun, 
  FiGlobe, 
  FiBell, 
  FiShield, 
  FiTrash2 
} from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, deleteAccount } = useAuth();
  
  // États pour les paramètres
  const [language, setLanguage] = useState('fr');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoLogout, setAutoLogout] = useState(30);
  const [securityLevel, setSecurityLevel] = useState('standard');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  
  // Charger les paramètres depuis le localStorage ou les valeurs par défaut
  useEffect(() => {
    const savedSettings = localStorage.getItem('wegen_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setLanguage(settings.language || 'fr');
      setNotificationsEnabled(settings.notificationsEnabled !== false);
      setAutoLogout(settings.autoLogout || 30);
      setSecurityLevel(settings.securityLevel || 'standard');
    }
  }, []);
  
  // Sauvegarder les paramètres
  const saveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sauvegarder dans le localStorage
      const settings = {
        language,
        notificationsEnabled,
        autoLogout,
        securityLevel
      };
      
      localStorage.setItem('wegen_settings', JSON.stringify(settings));
      
      toast.success('Paramètres enregistrés avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Supprimer le compte
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user?.username) {
      toast.error('Veuillez saisir votre nom d\'utilisateur pour confirmer');
      return;
    }
    
    setIsDeleteLoading(true);
    
    try {
      await deleteAccount();
      toast.success('Votre compte a été supprimé avec succès');
      // La redirection sera gérée par le contexte d'authentification
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      toast.error('Erreur lors de la suppression du compte');
      setIsDeleteLoading(false);
    }
  };
  
  // Animation pour les éléments de la page
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 100
      } 
    }
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
          Paramètres
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Configurez vos préférences pour l'application
        </p>
      </motion.div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Paramètres d'interface */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6 flex items-center">
            <FiGlobe className="mr-2" />
            Interface et préférences
          </h2>
          
          <div className="space-y-6">
            {/* Thème */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Thème
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                    theme === 'light' 
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                      : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-700/50 dark:text-secondary-400'
                  }`}
                >
                  <FiSun className="mr-2" />
                  Clair
                </button>
                <button
                  onClick={toggleTheme}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                      : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-700/50 dark:text-secondary-400'
                  }`}
                >
                  <FiMoon className="mr-2" />
                  Sombre
                </button>
              </div>
            </div>
            
            {/* Langue */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Langue
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            
            {/* Notifications */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Notifications
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label htmlFor="notifications" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                  Activer les notifications
                </label>
              </div>
              <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                Recevez des notifications pour les nouveaux comptes générés et les mises à jour importantes
              </p>
            </div>
            
            {/* Déconnexion automatique */}
            <div>
              <label htmlFor="autoLogout" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Déconnexion automatique (minutes d'inactivité)
              </label>
              <input
                type="number"
                id="autoLogout"
                min="5"
                max="120"
                value={autoLogout}
                onChange={(e) => setAutoLogout(parseInt(e.target.value))}
                className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
              />
            </div>
          </div>
        </motion.div>
        
        {/* Paramètres de sécurité */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6 flex items-center">
              <FiShield className="mr-2" />
              Sécurité
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="securityLevel" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Niveau de sécurité
                </label>
                <select
                  id="securityLevel"
                  value={securityLevel}
                  onChange={(e) => setSecurityLevel(e.target.value)}
                  className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
                >
                  <option value="basic">Basique</option>
                  <option value="standard">Standard</option>
                  <option value="high">Élevé</option>
                </select>
                <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                  {securityLevel === 'basic' && "Génération de mots de passe simples et moins sécurisés"}
                  {securityLevel === 'standard' && "Équilibre entre sécurité et facilité d'utilisation"}
                  {securityLevel === 'high' && "Mots de passe complexes et sécurité renforcée"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Bouton de sauvegarde */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-6">
            <button
              onClick={saveSettings}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <FiRefreshCw className="animate-spin mr-2" />
              ) : (
                <FiSave className="mr-2" />
              )}
              Enregistrer les paramètres
            </button>
          </div>
        </motion.div>
        
        {/* Suppression de compte */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-3 bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-6 border-l-4 border-red-500"
        >
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6 flex items-center">
            <FiTrash2 className="mr-2 text-red-500" />
            Supprimer le compte
          </h2>
          
          <div className="space-y-4">
            <p className="text-secondary-600 dark:text-secondary-400">
              La suppression de votre compte est définitive et irréversible. Toutes vos données, y compris vos comptes générés, seront supprimées.
            </p>
            
            <div>
              <label htmlFor="deleteConfirmation" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Pour confirmer, saisissez votre nom d'utilisateur : <span className="font-semibold">{user?.username}</span>
              </label>
              <input
                type="text"
                id="deleteConfirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder={`Saisissez "${user?.username}" pour confirmer`}
              />
            </div>
            
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleteLoading || deleteConfirmation !== user?.username}
              className="flex items-center justify-center px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
            >
              {isDeleteLoading ? (
                <FiRefreshCw className="animate-spin mr-2" />
              ) : (
                <FiTrash2 className="mr-2" />
              )}
              Supprimer définitivement mon compte
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
