import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Lock, Text, FileUser, UserPlus, Undo2 } from 'lucide-react';
import { MyContext}  from '../context/MyContext';
import { baseAPI } from '../config/axios';

function Login() {
  const { setGlobalName, setGlobalAccountId } = useContext(MyContext);
  const [accountId, setAccountId] = useState('');
  const [name, setName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const createAccount = async () => {
      try {
        const {
          status, data
        } = await baseAPI.post(
          '/accounts/account',
          {
            name,
            identityCard: documentNumber,
            password,
          },
          { 
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000,
          },
        );

        if (status === 201) {
          setGlobalName(name);
          setGlobalAccountId(data.accountId);
          navigate('/home');
        }

        return;
      } catch (e) {
        return;
      }
    };

    const login = async () => {
      try {
        const {
          status,
        } = await baseAPI.post(
          '/login',
          {
            accountId,
            password,
          },
          { 
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000,
          },
        );

        if (status === 200) {
          navigate('/home');
        }

        return;
      } catch (e) {
        return;
      }
    };

    isCreatingAccount ? createAccount() : login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isCreatingAccount ? 'Conta' : 'Login'}
          </h1>
          <p className="text-gray-600">
            {isCreatingAccount
              ? 'Preencha os dados da sua conta'
              : 'Faça login para acessar sua conta'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        {
        isCreatingAccount ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <div className="relative">
                <Text className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome Completo"
                  required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Identidade
              </label>
              <div className="relative">
                <FileUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="11111111111"
                  required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required />
              </div>
            </div>
          </>
          ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número da Conta
              </label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="111111"
                  required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required />
              </div>
            </div>
          </>
          )
        }
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
          >
            {isCreatingAccount ? 'Criar' : 'Entrar'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreatingAccount(!isCreatingAccount)}
            className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-200 border border-gray-300"
          >
            {isCreatingAccount ? <Undo2 className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            {isCreatingAccount ? 'Voltar para login' : 'Criar sua conta'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
