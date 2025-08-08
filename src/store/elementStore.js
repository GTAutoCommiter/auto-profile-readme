import { makeAutoObservable } from 'mobx';

class ElementStore {
  // 初始状态
  elements = [];

  constructor() {
    // 使store可观察
    makeAutoObservable(this);
  }

  // 添加元素
  addElement(item, parentId = null) {
    // 创建新元素
    const newElement = {
      id: Date.now(),
      type: item.type,
      content: item.content,
      children: [] // 支持嵌套元素
    };

    // 如果指定了父元素ID，添加到对应父元素的children中
    if (parentId) {
      const parentElement = this.findElementById(parentId, this.elements);
      if (parentElement) {
        parentElement.children.push(newElement);
        return;
      }
    }

    // 没有指定父元素，添加到根级
    this.elements.push(newElement);
  }

  // 递归查找元素
  findElementById(id, elements) {
    for (const element of elements) {
      if (element.id === id) return element;
      if (element.children && element.children.length > 0) {
        const found = this.findElementById(id, element.children);
        if (found) return found;
      }
    }
    return null;
  }

  // 删除元素
  removeElement(id) {
    this.elements = this.removeElementById(id, this.elements);
  }

  // 递归删除元素
  removeElementById(id, elements) {
    return elements.filter(element => {
      if (element.children && element.children.length > 0) {
        element.children = this.removeElementById(id, element.children);
      }
      return element.id !== id;
    });
  }

  // 获取所有内容区域元素
  get contentAreas() {
    return this.findElementsByType('内容区域', this.elements);
  }

  // 递归查找指定类型的元素
  findElementsByType(type, elements) {
    let result = [];
    for (const element of elements) {
      if (element.type === type) {
        result.push(element);
      }
      if (element.children && element.children.length > 0) {
        result = result.concat(this.findElementsByType(type, element.children));
      }
    }
    return result;
  }
}

// 创建并导出store实例
const elementStore = new ElementStore();
export default elementStore;

// 删除或注释以下方法
// 移动元素到指定列
// moveElementToColumn(id, column) {
//   const element = this.elements.find(el => el.id === id);
//   if (element) {
//     element.column = column;
//   }
// }