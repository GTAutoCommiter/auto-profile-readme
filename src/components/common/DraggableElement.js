import React from 'react';
import { useDrag } from 'react-dnd';
import '../../styles/DraggableElement.css';

const DraggableElement = ({ type, content }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'README_ELEMENT',
    item: { type, content },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const renderContent = () => {
    switch (type) {
      case '标题':
        return <h2>{content}</h2>;
      case '段落':
        return <p>{content}</p>;
      case '列表':
        return <ul><li>{content}</li></ul>;
      case '徽章':
        return <img src={content} alt={content} />;
      case '代码块':
        return <pre>{content}</pre>;
      case '左右布局':
        return (
          <div className="layout-preview">
            <div className="layout-column left">左侧区域</div>
            <div className="layout-column right">右侧区域</div>
          </div>
        );
      case '内容区域':
        return (
          <div className="content-area-preview">
            <div className="content-area-header-preview">{content}</div>
            <div className="content-area-placeholder">放置元素到这里</div>
          </div>
        );
      default:
        return <p>{content}</p>;
    }
  };

  return (
    <div
      ref={drag}
      className="draggable-element"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <div className="element-type">{type}</div>
      <div className="element-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default DraggableElement;