import React, { useContext, useState } from 'react';
import { LogOut, Trash2, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MyContext} from '../context/MyContext';
import { baseAPI } from '../config/axios';
import TradingView from '../components/trading/TradingView';
import Portfolio from '../components/portfolio/Portfolio';

function Home() {
  const { setGlobalToken, globalToken, globalName, globalAccountId } = useContext(MyContext);
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePasswordUpdateButton = () => {
    setIsChangingPassword(!isChangingPassword);
    setError('');
    setSuccess('');
    setCurrentPassword('');
    setNewPassword('');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword) {
      setError('Por favor, preencha todos os campos!');
      return;
    }

    try {
      const {
        status, data
      } = await baseAPI.put(
        `/accounts/account/${globalAccountId}`,
        {
          currentPassword,
          newPassword,
        },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${globalToken}`,
           },
          timeout: 30000,
        },
      );

      if (status === 200) {
        setGlobalToken(data.token);
        setSuccess('Senha atualizada com sucesso!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setError('Houve algum problema. Tente novamente.');
      }

      return;
    } catch (e) {
      setError('Senha atual incorreta.');
      return;
    }
  };

  const handleDeleteAccountButton = () => {
    setShowDeleteModal(true);
    setDeletePassword('');
    setDeleteError('');
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePassword('');
    setDeleteError('');
    setIsDeleting(false);
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');
    setIsDeleting(true);

    if (!deletePassword) {
      setDeleteError('Por favor, insira sua senha para confirmar!');
      setIsDeleting(false);
      return;
    }

    try {
      const { status } = await baseAPI.delete(
        `/accounts/account/${globalAccountId}`,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${globalToken}`,
          },
          data: {
            password: deletePassword,
          },
          timeout: 30000,
        },
      );

      if (status === 200) {
        // Account deleted successfully, redirect to login
        navigate('/login');
        window.location.reload();
      } else {
        setDeleteError('Houve algum problema. Tente novamente.');
        setIsDeleting(false);
      }
    } catch (e) {
      setDeleteError('Senha incorreta ou erro no servidor.');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Meus Investimentos</h1>
            <div className="mx-right px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="px-4 sm:px-6 lg:px-8 text-1xl text-gray-900">{`Conta nº ${globalAccountId} - ${globalName}`}</h1>
              <button
                onClick={() => {
                  navigate('/login');
                  window.location.reload();
                }}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </header>
        <div className="mt-8 bg-white shadow rounded-lg flex justify-center items-start">
          <div className="lg:col-span-2 space-y-6">
            <TradingView />
          </div>
          <div className="space-y-6">
            <Portfolio />
          </div>
        </div>
        <div className="mt-8 bg-white shadow rounded-lg flex justify-center items-center">
          <div className="px-4 py-5 sm:p-6 flex justify-center items-center flex-col">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Configurações da Conta
            </h3>

            <div className="mt-5">
              <button
                onClick={handlePasswordUpdateButton}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isChangingPassword ? 'Fechar' : 'Alterar Senha'}
              </button>

              <button
                onClick={handleDeleteAccountButton}
                className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover Conta
              </button>
            </div>

            {isChangingPassword && (
              <form onSubmit={handlePasswordUpdate} className="mt-6 space-y-6 max-w-md">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {success}
                  </div>
                )}

                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Atualizar Senha
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar Remoção da Conta
                </h3>
              </div>
              <button
                onClick={handleCloseDeleteModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Esta ação é <strong>irreversível</strong>. Todos os seus dados serão permanentemente removidos.
                </p>
                <p className="text-sm text-gray-600">
                  Para confirmar, digite sua senha atual:
                </p>
              </div>

              <form onSubmit={handleDeleteAccount}>
                {deleteError && (
                  <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                    {deleteError}
                  </div>
                )}

                <div className="mb-6">
                  <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    id="deletePassword"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="Digite sua senha"
                    disabled={isDeleting}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseDeleteModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Removendo...' : 'Remover Conta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
