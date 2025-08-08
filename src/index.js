import React from 'react';
// 更改导入路径，从 'react-dom/client' 导入 createRoot
import { createRoot } from 'react-dom/client';
// 导入 DndProvider 和 HTML5Backend
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import App from './App';
import StoreProvider from './store/StoreProvider';

const root = createRoot(document.getElementById('root'));
root.render(
  // 使用 DndProvider 包装整个应用
  <DndProvider backend={HTML5Backend}>
    <StoreProvider>
      <App />
    </StoreProvider>
  </DndProvider>
);
