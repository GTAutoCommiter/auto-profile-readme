import React from 'react';
import { useDrag } from 'react-dnd';
import '../../styles/ReadmeElement.css';

const ReadmeElement = ({ id, type, content, onRemove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'README_ELEMENT',
    item: { id, type, content },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

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

  return (
    <div
      ref={drag}
      className={`readme-element ${getElementStyle()} ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {type === '标题' && <h2>{content}</h2>}
      {type === '段落' && <p>{content}</p>}
      {type === '列表' && <ul><li>{content}</li></ul>}
      {type === '徽章' && <div className="badge-container"><img src={content} alt="徽章" /></div>}
      {type === '代码块' && <pre><code>{content}</code></pre>}
      {type === '内容区域' && <div className="content-area-header">{content}</div>}
      <button className="remove-button" onClick={() => onRemove(id)}>×</button>
    </div>
  );
};

export default ReadmeElement;