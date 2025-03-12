import React, { useContext } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MyContext} from '../context/MyContext';

function Home() {
  const { globalName, globalAccountId } = useContext(MyContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Meus Investimentos</h1>
          <div className="mx-right px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="px-4 sm:px-6 lg:px-8 text-1xl text-gray-900">{`Conta nº ${globalAccountId} - ${globalName}`}</h1>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Home;
