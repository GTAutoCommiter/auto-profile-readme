import { observer } from 'mobx-react-lite';
import React from 'react';
import { useDrop } from 'react-dnd';
import { useStore } from '../../store';
import '../../styles/Layout.css';
import ReadmeElement from '../common/ReadmeElement';

// 递归渲染元素及其子元素
const RenderElements = ({ elements, onRemove, onEdit }) => {
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
            onEdit={onEdit}
          />
          {el.type === '内容区域' && (
            <ContentAreaDropZone
              parentId={el.id}
              children={el.children || []}
              onEdit={onEdit}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// 内容区域放置区
const ContentAreaDropZone = ({ parentId, children, onEdit }) => {
  const { elementStore } = useStore();
  const isEditing = elementStore.editingContentAreaId === parentId;

  const [{ isOver }, drop] = useDrop({
    accept: 'README_ELEMENT',
    drop: (item, monitor) => {
      // 只在编辑状态下允许拖放
      if (isEditing && monitor.isOver() && item.type !== '内容区域') {
        elementStore.addElement(item, null, parentId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`content-area-drop-zone ${isOver && isEditing ? 'over' : ''}`}
      style={{
        minHeight: '50px',
        position: 'relative',
        zIndex: 10,
        // 始终显示放置区，以便能看到子元素
        display: 'block',
        // 非编辑状态下隐藏提示文本
        padding: isEditing ? '10px' : '0',
      }}
    >
      <RenderElements
        elements={children}
        onRemove={elementStore.removeElement}
        onEdit={onEdit}
      />
      {children.length === 0 && isEditing && (
        <div className="drop-zone-hint">
          <p>拖放元素到这里</p>
        </div>
      )}
    </div>
  );
};

const DropZone = observer(() => {
  const { elementStore } = useStore();
  const editingContentAreaId = elementStore.editingContentAreaId;

  // 主放置区域
  const [{ isOverMain }, dropMain] = useDrop({
    accept: 'README_ELEMENT',
    drop: (item, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        // 如果有内容区域处于编辑状态，则添加到该内容区域
        if (editingContentAreaId && item.type !== '内容区域') {
          elementStore.addElement(item, null, editingContentAreaId);
        } else {
          // 否则添加到根级别
          elementStore.addElement(item);
        }
      }
    },
    collect: (monitor) => ({
      isOverMain: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <div className="drop-zone">
      <div ref={dropMain} className={`main-drop-area ${isOverMain ? 'over' : ''}`}>
        <RenderElements
          elements={elementStore.elements}
          onRemove={elementStore.removeElement}
          onEdit={elementStore.updateElementContent}
        />
      </div>
    </div>
  );
});

export default DropZone;