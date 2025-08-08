// 修正样式导入路径
import React, { useState } from 'react';
import '../styles/ElementSelector.css';
import '../styles/Form.css';
import DraggableElement from './common/DraggableElement';

const ElementSelector = () => {
  // 移除自定义元素相关的状态
  // const [type, setType] = useState('标题');
  // const [content, setContent] = useState('');

  // 定义所有可用的元素类型和默认内容
  const availableElements = [
    { type: '标题', content: '项目介绍' },
    { type: '段落', content: '这是一个示例段落，描述项目的主要功能和用途。' },
    { type: '列表', content: '功能一：支持拖拽布局' },
    { type: '徽章', content: 'https://img.shields.io/github/stars/username/repo' },
    { type: '代码块', content: 'npm install\nnpm start' },
    { type: '内容区域', content: '内容区域' },
  ];

  // 移除添加自定义元素的方法
  // const addCustomElement = () => {
  //   if (!content.trim()) return;
  //   setAvailableElements((prev) => [
  //     ...prev,
  //     { type, content },
  //   ]);
  //   setContent('');
  // };

  return (
    <div className="element-selector">
      <h3>可用元素</h3>
      <div className="available-elements">
        {availableElements.map((el, index) => (
          <DraggableElement
            key={index}
            type={el.type}
            content={el.content}
          />
        ))}
      </div>
      {/* 移除自定义元素表单 */}
      {/* <div className="custom-element-form">
        <h4>添加自定义元素</h4>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="标题">标题</option>
          <option value="段落">段落</option>
          <option value="列表">列表</option>
          <option value="徽章">徽章</option>
          <option value="代码块">代码块</option>
          <option value="内容区域">内容区域</option>
        </select>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="输入内容..."
        />
        <button onClick={addCustomElement}>添加</button>
      </div> */}
    </div>
  );
};

export default ElementSelector;