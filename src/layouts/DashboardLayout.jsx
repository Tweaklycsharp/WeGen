import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiPlus, 
  FiClock, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX,
  FiMoon,
  FiSun
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Fermer automatiquement la sidebar sur les petits écrans
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    // Appel initial
    handleResize();
    
    // Ajouter l'écouteur d'événement
    window.addEventListener('resize', handleResize);
    
    // Nettoyer l'écouteur
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };
  
  // Navigation items
  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Tableau de bord', 
      icon: <FiHome size={20} /> 
    },
    { 
      path: '/generator', 
      label: 'Générateur', 
      icon: <FiPlus size={20} /> 
    },
    { 
      path: '/history', 
      label: 'Historique', 
      icon: <FiClock size={20} /> 
    },
    { 
      path: '/profile', 
      label: 'Profil', 
      icon: <FiUser size={20} /> 
    },
    { 
      path: '/settings', 
      label: 'Paramètres', 
      icon: <FiSettings size={20} /> 
    }
  ];
  
  return (
    <div className="flex h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Sidebar pour desktop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:flex flex-col fixed h-full bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 z-20"
          >
            <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                  W
                </div>
                <h1 className="text-xl font-bold text-secondary-900 dark:text-white">
                  WeGen
                </h1>
              </div>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-6 px-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center px-4 py-3 rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                          : 'text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-700/50'
                        }
                      `}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 rounded-lg transition-colors"
              >
                <FiLogOut className="mr-3" size={20} />
                <span>Déconnexion</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      
      {/* Contenu principal */}
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'lg:ml-[280px]' : ''} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              {/* Bouton toggle sidebar (desktop) */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:flex items-center justify-center h-10 w-10 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors"
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
              
              {/* Bouton toggle menu mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
              
              {/* Logo sur mobile */}
              <div className="lg:hidden flex items-center ml-2">
                <div className="h-8 w-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold mr-2">
                  W
                </div>
                <h1 className="text-xl font-bold text-secondary-900 dark:text-white">
                  WeGen
                </h1>
              </div>
            </div>
            
            <div className="flex items-center">
              {/* Toggle thème */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center h-10 w-10 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors mr-2"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
              
              {/* Profil utilisateur */}
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 font-medium">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">
                    {user?.username || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    {user?.email || 'utilisateur@exemple.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Menu mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 z-10"
            >
              <nav className="py-2 px-4">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) => `
                          flex items-center px-4 py-3 rounded-lg transition-colors
                          ${isActive 
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                            : 'text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-700/50'
                          }
                        `}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 rounded-lg transition-colors"
                    >
                      <FiLogOut className="mr-3" size={20} />
                      <span>Déconnexion</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
