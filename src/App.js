import React from 'react';
import './App.css';
import ElementSelector from './components/ElementSelector';
import ExportButton from './components/ExportButton';
import DropZone from './components/layout/DropZone';
import StoreProvider from './store/StoreProvider';

function App() {
  return (
    <StoreProvider>
      <div className="App">
        <h1>自动生成个人简介</h1>
        <div className="container">
          <div className="sidebar">
            <ElementSelector />
          </div>
          <div className="main-content">
            <DropZone />
            <ExportButton />
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}

export default App;