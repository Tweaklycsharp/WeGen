import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiMail, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dans une application réelle, vous appelleriez votre API ici
      // await authService.sendPasswordResetEmail(data.email);
      
      setEmailSent(true);
      toast.success('Instructions envoyées par email');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email de réinitialisation');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
          Mot de passe oublié
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          {emailSent 
            ? "Vérifiez votre boîte mail pour les instructions de réinitialisation." 
            : "Entrez votre adresse email pour recevoir les instructions de réinitialisation."}
        </p>
      </div>
      
      {!emailSent ? (
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Adresse email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", { 
                  required: "L'adresse email est requise",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Adresse email invalide"
                  }
                })}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.email ? 'border-red-300 dark:border-red-700' : 'border-secondary-300 dark:border-secondary-700'
                } rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="votre@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <FiRefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer les instructions"
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-center">
            <Link
              to="/login"
              className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <FiArrowLeft className="mr-1" />
              Retour à la connexion
            </Link>
          </div>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <p className="text-secondary-700 dark:text-secondary-300 mb-6">
            Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation de mot de passe.
          </p>
          
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
          >
            <FiArrowLeft className="mr-2" />
            Retour à la connexion
          </Link>
        </motion.div>
      )}
    </>
  );
};

export default ForgotPasswordPage;
