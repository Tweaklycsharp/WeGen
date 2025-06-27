import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck, FiShield, FiZap, FiClock, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // Détecter le défilement pour changer le style de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation pour les éléments qui apparaissent
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  // Liste des fonctionnalités
  const features = [
    {
      icon: <FiZap className="text-primary-500" size={24} />,
      title: 'Génération Ultra Rapide',
      description: 'Obtenez des comptes en quelques secondes grâce à notre système optimisé.'
    },
    {
      icon: <FiShield className="text-primary-500" size={24} />,
      title: 'Sécurité Maximale',
      description: 'Toutes vos données sont chiffrées et protégées par les dernières technologies.'
    },
    {
      icon: <FiClock className="text-primary-500" size={24} />,
      title: 'Historique Complet',
      description: 'Accédez à l\'historique de tous vos comptes générés à tout moment.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-secondary-900 transition-colors duration-300">
      {/* Navigation */}
      <header 
        className={`fixed w-full z-10 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 dark:bg-secondary-900/90 backdrop-blur-sm shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            WeGen
          </Link>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300"
              aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="btn-primary"
              >
                Tableau de bord
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 mb-12 lg:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 dark:text-white mb-6">
                Générez des comptes <span className="text-primary-600 dark:text-primary-400">automatiquement</span>
              </h1>
              <p className="text-lg md:text-xl text-secondary-600 dark:text-secondary-300 mb-8">
                Une solution simple, rapide et sécurisée pour générer des comptes à la demande.
                Accédez à notre plateforme et commencez à générer en quelques clics.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to={isAuthenticated ? "/generator" : "/register"} 
                  className="btn-primary text-center py-3 px-8"
                >
                  {isAuthenticated ? 'Générer un compte' : 'Commencer gratuitement'}
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link 
                  to={isAuthenticated ? "/dashboard" : "/login"} 
                  className="btn-outline text-center py-3 px-8"
                >
                  {isAuthenticated ? 'Tableau de bord' : 'Se connecter'}
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 lg:pl-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-1">
                <div className="bg-white dark:bg-secondary-800 rounded-xl overflow-hidden">
                  <div className="bg-secondary-100 dark:bg-secondary-700 p-3 flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="text-xs text-secondary-500 dark:text-secondary-400 ml-2">
                      Générateur de Comptes
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">Type de compte</div>
                      <div className="bg-secondary-100 dark:bg-secondary-700 rounded-lg p-3 text-secondary-800 dark:text-secondary-200">
                        Email Premium
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">Options</div>
                      <div className="bg-secondary-100 dark:bg-secondary-700 rounded-lg p-3 text-secondary-800 dark:text-secondary-200">
                        Mot de passe sécurisé, Validité 30 jours
                      </div>
                    </div>
                    <button className="btn-primary w-full py-3 mt-2">
                      Générer maintenant
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-secondary-800 px-6">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Fonctionnalités principales
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
              Découvrez comment WeGen peut vous aider à générer et gérer vos comptes en toute simplicité.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariants}
                className="bg-white dark:bg-secondary-900 rounded-xl p-8 shadow-card card-hover"
              >
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div 
            className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-12 text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à commencer ?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Rejoignez des milliers d'utilisateurs qui font confiance à WeGen pour la génération de leurs comptes.
            </p>
            <Link 
              to={isAuthenticated ? "/generator" : "/register"}
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg bg-white text-primary-700 hover:bg-gray-100 transition-colors"
            >
              {isAuthenticated ? 'Générer un compte' : 'Créer un compte gratuit'}
              <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-secondary-900 py-12 px-6 border-t border-gray-200 dark:border-secondary-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                WeGen
              </Link>
              <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                © 2025 WeGen. Tous droits réservés.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <Link to="/login" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400">
                Connexion
              </Link>
              <Link to="/register" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400">
                Inscription
              </Link>
              <Link to="#" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400">
                Confidentialité
              </Link>
              <Link to="#" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400">
                Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
