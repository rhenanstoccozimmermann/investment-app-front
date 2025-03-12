import { useState } from 'react';
import { MyContext }  from './MyContext';

function Provider({ children }) {

  const [globalName, setGlobalName] = useState('');
  const [globalAccountId, setGlobalAccountId] = useState('');

  const contextValue = {
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
