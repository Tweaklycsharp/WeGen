import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiClock, 
  FiUser, 
  FiMail, 
  FiTv, 
  FiGrid, 
  FiArrowRight, 
  FiTrendingUp, 
  FiCheckCircle 
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { accountService } from '../../services/accountService';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAccounts: 0,
    emailAccounts: 0,
    streamingAccounts: 0,
    socialAccounts: 0,
    otherAccounts: 0
  });
  const [recentAccounts, setRecentAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer l'historique des comptes
        const accounts = await accountService.getAccountHistory();
        
        // Calculer les statistiques
        const emailAccounts = accounts.filter(acc => acc.type === 'email').length;
        const streamingAccounts = accounts.filter(acc => acc.type === 'streaming').length;
        const socialAccounts = accounts.filter(acc => acc.type === 'social').length;
        const otherAccounts = accounts.filter(acc => acc.type === 'other').length;
        
        setStats({
          totalAccounts: accounts.length,
          emailAccounts,
          streamingAccounts,
          socialAccounts,
          otherAccounts
        });
        
        // Récupérer les 5 derniers comptes générés
        setRecentAccounts(accounts.slice(0, 5));
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Animation pour les éléments qui apparaissent
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Fonction pour obtenir l'icône en fonction du type de compte
  const getAccountIcon = (type) => {
    switch (type) {
      case 'email':
        return <FiMail className="text-blue-500" />;
      case 'streaming':
        return <FiTv className="text-purple-500" />;
      case 'social':
        return <FiUser className="text-green-500" />;
      default:
        return <FiGrid className="text-gray-500" />;
    }
  };

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Bienvenue, {user?.username || 'Utilisateur'} ! Voici un aperçu de votre activité.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariants}
              className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <FiGrid className="text-primary-500" size={24} />
                </div>
                <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                  Total
                </span>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
                {stats.totalAccounts}
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Comptes générés
              </p>
            </motion.div>
            
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariants}
              className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <FiMail className="text-blue-500" size={24} />
                </div>
                <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                  Email
                </span>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
                {stats.emailAccounts}
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Comptes email
              </p>
            </motion.div>
            
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariants}
              className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <FiTv className="text-purple-500" size={24} />
                </div>
                <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                  Streaming
                </span>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
                {stats.streamingAccounts}
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Comptes streaming
              </p>
            </motion.div>
            
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariants}
              className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <FiUser className="text-green-500" size={24} />
                </div>
                <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                  Social
                </span>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
                {stats.socialAccounts}
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Comptes sociaux
              </p>
            </motion.div>
          </div>
          
          {/* Actions rapides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-card mb-8"
          >
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                to="/generator"
                className="bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors rounded-lg p-4 flex items-center"
              >
                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white mr-3">
                  <FiPlus size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-secondary-900 dark:text-white">
                    Nouveau compte
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Générer un compte
                  </p>
                </div>
              </Link>
              
              <Link 
                to="/history"
                className="bg-secondary-50 dark:bg-secondary-700/30 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors rounded-lg p-4 flex items-center"
              >
                <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center text-white mr-3">
                  <FiClock size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-secondary-900 dark:text-white">
                    Historique
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Voir tous les comptes
                  </p>
                </div>
              </Link>
              
              <Link 
                to="/profile"
                className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors rounded-lg p-4 flex items-center"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-3">
                  <FiUser size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-secondary-900 dark:text-white">
                    Profil
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Gérer votre compte
                  </p>
                </div>
              </Link>
              
              <div className="bg-secondary-50 dark:bg-secondary-700/30 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors rounded-lg p-4 flex items-center">
                <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center text-white mr-3">
                  <FiTrendingUp size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-secondary-900 dark:text-white">
                    Statistiques
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Voir les tendances
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Derniers comptes générés */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                Derniers comptes générés
              </h2>
              <Link 
                to="/history" 
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
              >
                Voir tout
                <FiArrowRight className="ml-1" size={16} />
              </Link>
            </div>
            
            {recentAccounts.length > 0 ? (
              <div className="space-y-4">
                {recentAccounts.map((account, index) => (
                  <div 
                    key={account.id} 
                    className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700/30 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-secondary-200 dark:bg-secondary-600 flex items-center justify-center mr-3">
                        {getAccountIcon(account.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-secondary-900 dark:text-white">
                          {account.username || account.email}
                        </h3>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          {account.service} • {new Date(account.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400 bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded-full">
                        {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                      </span>
                      <div className="ml-2 w-2 h-2 rounded-full bg-success-500"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="text-secondary-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                  Aucun compte généré
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Vous n'avez pas encore généré de compte.
                </p>
                <Link 
                  to="/generator" 
                  className="btn-primary inline-flex items-center"
                >
                  Générer un compte
                  <FiPlus className="ml-2" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
