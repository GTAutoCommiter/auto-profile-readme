import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useStore } from '../../store';
import '../../styles/Layout.css';
import ReadmeElement from '../common/ReadmeElement';

const SortableElement = ({ el, index, parentId, onRemove, onEdit, children }) => {
  const ref = useRef(null);
  const { elementStore } = useStore();

  const [, drop] = useDrop({
    accept: 'EXISTING_ELEMENT',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragParentId = item.parentId;
      const hoverParentId = parentId;

      if (dragIndex === hoverIndex && dragParentId === hoverParentId) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragParentId === hoverParentId) {
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
      }

      elementStore.moveElement(item.id, hoverParentId, hoverIndex);

      item.index = hoverIndex;
      item.parentId = hoverParentId;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'EXISTING_ELEMENT',
    item: () => ({ id: el.id, index, parentId, type: el.type }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
      className={`element-wrapper ${el.type === '内容区域' ? 'content-area' : ''}`}
    >
      <ReadmeElement
        id={el.id}
        type={el.type}
        content={el.content}
        onRemove={onRemove}
        onEdit={onEdit}
      />
      {children}
    </div>
  );
};

// 递归渲染元素及其子元素
const RenderElements = ({ elements, onRemove, onEdit, parentId = null }) => {
  if (!Array.isArray(elements)) return null;

  return (
    <div className="elements-container">
      {elements.map((el, index) => (
        <SortableElement
          key={el.id}
          el={el}
          index={index}
          parentId={parentId}
          onRemove={onRemove}
          onEdit={onEdit}
        >
          {el.type === '内容区域' && (
            <ContentAreaDropZone
              parentId={el.id}
              children={el.children || []}
              onEdit={onEdit}
            />
          )}
        </SortableElement>
      ))}
    </div>
  );
};

// 修改ContentAreaDropZone组件
const ContentAreaDropZone = ({ parentId, children, onEdit }) => {
  const { elementStore } = useStore();
  const isEditing = elementStore.editingContentAreaId === parentId;

  const [{ isOver }, drop] = useDrop({
    accept: ['README_ELEMENT', 'EXISTING_ELEMENT'],
    drop: (item, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        if (item.id) {
          // Move existing element from another container
          if (item.parentId !== parentId) {
            elementStore.moveElement(item.id, parentId, children.length);
          }
        } else if (isEditing && item.type !== '内容区域') {
          // Add new element
          elementStore.addElement(item, parentId);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
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
        display: 'block',
        padding: isEditing ? '10px' : '0',
      }}
    >
      <RenderElements
        elements={children}
        onRemove={elementStore.removeElement}
        onEdit={onEdit}
        parentId={parentId}
      />
      {children.length === 0 && isEditing && (
        <div className="drop-zone-hint">
          <p>拖放元素到这里</p>
        </div>
      )}
    </div>
  );
};

// 修改DropZone主组件
const DropZone = observer(() => {
  const { elementStore } = useStore();
  const editingContentAreaId = elementStore.editingContentAreaId;

  // 主放置区域
  const [{ isOverMain }, dropMain] = useDrop({
    accept: ['README_ELEMENT', 'EXISTING_ELEMENT'],
    drop: (item, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        if (item.id) {
          // Move existing element to root level
          if (item.parentId !== null) {
            elementStore.moveElement(item.id, null, elementStore.elements.length);
          }
        } else {
          // Add new element
          if (editingContentAreaId && item.type !== '内容区域') {
            elementStore.addElement(item, editingContentAreaId);
          } else {
            elementStore.addElement(item);
          }
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
