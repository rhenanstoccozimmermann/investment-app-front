import { useState } from 'react';
import { MyContext }  from './MyContext';

function Provider({ children }) {

  const [globalToken, setGlobalToken] = useState('');
  const [globalName, setGlobalName] = useState('');
  const [globalAccountId, setGlobalAccountId] = useState('');

  const contextValue = {
    globalToken,
    setGlobalToken,
    globalName,
    setGlobalName,
    globalAccountId,
    setGlobalAccountId,
  }

  return (
    <MyContext.Provider value={ contextValue }>
      { children }
    </MyContext.Provider>
  );
}

export default Provider;
