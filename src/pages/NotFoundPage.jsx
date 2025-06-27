import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const NotFoundPage = () => {
  const { user } = useAuth();
  
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
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-lg w-full bg-white dark:bg-secondary-800 rounded-xl shadow-lg p-8 text-center"
      >
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-primary-500 dark:text-primary-400">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-white mt-4">
            Page non trouvée
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            <FiHome className="mr-2" />
            {user ? "Retour au tableau de bord" : "Retour à l'accueil"}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center px-6 py-3 bg-secondary-200 dark:bg-secondary-700 hover:bg-secondary-300 dark:hover:bg-secondary-600 text-secondary-900 dark:text-white font-medium rounded-lg transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Page précédente
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
