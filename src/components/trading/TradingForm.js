import React, { useContext, useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { MyContext} from '../../context/MyContext';
import { baseAPI } from '../../config/axios';

const TradingForm = ({ selectedAsset }) => {
  const { globalToken, globalAccountId, setAssets } = useContext(MyContext);
  const [orderType, setOrderType] = useState('BUY');
  const [quantity, setQuantity] = useState('1');
  const [totalAmount, setTotalAmount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setQuantity('1');
    setShowConfirmation(false);
  }, [selectedAsset]);

  useEffect(() => {
    if (selectedAsset && quantity) {
      const quantityNum = parseFloat(quantity);
      if (!isNaN(quantityNum) && quantityNum > 0) {
        setTotalAmount(selectedAsset.price * quantityNum);
      } else {
        setTotalAmount(0);
      }
    } else {
      setTotalAmount(0);
    }
  }, [selectedAsset, quantity]);

  const buyAsset = async () => {
    try {
      const {
        status
      } = await baseAPI.post(
        '/investments/buy',
        {
          accountId: globalAccountId,
          assetId: selectedAsset.assetId,
          quantity,
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
          setAssets((prev) => [ ...prev, { ...selectedAsset } ] );
        return true;
      }

      return;
    } catch (e) {
      console.log(e);
      return;
    }
  };

  const sellAsset = async () => {
    try {
      const {
        status
      } = await baseAPI.post(
        '/investments/sell',
        {
          accountId: globalAccountId,
          assetId: selectedAsset.assetId,
          quantity,
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
        setAssets((prev) => prev.filter((el) => el.assetId !== selectedAsset.assetId) );
        return true;
      }

      return;
    } catch (e) {
      console.log(e);
      return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAsset) return;
    
    setShowConfirmation(true);
  };
  
  const handleConfirmOrder = () => {
    setTimeout(() => {
      setQuantity('1');
      setShowConfirmation(false);
    }, 3000);
  
    let result;
    if (orderType === 'BUY') {
      result = buyAsset();
    } else if (orderType === 'SELL') {
      result = sellAsset();
    }
    console.log(result);
    if (result) {
      return (
        <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col justify-center">
          <div className="text-center py-6">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Pedido Confirmado!</h3>
            <p className="mt-1 text-sm text-gray-500">
              Sua {orderType === 'BUY' ? 'compra' : 'venda'} de {quantity} {selectedAsset.ticket} foi enviada.
            </p>
          </div>
        </div>
      );
    }
  };

  const handleCancelOrder = () => {
    setShowConfirmation(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (!selectedAsset) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-6">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum Ativo Selecionado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Por favor selecione um ativo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Fazer Pedido</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pedido</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`py-2 px-4 rounded-md font-medium ${
                orderType === 'BUY'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setOrderType('BUY')}
            >
              Comprar
            </button>
            <button
              type="button"
              className={`py-2 px-4 rounded-md font-medium ${
                orderType === 'SELL'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setOrderType('SELL')}
            >
              Vender
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="asset" className="block text-sm font-medium text-gray-700 mb-1">
            Ativo
          </label>
          <div className="flex items-center bg-gray-100 p-3 rounded-md">
            <span className="font-medium text-gray-900">{selectedAsset.ticker}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            step="1"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Preço
          </label>
          <div className="flex items-center bg-gray-100 p-3 rounded-md">
            <span className="font-medium text-gray-900">{formatCurrency(selectedAsset.price)}</span>
          </div>
        </div>

        <div className="mb-6 pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-gray-700">Total:</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-md font-medium text-white ${
            orderType === 'BUY'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {orderType === 'BUY' ? 'Comprar' : 'Vender'} {selectedAsset.ticker}
        </button>
      </form>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar Pedido</h3>
            <p className="text-gray-700 mb-4">
              {orderType === 'BUY' ? 'Comprar' : 'Vender'} {quantity} {selectedAsset.ticker} por {formatCurrency(selectedAsset.price)} por unidade.
            </p>
            <p className="text-gray-700 mb-6">
              Total: <span className="font-bold">{formatCurrency(totalAmount)}</span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmOrder}
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                  orderType === 'BUY'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirmar {orderType === 'BUY' ? 'Compra' : 'Venda'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingForm;
