import { observer } from 'mobx-react-lite';
import React from 'react';
import { useDrop } from 'react-dnd';
import { useStore } from '../../store';
import '../../styles/Layout.css';
import ReadmeElement from '../common/ReadmeElement';

// 递归渲染元素及其子元素
const RenderElements = ({ elements, onRemove }) => {
  // 确保 elements 是数组
  if (!Array.isArray(elements)) return null;

  return (
    <div className="elements-container">
      {elements.map((el) => (
        <div key={el.id} className={`element-wrapper ${el.type === '内容区域' ? 'content-area' : ''}`}>
          <ReadmeElement
            id={el.id}
            type={el.type}
            content={el.content}
            onRemove={onRemove}
          />
          {el.type === '内容区域' && el.children && (
            <ContentAreaDropZone
              parentId={el.id}
              children={el.children}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// 内容区域放置区
const ContentAreaDropZone = ({ parentId, children }) => {
  const { elementStore } = useStore();

  const [{ isOver }, drop] = useDrop({
    accept: 'README_ELEMENT',
    drop: (item, monitor) => {
      // 移除 shallow 检查，确保能正确检测到拖放
      if (monitor.isOver()) {
        elementStore.addElement(item, parentId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`content-area-drop-zone ${isOver ? 'over' : ''}`}
      // 添加样式确保放置区可见且可交互
      style={{ minHeight: '50px', position: 'relative', zIndex: 10 }}
    >
      <RenderElements elements={children} onRemove={elementStore.removeElement} />
      {/* 添加提示文本，帮助用户识别放置区 */}
      {children.length === 0 && (
        <div className="drop-zone-hint">
          <p>拖放元素到这里</p>
        </div>
      )}
    </div>
  );
};

const DropZone = observer(() => {
  const { elementStore } = useStore();

  // 主放置区域
  const [{ isOverMain }, dropMain] = useDrop({
    accept: 'README_ELEMENT',
    drop: (item, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        elementStore.addElement(item);
      }
    },
    collect: (monitor) => ({
      isOverMain: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <div className="drop-zone">
      <div ref={dropMain} className={`main-drop-area ${isOverMain ? 'over' : ''}`}>
        <RenderElements elements={elementStore.elements} onRemove={elementStore.removeElement} />
      </div>
    </div>
  );
});

export default DropZone;