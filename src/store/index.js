import { createContext, useContext } from 'react';
import { makeAutoObservable, observable } from 'mobx';

// 创建元素 store
class ElementStore {
  elements = [];
  editingContentAreaId = null; // 跟踪当前编辑的内容区域ID
  
  constructor() {
    // 使用makeAutoObservable自动将类属性转为可观察状态
    makeAutoObservable(this);
  }
  
  // 添加设置编辑状态的方法
  setEditingContentArea = (id) => {
    this.editingContentAreaId = id;
  }
  
  // 取消编辑状态
  cancelEditingContentArea = () => {
    this.editingContentAreaId = null;
  }
  
  addElement = (item, column = null, layoutId = null) => {
    // 如果是布局元素，直接添加到末尾
    if (item.type === '左右布局') {
      this.elements.push(observable({
        id: Date.now(),
        type: item.type,
        content: item.content,
        column: null,
        layoutId: null,
        children: [] // 确保布局元素有children属性
      }));
      return;
    }

    // 如果是内容区域，创建带有children的元素
    if (item.type === '内容区域') {
      // 如果尝试将内容区域添加到另一个内容区域中，则不添加
      if (layoutId) {
        console.warn('不能将内容区域添加到另一个内容区域中');
        return;
      }

      const newElement = observable({
        id: Date.now(),
        type: item.type,
        content: item.content,
        column: column,
        layoutId: layoutId,
        children: [] // 添加children属性
      });

      // 没有指定布局ID，添加到最后
      this.elements.push(newElement);
      return;
    }

    // 创建普通元素
    const newElement = observable({
      id: Date.now(),
      type: item.type,
      content: item.content,
      column: column,
      layoutId: layoutId
    });

    // 如果指定了布局ID，添加到对应布局元素的children中
    if (layoutId) {
      const layoutElement = this.elements.find(el => el.id === layoutId);
      if (layoutElement && layoutElement.children) {
        layoutElement.children.push(newElement);
        // 创建新数组引用触发更新
        layoutElement.children = [...layoutElement.children];
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

  // 添加更新元素内容的方法
  updateElementContent = (id, newContent) => {
    // 找到元素索引
    const index = this.elements.findIndex(el => el.id === id);
    if (index !== -1) {
      // 创建一个新对象，而不是修改现有对象
      const updatedElement = {
        ...this.elements[index],
        content: newContent
      };
      // 替换数组中的元素
      this.elements[index] = updatedElement;
      // 创建新数组引用触发更新
      this.elements = [...this.elements];
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