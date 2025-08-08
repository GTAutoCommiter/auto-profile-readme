import React from 'react';
import { StoreContext } from './index';
import store from './index';

const StoreProvider = ({ children }) => {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;