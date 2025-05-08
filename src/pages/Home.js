import React, { useContext, useState } from 'react';
import { LogOut } from 'lucide-react';
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
    </>
  );
}

export default Home;
