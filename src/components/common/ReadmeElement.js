import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import '../../styles/ReadmeElement.css';
import { observer } from 'mobx-react-lite';

const ReadmeElement = ({ id, type, content, onRemove, onEdit }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'README_ELEMENT',
    item: { id, type, content },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [isEditing, setIsEditing] = useState(false);
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (typeof onEdit === 'function') {
      onEdit(id, editContent);
      setIsEditing(false);
    } else {
      console.error('onEdit is not a function', onEdit);
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
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
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
      {isEditing ? (
        <div className="edit-container">
          {renderEditComponent()}
          <div className="edit-buttons">
            <button onClick={handleSave}>保存</button>
            <button onClick={() => setIsEditing(false)}>取消</button>
          </div>
        </div>
      ) : (
        <> {/* 原有渲染内容 */}
          {type === '标题' && <h2 onClick={handleEdit}>{content}</h2>}
          {type === '段落' && <p onClick={handleEdit}>{content}</p>}
          {type === '列表' && <ul><li onClick={handleEdit}>{content}</li></ul>}
          {type === '徽章' && (
            <div className="badge-container" onClick={handleEdit}>
              <img src={content} alt="徽章" />
            </div>
          )}
          {type === '代码块' && <pre onClick={handleEdit}><code>{content}</code></pre>}
          {type === '内容区域' && <div className="content-area-header" onClick={handleEdit}>{content}</div>}
          <button className="remove-button" onClick={() => onRemove(id)}>×</button>
        </>
      )}
    </div>
  );
};

export default observer(ReadmeElement);