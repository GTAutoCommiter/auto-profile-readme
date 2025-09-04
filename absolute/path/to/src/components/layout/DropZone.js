import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react-dnd';
import { useDrop } from 'react-dnd';
import { useStore } from '../../store';
import '../../styles/Layout.css';
import ReadmeElement from '../common/ReadmeElement';

// 递归渲染元素及其子元素
const RenderElements = ({ elements, onRemove, onEdit, parentId = null }) => {
  // 确保 elements 是数组
  if (!Array.isArray(elements)) return null;
  const { elementStore } = useStore();

  // 为每个元素创建放置区以支持位置调整
  const createItemDropZone = (index) => {
    const [{ isOverItem }, dropItem] = useDrop({
      accept: ['README_ELEMENT', 'EXISTING_ELEMENT'],
      drop: (item, monitor) => {
        if (monitor.isOver({ shallow: true })) {
          if (item.type === 'EXISTING_ELEMENT') {
            // 调整已有元素位置
            elementStore.moveElement(item.id, parentId, index);
          } else if (parentId) {
            // 添加新元素到内容区域
            if (item.type !== '内容区域') {
              elementStore.addElement(item, null, parentId);
            }
          }
        }
      },
      collect: (monitor) => ({
        isOverItem: monitor.isOver({ shallow: true }),
      }),
    });
    return [isOverItem, dropItem];
  };

  return (
    <div className="elements-container">
      {elements.map((el, index) => {
        const [isOverItem, dropItem] = createItemDropZone(index);
        return (
          <div 
            key={el.id} 
            className={`element-wrapper ${el.type === '内容区域' ? 'content-area' : ''} ${isOverItem ? 'item-over' : ''}`}
            ref={dropItem}
          >
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
        );
      })} 
    </div>
  );
};

// 内容区域放置区
const ContentAreaDropZone = ({ parentId, children, onEdit }) => {
  const { elementStore } = useStore();
  const isEditing = elementStore.editingContentAreaId === parentId;

  const [{ isOver }, drop] = useDrop({
    accept: ['README_ELEMENT', 'EXISTING_ELEMENT'],
    drop: (item, monitor) => {
      // 只在编辑状态下允许拖放
      if (isEditing && monitor.isOver()) {
        if (item.type === 'EXISTING_ELEMENT') {
          // 调整已有元素位置到内容区域
          elementStore.moveElement(item.id, parentId);
        } else if (item.type !== '内容区域') {
          // 添加新元素到内容区域
          elementStore.addElement(item, null, parentId);
        }
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

const DropZone = observer(() => {
  const { elementStore } = useStore();
  const editingContentAreaId = elementStore.editingContentAreaId;

  // 主放置区域
  const [{ isOverMain }, dropMain] = useDrop({
    accept: ['README_ELEMENT', 'EXISTING_ELEMENT'],
    drop: (item, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        if (item.type === 'EXISTING_ELEMENT') {
          // 调整已有元素位置到根级别
          elementStore.moveElement(item.id);
        } else {
          // 添加新元素
          if (editingContentAreaId && item.type !== '内容区域') {
            elementStore.addElement(item, null, editingContentAreaId);
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