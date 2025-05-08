import React from 'react';

const PortfolioList = ({ positions }) => {
  if (!positions.length) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Nenhum ativo no seu portfólio</p>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div>
      {positions.map((position) => (
        <div
          key={position.assetId}
          className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {position?.ticker}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(position.currentValue)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-gray-100 p-2 rounded">
              <p className="text-xs text-gray-500">Quantidade</p>
              <p className="text-sm font-medium">{position.quantity}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioList;
