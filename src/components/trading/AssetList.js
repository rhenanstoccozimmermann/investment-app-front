import React from 'react';

const AssetList = ({ assets, selectedAssetId, onSelectAsset }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ticker
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preço
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantidade
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {assets.map((asset) => (
            <tr 
              key={asset.assetId} 
              className={`hover:bg-blue-50 cursor-pointer transition-colors ${
                selectedAssetId === asset.assetId ? 'bg-blue-50' : ''
              }`}
              onClick={() => onSelectAsset(asset)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{asset.ticker}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm font-medium text-gray-900">{formatCurrency(asset.price)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm text-gray-500">{formatNumber(asset.quantity)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetList;
