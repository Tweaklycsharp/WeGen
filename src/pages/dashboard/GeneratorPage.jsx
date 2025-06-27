import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiMail, 
  FiTv, 
  FiUser, 
  FiGrid, 
  FiCopy, 
  FiCheck, 
  FiAlertCircle,
  FiRefreshCw,
  FiLock
} from 'react-icons/fi';
import { accountService } from '../../services/accountService';

const GeneratorPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAccount, setGeneratedAccount] = useState(null);
  const [copied, setCopied] = useState({
    username: false,
    password: false,
    email: false
  });
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      type: 'email',
      service: '',
      options: {
        premium: true,
        securePassword: true
      }
    }
  });

  const accountType = watch('type');
  
  // Liste des services disponibles par type
  const serviceOptions = {
    email: ['Gmail', 'Outlook', 'ProtonMail', 'Yahoo', 'Autre'],
    streaming: ['Netflix', 'Disney+', 'Amazon Prime', 'Spotify', 'Deezer', 'Apple Music', 'Autre'],
    social: ['Instagram', 'Twitter', 'TikTok', 'Facebook', 'LinkedIn', 'Autre'],
    other: ['Générique', 'Cloud', 'VPN', 'Jeu', 'Autre']
  };

  // Icônes pour les types de comptes
  const typeIcons = {
    email: <FiMail className="text-blue-500" size={24} />,
    streaming: <FiTv className="text-purple-500" size={24} />,
    social: <FiUser className="text-green-500" size={24} />,
    other: <FiGrid className="text-gray-500" size={24} />
  };

  // Fonction pour générer un compte
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const account = await accountService.generateAccount(
        data.type, 
        data.service, 
        data.options
      );
      
      setGeneratedAccount(account);
      toast.success('Compte généré avec succès !');
      
      // Réinitialiser les états de copie
      setCopied({
        username: false,
        password: false,
        email: false
      });
    } catch (error) {
      console.error('Erreur lors de la génération du compte:', error);
      toast.error('Une erreur est survenue lors de la génération du compte');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour copier dans le presse-papiers
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(prev => ({ ...prev, [field]: true }));
      
      // Réinitialiser l'état après 2 secondes
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [field]: false }));
      }, 2000);
      
      toast.info('Copié dans le presse-papiers !');
    });
  };

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

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Générateur de comptes
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Configurez et générez un nouveau compte en quelques clics.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de génération */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-card"
          >
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6">
              Configuration du compte
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Type de compte */}
              <div>
                <label className="label mb-3">Type de compte</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.keys(typeIcons).map((type) => (
                    <label 
                      key={type}
                      className={`
                        flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border-2 transition-colors
                        ${accountType === type 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                          : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        value={type}
                        className="sr-only"
                        {...register('type')}
                      />
                      <div className="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center mb-2">
                        {typeIcons[type]}
                      </div>
                      <span className="text-sm font-medium text-secondary-900 dark:text-white capitalize">
                        {type === 'email' ? 'Email' : 
                         type === 'streaming' ? 'Streaming' : 
                         type === 'social' ? 'Social' : 'Autre'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Service */}
              <div>
                <label htmlFor="service" className="label">Service</label>
                <select
                  id="service"
                  className="input"
                  {...register('service', { required: 'Veuillez sélectionner un service' })}
                >
                  <option value="">Sélectionnez un service</option>
                  {serviceOptions[accountType].map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className="mt-1 text-sm text-danger-500">{errors.service.message}</p>
                )}
              </div>
              
              {/* Options */}
              <div>
                <label className="label mb-3">Options</label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="premium"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded dark:border-secondary-600 dark:bg-secondary-800"
                      {...register('options.premium')}
                    />
                    <label htmlFor="premium" className="ml-2 block text-sm text-secondary-600 dark:text-secondary-400">
                      Compte premium (fonctionnalités avancées)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="securePassword"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded dark:border-secondary-600 dark:bg-secondary-800"
                      {...register('options.securePassword')}
                    />
                    <label htmlFor="securePassword" className="ml-2 block text-sm text-secondary-600 dark:text-secondary-400">
                      Mot de passe sécurisé (plus complexe)
                    </label>
                  </div>
                  
                  {accountType === 'email' && (
                    <div className="flex items-center">
                      <input
                        id="customDomain"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded dark:border-secondary-600 dark:bg-secondary-800"
                        {...register('options.customDomain')}
                      />
                      <label htmlFor="customDomain" className="ml-2 block text-sm text-secondary-600 dark:text-secondary-400">
                        Domaine personnalisé
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bouton de génération */}
              <button
                type="submit"
                className="btn-primary w-full py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Génération en cours...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FiRefreshCw className="mr-2" />
                    Générer un compte
                  </div>
                )}
              </button>
            </form>
          </motion.div>
        </div>
        
        {/* Résultat de la génération */}
        <div className="lg:col-span-1">
          {generatedAccount ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-secondary-800 rounded-xl shadow-card overflow-hidden"
            >
              <div className="bg-primary-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Compte généré</h3>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {generatedAccount.type.charAt(0).toUpperCase() + generatedAccount.type.slice(1)}
                  </span>
                </div>
                <p className="text-sm opacity-80 mt-1">{generatedAccount.service}</p>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Nom d'utilisateur */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-secondary-500 dark:text-secondary-400">
                      Nom d'utilisateur
                    </label>
                    <button
                      onClick={() => copyToClipboard(generatedAccount.username, 'username')}
                      className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                      aria-label="Copier le nom d'utilisateur"
                    >
                      {copied.username ? <FiCheck size={16} /> : <FiCopy size={16} />}
                    </button>
                  </div>
                  <div className="bg-secondary-50 dark:bg-secondary-700/30 rounded-lg p-3 font-mono text-sm break-all">
                    {generatedAccount.username}
                  </div>
                </div>
                
                {/* Mot de passe */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-secondary-500 dark:text-secondary-400">
                      Mot de passe
                    </label>
                    <button
                      onClick={() => copyToClipboard(generatedAccount.password, 'password')}
                      className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                      aria-label="Copier le mot de passe"
                    >
                      {copied.password ? <FiCheck size={16} /> : <FiCopy size={16} />}
                    </button>
                  </div>
                  <div className="bg-secondary-50 dark:bg-secondary-700/30 rounded-lg p-3 font-mono text-sm break-all relative">
                    <div className="flex items-center">
                      <FiLock className="mr-2 text-secondary-400" size={14} />
                      <span>••••••••••••••</span>
                    </div>
                  </div>
                </div>
                
                {/* Email (si applicable) */}
                {generatedAccount.email && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-secondary-500 dark:text-secondary-400">
                        Email
                      </label>
                      <button
                        onClick={() => copyToClipboard(generatedAccount.email, 'email')}
                        className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                        aria-label="Copier l'email"
                      >
                        {copied.email ? <FiCheck size={16} /> : <FiCopy size={16} />}
                      </button>
                    </div>
                    <div className="bg-secondary-50 dark:bg-secondary-700/30 rounded-lg p-3 font-mono text-sm break-all">
                      {generatedAccount.email}
                    </div>
                  </div>
                )}
                
                {/* Informations supplémentaires */}
                <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400">
                    <FiAlertCircle className="mr-2" size={16} />
                    <span>Ce compte est valide pendant 30 jours</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-card h-full flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mb-4">
                <FiRefreshCw className="text-secondary-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                Aucun compte généré
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-4 max-w-xs">
                Configurez les options à gauche et cliquez sur "Générer un compte" pour créer un nouveau compte.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;
