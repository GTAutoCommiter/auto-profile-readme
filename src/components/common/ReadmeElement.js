import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useStore } from '../../store'; // 添加导入
import '../../styles/ReadmeElement.css';

const ReadmeElement = ({ id, type, content, onRemove, onEdit }) => {
  const { elementStore } = useStore(); // 获取store
  const [{ isDragging }, drag] = useDrag({
    type: 'EXISTING_ELEMENT',
    item: { id, type, content },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 内容区域特有逻辑
  const isContentArea = type === '内容区域';
  const isEditing = elementStore.editingContentAreaId === id;

  const handleEdit = () => {
    if (isContentArea) {
      // 对于内容区域，进入编辑状态
      elementStore.setEditingContentArea(id);
    } else {
      // 其他元素保持原有编辑逻辑
      setLocalIsEditing(true);
    }
  };

  const handleSave = (event) => {
    // 阻止事件冒泡，避免触发容器的handleEdit
    event.stopPropagation();

    if (isContentArea) {
      // 对于内容区域，先保存内容再退出编辑状态
      if (typeof onEdit === 'function') {
        onEdit(id, editContent);
      } else {
        console.error('onEdit is not a function', onEdit);
      }
      elementStore.cancelEditingContentArea();
    } else {
      // 其他元素保持原有保存逻辑
      if (typeof onEdit === 'function') {
        onEdit(id, editContent);
        setLocalIsEditing(false);
      } else {
        console.error('onEdit is not a function', onEdit);
      }
    }
  };

  const [localIsEditing, setLocalIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  // 根据类型渲染不同样式
  const getElementStyle = () => {
    switch (type) {
      case '标题':
        return 'readme-title';
      case '段落':
        return 'readme-paragraph';
      case '列表':
        return 'readme-list';
      case '徽章':
        return 'readme-badge';
      case '代码块':
        return 'readme-code';
      case '内容区域':
        return 'readme-content-area';
      default:
        return '';
    }
  };

  // 根据类型渲染不同的编辑组件
  const renderEditComponent = () => {
    switch (type) {
      case '标题':
      case '段落':
      case '列表':
      case '徽章':
        return (
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        );
      case '代码块':
        return (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
          />
        );
      case '内容区域':
        return (
          <div className="content-area-edit">
            <p>内容区域属性</p>
            <input
              type="text"
              placeholder="可选标签..."
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={drag}
      className={`readme-element ${getElementStyle()} ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {isContentArea ? (
        // 内容区域的特殊处理
        <> 
          <div 
            className={`content-area-container ${isEditing ? 'content-area-editing' : ''}`} 
            onClick={handleEdit}
          >
            {isEditing ? (
              <div className="edit-buttons content-area-save-button">
                <button onClick={(e) => handleSave(e)}>保存内容区域</button>
              </div>
            ) : (
              <div className="content-area-label">
                {content || '内容区域'}
              </div>
            )}
          </div>
          <button className="remove-button" onClick={() => onRemove(id)}>×</button>
        </>
      ) : (
        // 其他元素保持原有逻辑
        localIsEditing ? (
          <div className="edit-container">
            {renderEditComponent()}
            <div className="edit-buttons">
              <button onClick={handleSave}>保存</button>
              <button onClick={() => setLocalIsEditing(false)}>取消</button>
            </div>
          </div>
        ) : (
          <> 
            {type === '标题' && <h2 onClick={handleEdit}>{content}</h2>}
            {type === '段落' && <p onClick={handleEdit}>{content}</p>}
            {type === '列表' && <ul><li onClick={handleEdit}>{content}</li></ul>}
            {type === '徽章' && (
              <div className="badge-container" onClick={handleEdit}>
                <img src={content} alt="徽章" />
              </div>
            )}
            {type === '代码块' && <pre onClick={handleEdit}><code>{content}</code></pre>}
            <button className="remove-button" onClick={() => onRemove(id)}>×</button>
          </>
        )
      )}
    </div>
  );
};

export default observer(ReadmeElement);