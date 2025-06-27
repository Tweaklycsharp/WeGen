import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiSave, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage = () => {
  const { user, updateUserProfile, updateUserPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  // Formulaire pour les informations du profil
  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm();
  
  // Formulaire pour le changement de mot de passe
  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch
  } = useForm();
  
  // Observer le champ de mot de passe pour la validation
  const password = watch('newPassword', '');
  
  // Réinitialiser le formulaire quand l'utilisateur change
  useEffect(() => {
    if (user) {
      resetProfile({
        username: user.username || '',
        email: user.email || '',
        fullName: user.fullName || '',
      });
    }
  }, [user, resetProfile]);
  
  // Gérer la soumission du formulaire de profil
  const onProfileSubmit = async (data) => {
    setIsLoading(true);
    try {
      await updateUserProfile(data);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gérer la soumission du formulaire de mot de passe
  const onPasswordSubmit = async (data) => {
    setIsPasswordLoading(true);
    try {
      await updateUserPassword(data.currentPassword, data.newPassword);
      toast.success('Mot de passe mis à jour avec succès');
      resetPassword();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      toast.error('Erreur lors de la mise à jour du mot de passe');
    } finally {
      setIsPasswordLoading(false);
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
          Profil Utilisateur
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Gérez vos informations personnelles et vos préférences
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section de gauche - Avatar et informations rapides */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-1"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-6 mb-6"
          >
            <div className="flex flex-col items-center">
              <div className="h-32 w-32 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 text-4xl font-bold mb-4">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-1">
                {user?.username || 'Utilisateur'}
              </h2>
              <p className="text-secondary-500 dark:text-secondary-400 mb-4">
                {user?.email || 'utilisateur@exemple.com'}
              </p>
              
              <div className="w-full border-t border-secondary-200 dark:border-secondary-700 my-4"></div>
              
              <div className="w-full">
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-600 dark:text-secondary-400">Membre depuis</span>
                  <span className="text-secondary-900 dark:text-white font-medium">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString() 
                      : new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-600 dark:text-secondary-400">Statut</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Actif</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-secondary-400">Comptes générés</span>
                  <span className="text-secondary-900 dark:text-white font-medium">{user?.accountsGenerated || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Section de droite - Formulaires */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          {/* Formulaire d'informations du profil */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">
              Informations personnelles
            </h2>
            
            <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-secondary-400" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      {...registerProfile('username', { required: "Le nom d'utilisateur est requis" })}
                      className={`pl-10 w-full rounded-lg border ${
                        profileErrors.username 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-secondary-300 dark:border-secondary-600'
                      } bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600`}
                    />
                  </div>
                  {profileErrors.username && (
                    <p className="mt-1 text-sm text-red-500">{profileErrors.username.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Nom complet
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    {...registerProfile('fullName')}
                    className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-secondary-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      {...registerProfile('email', { 
                        required: "L'adresse email est requise",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Adresse email invalide"
                        }
                      })}
                      className={`pl-10 w-full rounded-lg border ${
                        profileErrors.email 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-secondary-300 dark:border-secondary-600'
                      } bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600`}
                    />
                  </div>
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{profileErrors.email.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
                >
                  {isLoading ? (
                    <FiRefreshCw className="animate-spin mr-2" />
                  ) : (
                    <FiSave className="mr-2" />
                  )}
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </motion.div>
          
          {/* Formulaire de changement de mot de passe */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">
              Changer le mot de passe
            </h2>
            
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <div className="space-y-6 mb-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-secondary-400" />
                    </div>
                    <input
                      id="currentPassword"
                      type="password"
                      {...registerPassword('currentPassword', { 
                        required: "Le mot de passe actuel est requis" 
                      })}
                      className={`pl-10 w-full rounded-lg border ${
                        passwordErrors.currentPassword 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-secondary-300 dark:border-secondary-600'
                      } bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600`}
                    />
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-secondary-400" />
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      {...registerPassword('newPassword', { 
                        required: "Le nouveau mot de passe est requis",
                        minLength: {
                          value: 8,
                          message: "Le mot de passe doit contenir au moins 8 caractères"
                        }
                      })}
                      className={`pl-10 w-full rounded-lg border ${
                        passwordErrors.newPassword 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-secondary-300 dark:border-secondary-600'
                      } bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600`}
                    />
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-secondary-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      {...registerPassword('confirmPassword', { 
                        required: "Veuillez confirmer le mot de passe",
                        validate: value => value === password || "Les mots de passe ne correspondent pas"
                      })}
                      className={`pl-10 w-full rounded-lg border ${
                        passwordErrors.confirmPassword 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-secondary-300 dark:border-secondary-600'
                      } bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600`}
                    />
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPasswordLoading}
                  className="flex items-center justify-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
                >
                  {isPasswordLoading ? (
                    <FiRefreshCw className="animate-spin mr-2" />
                  ) : (
                    <FiSave className="mr-2" />
                  )}
                  Mettre à jour le mot de passe
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
