import { createContext, useContext } from 'react';
import { makeAutoObservable } from 'mobx';

// 创建元素 store
class ElementStore {
  elements = [];
  
  constructor() {
    // 使用makeAutoObservable自动将类属性转为可观察状态
    makeAutoObservable(this);
  }
  
  addElement = (item, column = null, layoutId = null) => {
    // 如果是布局元素，直接添加到末尾
    if (item.type === '左右布局') {
      this.elements.push({
        id: Date.now(),
        type: item.type,
        content: item.content,
        column: null,
        layoutId: null
      });
      return;
    }

    // 创建新元素
    const newElement = {
      id: Date.now(),
      type: item.type,
      content: item.content,
      column: column,
      layoutId: layoutId
    };

    // 如果指定了布局ID，添加到对应布局元素之后
    if (layoutId) {
      const layoutElement = this.elements.find(el => el.id === layoutId);
      if (layoutElement) {
        const layoutPos = this.elements.indexOf(layoutElement);
        this.elements.splice(layoutPos + 1, 0, newElement);
      }
    } else {
      // 没有指定布局ID，添加到最后
      this.elements.push(newElement);
    }
  };

  removeElement = (id) => {
    this.elements = this.elements.filter(element => element.id !== id);
  };

  updateElementColumn = (id, column) => {
    const element = this.elements.find(el => el.id === id);
    if (element) {
      element.column = column;
    }
  };
}

// 创建根 store
class RootStore {
  constructor() {
    this.elementStore = new ElementStore();
  }
}

// 创建上下文
export const StoreContext = createContext(null);

// 创建useStore钩子
export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};

// 创建store实例 - 使用RootStore
const store = new RootStore();

export default store;