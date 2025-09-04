import { makeAutoObservable } from 'mobx';

class ElementStore {
  // 初始状态
  elements = [];
  editingContentAreaId = null;

  constructor() {
    // 使store可观察
    makeAutoObservable(this);
  }

  // 更新元素内容
  updateElementContent = (id, newContent) => {
    const element = this.findElementById(id, this.elements);
    if (element) {
      element.content = newContent;
    }
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

  moveElement = (elementId, targetLayoutId = null, targetIndex = -1) => {
    // 查找要移动的元素
    let elementToMove = null;
    let sourceIndex = -1;
    let sourceLayout = null;

    // 检查是否在顶级元素中
    sourceIndex = this.elements.findIndex(el => el.id === elementId);
    if (sourceIndex !== -1) {
      elementToMove = this.elements[sourceIndex];
    } else {
      // 检查是否在某个内容区域中
      for (const layout of this.elements) {
        if (layout.type === '内容区域' && layout.children) {
          const childIndex = layout.children.findIndex(el => el.id === elementId);
          if (childIndex !== -1) {
            elementToMove = layout.children[childIndex];
            sourceLayout = layout;
            sourceIndex = childIndex;
            break;
          }
        }
      }
    }

    if (!elementToMove) return;

    // 从原位置移除
    if (sourceLayout) {
      sourceLayout.children.splice(sourceIndex, 1);
      sourceLayout.children = [...sourceLayout.children];
    } else {
      this.elements.splice(sourceIndex, 1);
    }

    // 添加到新位置
    if (targetLayoutId) {
      const targetLayout = this.elements.find(el => el.id === targetLayoutId);
      if (targetLayout && targetLayout.children) {
        if (targetIndex !== -1 && targetIndex < targetLayout.children.length) {
          targetLayout.children.splice(targetIndex, 0, elementToMove);
        } else {
          targetLayout.children.push(elementToMove);
        }
        targetLayout.children = [...targetLayout.children];
      }
    } else {
      if (targetIndex !== -1 && targetIndex < this.elements.length) {
        this.elements.splice(targetIndex, 0, elementToMove);
      } else {
        this.elements.push(elementToMove);
      }
      this.elements = [...this.elements];
    }
  };
}

// 创建并导出store实例
const elementStore = new ElementStore();
export default elementStore;