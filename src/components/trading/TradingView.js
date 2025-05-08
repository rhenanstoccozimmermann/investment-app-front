import React, { useContext, useState, useEffect } from 'react';
import AssetList from './AssetList';
import TradingForm from './TradingForm';
import { MyContext} from '../../context/MyContext';
import { baseAPI } from '../../config/axios';

const TradingView = () => {
  const { globalToken } = useContext(MyContext);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleAssets = async () => {
      setError('');
      setAssets([]);
  
      try {
        const {
          status, data
        } = await baseAPI.get(
          '/assets',
          { 
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${globalToken}`,
             },
            timeout: 30000,
          },
        );
  
        if (status === 200) {
          setAssets(data.assets);
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
  }, [globalToken, setAssets]);

  useEffect(() => {
    if (selectedAsset) {
      const updatedAsset = assets.find(a => a.assetId === selectedAsset.assetId);
      if (updatedAsset) {
        setSelectedAsset(updatedAsset);
      }
    }
  }, [assets, selectedAsset]);
  
  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
  };

  console.log('selectedAsset', selectedAsset);
  
  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Visão geral do mercado</h2>
        </div>
        <div className="overflow-x-auto">
          <AssetList 
            assets={assets}
            selectedAssetId={selectedAsset?.assetId}
            onSelectAsset={handleSelectAsset}
          />
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedAsset ? `${selectedAsset.ticker}` : 'Selecione um ativo'}
              </h2>
              {selectedAsset && (
                <div className="flex items-center">
                  <span className={"text-lg font-bold"}>
                    {`${selectedAsset.price.toFixed(2)}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <TradingForm selectedAsset={selectedAsset} />
        </div>
      </div>
    </>
  );
};

export default TradingView;
