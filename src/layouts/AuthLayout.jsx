import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const AuthLayout = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  // Marquer comme chargé après le montage du composant
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-300">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Section Branding - Visible seulement sur grand écran */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 text-white p-12 flex-col justify-between">
          <div>
            <Link to="/" className="text-3xl font-bold">
              WeGen
            </Link>
            <p className="mt-2 text-primary-100">
              Générateur de comptes automatique
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-md"
          >
            <h2 className="text-4xl font-bold mb-6">
              Générez des comptes en quelques secondes
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Notre plateforme vous permet de créer des comptes rapidement, en toute sécurité et avec un suivi complet de votre historique.
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div>
                <p className="font-medium">Thomas Dubois</p>
                <p className="text-sm text-primary-100">
                  "WeGen m'a permis de gagner un temps précieux dans la gestion de mes comptes."
                </p>
              </div>
            </div>
          </motion.div>
          
          <div className="text-sm text-primary-100">
            &copy; 2025 WeGen. Tous droits réservés.
          </div>
        </div>
        
        {/* Section Formulaire */}
        <div className="flex-1 flex flex-col p-6 lg:p-0">
          <div className="flex justify-end p-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300"
              aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Outlet />
              </motion.div>
            </div>
          </div>
          
          {/* Footer pour mobile uniquement */}
          <div className="lg:hidden text-center p-4 text-sm text-secondary-500 dark:text-secondary-400">
            &copy; 2025 WeGen. Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
