import React from 'react';
import { useStore } from '../store'; // 导入useStore钩子
import '../styles/Form.css';

const ExportButton = () => { // 移除elements参数
  const { elementStore } = useStore(); // 获取store中的元素数据

  const generateMarkdown = () => {
    let markdown = '';
    const elements = elementStore.elements; // 从store获取元素

    // 递归生成元素的Markdown
    const renderElements = (elementsList) => {
      let result = '';
      elementsList.forEach(element => {
        result += generateElementMarkdown(element);
      });
      return result;
    };

    // 检查是否有内容区域元素
    const hasContentArea = elements.some(el => el.type === '内容区域');

    if (hasContentArea) {
      // 处理包含内容区域的情况
      elements.forEach(element => {
        if (element.type === '内容区域') {
          // 为内容区域创建flex布局
          markdown += '<div style="display: flex; gap: 20px; margin: 20px 0;">\n';

          // 检查是否有列信息
          if (element.children && Array.isArray(element.children)) {
            // 假设内容区域的子元素会被分配到不同列
            // 这里简单实现为两列，根据实际需求可以调整
            const leftElements = element.children.filter(el => !el.column || el.column === 'left');
            const rightElements = element.children.filter(el => el.column === 'right');

            // 如果没有明确列信息，默认全部放左侧
            if (leftElements.length === 0 && rightElements.length === 0) {
              markdown += '  <div style="flex: 1;">\n';
              markdown += renderElements(element.children);
              markdown += '  </div>\n';
            } else {
              // 左侧列
              if (leftElements.length > 0) {
                markdown += '  <div style="flex: 1;">\n';
                markdown += renderElements(leftElements);
                markdown += '  </div>\n';
              }

              // 右侧列
              if (rightElements.length > 0) {
                markdown += '  <div style="flex: 1;">\n';
                markdown += renderElements(rightElements);
                markdown += '  </div>\n';
              }
            }
          }

          markdown += '</div>\n\n';
        } else {
          // 非内容区域元素
          markdown += generateElementMarkdown(element);
        }
      });
    } else {
      // 没有内容区域元素，正常生成
      elements.forEach((element) => {
        markdown += generateElementMarkdown(element);
      });
    }

    return markdown;
  };

  const generateElementMarkdown = (element) => {
    let markdown = '';
    switch (element.type) {
      case '标题':
        markdown += `# ${element.content}\n\n`;
        break;
      case '段落':
        markdown += `${element.content}\n\n`;
        break;
      case '列表':
        markdown += `- ${element.content}\n`;
        break;
      case '徽章':
        markdown += `![${element.content.split('/').pop()}](${element.content})\n\n`;
        break;
      case '代码块':
        markdown += `\`\`\`\n${element.content}\n\`\`\`\n\n`;
        break;
      case '左右布局':
        // 左右布局元素本身不生成Markdown
        return '';
      default:
        markdown += `${element.content}\n\n`;
    }
    return markdown;
  };

  const copyToClipboard = () => {
    const markdown = generateMarkdown();
    navigator.clipboard.writeText(markdown).then(() => {
      alert('已复制到剪贴板！');
    }).catch((error) => {
      alert('复制失败，请手动复制: ' + error);
    });
  };

  return (
    <button className="export-button" onClick={copyToClipboard}>
      一键复制README内容
    </button>
  );
};

export default ExportButton;