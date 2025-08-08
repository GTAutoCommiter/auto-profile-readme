import { useDrop } from 'react-dnd';

// 自定义 Hook 现在直接调用 useDrop，并接受列和添加元素函数作为参数
const useColumnDrop = (column, addElement) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'README_ELEMENT',
    drop: (item, monitor, domEvent) => {
      // 确保只在直接悬停在该区域时才处理拖放
      if (!monitor.isOver({ shallow: true })) return;
      
      // 获取当前布局元素ID
      const layoutId = domEvent?.target?.getAttribute('data-layout-id');
      addElement(item, column, layoutId);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  return [isOver, drop];
};

export default useColumnDrop;