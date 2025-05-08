import React, { useContext, useState, useEffect } from 'react';
import PortfolioList from './PortfolioList';
import { MyContext} from '../../context/MyContext';
import { baseAPI } from '../../config/axios';

const Portfolio = () => {
  const { globalToken, globalAccountId, assets, setAssets } = useContext(MyContext);
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleAssets = async () => {
      setError('');
      setPositions([]);
  
      try {
        const {
          status, data
        } = await baseAPI.get(
          `assets/account/${globalAccountId}`,
          { 
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${globalToken}`,
             },
            timeout: 30000,
          },
        );
  
        if (status === 200) {
          setPositions(data.assets);
        } else {
          setError('Houve algum problema. Recarregue a página.');
        }
  
        return;
      } catch (e) {
        console.log(e);
        setError('Houve algum problema. Recarregue a página.');
        return;
      }
    };

    handleAssets();
  }, [globalAccountId, globalToken, setPositions, assets, setAssets]);

  useEffect(() => {
    setPositions(prev => 
      prev.map(position => {
        return {
          ...position,
          currentValue: Number((position.price * position.quantity).toFixed(2))
        };
      })
    );
  }, [positions]);
  
  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Seus Ativos</h2>
        </div>
        <PortfolioList positions={positions} />
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </>
  );
};

export default Portfolio;
