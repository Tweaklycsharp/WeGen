import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Récupérer l'URL de redirection si elle existe
  const from = location.state?.from?.pathname || '/dashboard';
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
          Connexion
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Accédez à votre tableau de bord
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
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="label">
              Mot de passe
            </label>
            <Link 
              to="#" 
              className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Mot de passe oublié?
            </Link>
          </div>
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
                  value: 6,
                  message: 'Le mot de passe doit contenir au moins 6 caractères'
                }
              })}
              disabled={isLoading}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-danger-500">{errors.password.message}</p>
          )}
        </div>
        
        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded dark:border-secondary-600 dark:bg-secondary-800"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-secondary-600 dark:text-secondary-400">
            Se souvenir de moi
          </label>
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full py-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Connexion en cours...
            </div>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-secondary-600 dark:text-secondary-400">
          Vous n'avez pas de compte?{' '}
          <Link 
            to="/register" 
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Créer un compte
          </Link>
        </p>
      </div>
      
      {/* Pour la démo, ajouter des identifiants de test */}
      <div className="mt-8 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-2">
          <strong>Pour la démo:</strong> Utilisez les identifiants suivants
        </p>
        <div className="text-xs text-secondary-600 dark:text-secondary-300">
          <p>Email: <span className="font-mono">demo@wegen.com</span></p>
          <p>Mot de passe: <span className="font-mono">password123</span></p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
