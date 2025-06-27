import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Pour la validation de la confirmation du mot de passe
  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const success = await registerUser(data.username, data.email, data.password);
      if (success) {
        toast.success('Compte créé avec succès! Vous êtes maintenant connecté.');
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Vérification de la force du mot de passe
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const strengthMap = {
      1: { text: 'Faible', color: 'bg-danger-500' },
      2: { text: 'Moyen', color: 'bg-warning-500' },
      3: { text: 'Bon', color: 'bg-success-500' },
      4: { text: 'Excellent', color: 'bg-success-500' }
    };
    
    return { 
      strength, 
      ...strengthMap[strength] || { text: '', color: '' }
    };
  };
  
  const passwordStrength = getPasswordStrength(watch('password'));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
          Créer un compte
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Rejoignez WeGen et commencez à générer des comptes
        </p>
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400 p-4 rounded-lg mb-6 flex items-center"
        >
          <FiAlertCircle className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="username" className="label">
            Nom d'utilisateur
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-secondary-400 dark:text-secondary-500" />
            </div>
            <input
              id="username"
              type="text"
              className={`input pl-10 ${errors.username ? 'border-danger-500 dark:border-danger-500' : ''}`}
              placeholder="votre_pseudo"
              {...register('username', { 
                required: 'Le nom d\'utilisateur est requis',
                minLength: {
                  value: 3,
                  message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
                }
              })}
              disabled={isLoading}
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-danger-500">{errors.username.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="label">
            Adresse email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-secondary-400 dark:text-secondary-500" />
            </div>
            <input
              id="email"
              type="email"
              className={`input pl-10 ${errors.email ? 'border-danger-500 dark:border-danger-500' : ''}`}
              placeholder="vous@exemple.com"
              {...register('email', { 
                required: 'L\'email est requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Adresse email invalide'
                }
              })}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-danger-500">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="label">
            Mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-secondary-400 dark:text-secondary-500" />
            </div>
            <input
              id="password"
              type="password"
              className={`input pl-10 ${errors.password ? 'border-danger-500 dark:border-danger-500' : ''}`}
              placeholder="••••••••"
              {...register('password', { 
                required: 'Le mot de passe est requis',
                minLength: {
                  value: 8,
                  message: 'Le mot de passe doit contenir au moins 8 caractères'
                }
              })}
              disabled={isLoading}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-danger-500">{errors.password.message}</p>
          )}
          
          {/* Indicateur de force du mot de passe */}
          {watch('password') && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-secondary-500 dark:text-secondary-400">
                  Force du mot de passe:
                </span>
                <span className={`text-xs ${
                  passwordStrength.strength <= 1 ? 'text-danger-500' : 
                  passwordStrength.strength === 2 ? 'text-warning-500' : 
                  'text-success-500'
                }`}>
                  {passwordStrength.text}
                </span>
              </div>
              <div className="h-1 w-full bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${passwordStrength.color}`} 
                  style={{ width: `${passwordStrength.strength * 25}%` }}
                ></div>
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <FiCheckCircle className={`mr-1 ${
                    watch('password')?.length >= 8 ? 'text-success-500' : 'text-secondary-400'
                  }`} size={12} />
                  <span className="text-secondary-500 dark:text-secondary-400">
                    8 caractères minimum
                  </span>
                </div>
                <div className="flex items-center">
                  <FiCheckCircle className={`mr-1 ${
                    /[A-Z]/.test(watch('password') || '') ? 'text-success-500' : 'text-secondary-400'
                  }`} size={12} />
                  <span className="text-secondary-500 dark:text-secondary-400">
                    Une majuscule
                  </span>
                </div>
                <div className="flex items-center">
                  <FiCheckCircle className={`mr-1 ${
                    /[0-9]/.test(watch('password') || '') ? 'text-success-500' : 'text-secondary-400'
                  }`} size={12} />
                  <span className="text-secondary-500 dark:text-secondary-400">
                    Un chiffre
                  </span>
                </div>
                <div className="flex items-center">
                  <FiCheckCircle className={`mr-1 ${
                    /[^A-Za-z0-9]/.test(watch('password') || '') ? 'text-success-500' : 'text-secondary-400'
                  }`} size={12} />
                  <span className="text-secondary-500 dark:text-secondary-400">
                    Un caractère spécial
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="label">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-secondary-400 dark:text-secondary-500" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              className={`input pl-10 ${errors.confirmPassword ? 'border-danger-500 dark:border-danger-500' : ''}`}
              placeholder="••••••••"
              {...register('confirmPassword', { 
                required: 'Veuillez confirmer votre mot de passe',
                validate: value => value === password || 'Les mots de passe ne correspondent pas'
              })}
              disabled={isLoading}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-danger-500">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded dark:border-secondary-600 dark:bg-secondary-800"
            {...register('terms', { 
              required: 'Vous devez accepter les conditions d\'utilisation'
            })}
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-secondary-600 dark:text-secondary-400">
            J'accepte les{' '}
            <Link 
              to="#" 
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              conditions d'utilisation
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="mt-1 text-sm text-danger-500">{errors.terms.message}</p>
        )}
        
        <button
          type="submit"
          className="btn-primary w-full py-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Inscription en cours...
            </div>
          ) : (
            'Créer un compte'
          )}
        </button>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-secondary-600 dark:text-secondary-400">
          Vous avez déjà un compte?{' '}
          <Link 
            to="/login" 
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
