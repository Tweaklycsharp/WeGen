import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiMail, 
  FiTv, 
  FiUser, 
  FiGrid, 
  FiTrash2, 
  FiCopy, 
  FiCheck,
  FiSearch,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import { accountService } from '../../services/accountService';

const HistoryPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [copied, setCopied] = useState(null);
  
  useEffect(() => {
    fetchAccounts();
  }, []);
  
  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const data = await accountService.getAccountHistory();
      setAccounts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des comptes:', error);
      toast.error('Impossible de charger l\'historique des comptes');
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteAccount = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      try {
        await accountService.deleteAccount(id);
        setAccounts(accounts.filter(account => account.id !== id));
        toast.success('Compte supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error);
        toast.error('Impossible de supprimer le compte');
      }
    }
  };
  
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      
      setTimeout(() => {
        setCopied(null);
      }, 2000);
      
      toast.info('Copié dans le presse-papiers !');
    });
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
  
  // Filtrer les comptes en fonction de la recherche et du filtre
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.email && account.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      account.service.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = filter === 'all' || account.type === filter;
    
    return matchesSearch && matchesFilter;
  });
  
  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Historique des comptes
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Consultez et gérez tous vos comptes générés.
        </p>
      </div>
      
      {/* Filtres et recherche */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-card mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-secondary-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Rechercher un compte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FiFilter className="mr-2 text-secondary-500 dark:text-secondary-400" />
              <select
                className="input py-2"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Tous les types</option>
                <option value="email">Email</option>
                <option value="streaming">Streaming</option>
                <option value="social">Social</option>
                <option value="other">Autre</option>
              </select>
            </div>
            
            <button
              className="btn-secondary py-2 px-4 flex items-center"
              onClick={fetchAccounts}
            >
              <FiRefreshCw className="mr-2" />
              Actualiser
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredAccounts.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-secondary-800 rounded-xl shadow-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 dark:bg-secondary-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Nom d'utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                {filteredAccounts.map((account) => (
                  <tr 
                    key={account.id}
                    className="hover:bg-secondary-50 dark:hover:bg-secondary-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center mr-3">
                          {getAccountIcon(account.type)}
                        </div>
                        <span className="text-sm font-medium text-secondary-900 dark:text-white capitalize">
                          {account.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">
                        {account.service}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-sm text-secondary-900 dark:text-white font-mono mr-2">
                          {account.username}
                        </span>
                        <button
                          onClick={() => copyToClipboard(account.username, `username-${account.id}`)}
                          className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
                          aria-label="Copier le nom d'utilisateur"
                        >
                          {copied === `username-${account.id}` ? (
                            <FiCheck size={16} className="text-success-500" />
                          ) : (
                            <FiCopy size={16} />
                          )}
                        </button>
                      </div>
                      {account.email && (
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-secondary-500 dark:text-secondary-400 font-mono mr-2">
                            {account.email}
                          </span>
                          <button
                            onClick={() => copyToClipboard(account.email, `email-${account.id}`)}
                            className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
                            aria-label="Copier l'email"
                          >
                            {copied === `email-${account.id}` ? (
                              <FiCheck size={16} className="text-success-500" />
                            ) : (
                              <FiCopy size={16} />
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">
                        {new Date(account.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-500">
                        Actif
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => deleteAccount(account.id)}
                        className="text-danger-500 hover:text-danger-700 dark:hover:text-danger-400"
                        aria-label="Supprimer le compte"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-secondary-800 rounded-xl p-12 shadow-card text-center"
        >
          <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiSearch className="text-secondary-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            Aucun compte trouvé
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4 max-w-md mx-auto">
            {searchTerm || filter !== 'all' 
              ? 'Aucun compte ne correspond à vos critères de recherche. Essayez de modifier vos filtres.'
              : 'Vous n\'avez pas encore généré de compte. Rendez-vous sur la page générateur pour créer votre premier compte.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default HistoryPage;
