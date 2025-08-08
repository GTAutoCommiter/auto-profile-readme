import React from 'react';
import { useStore } from '../store'; // 导入useStore钩子
import '../styles/Form.css';

const ExportButton = () => { // 移除elements参数
  const { elementStore } = useStore(); // 获取store中的元素数据

  const generateMarkdown = () => {
    let markdown = '';
    const elements = elementStore.elements; // 从store获取元素

    // 查找所有左右布局元素
    const layoutElements = elements.filter(el => el.type === '左右布局');

    if (layoutElements.length > 0) {
      let currentIndex = 0;
      // 处理布局元素前的元素
      elements.slice(0, elements.indexOf(layoutElements[0])).forEach(element => {
        markdown += generateElementMarkdown(element);
      });

      // 处理每个布局元素及其内容
      layoutElements.forEach((layoutElement, layoutIndex) => {
        const layoutPos = elements.indexOf(layoutElement);
        currentIndex = layoutPos + 1;

        // 找出下一个布局元素的位置，如果没有则为元素总数
        let nextLayoutPos = elements.length;
        if (layoutIndex < layoutElements.length - 1) {
          nextLayoutPos = elements.indexOf(layoutElements[layoutIndex + 1]);
        }

        // 提取当前布局元素和下一个布局元素之间的元素
        const elementsBetweenLayouts = elements.slice(layoutPos + 1, nextLayoutPos);

        // 分离左右列元素
        const leftElements = elementsBetweenLayouts.filter(el => !el.column || el.column === 'left');
        const rightElements = elementsBetweenLayouts.filter(el => el.column === 'right');

        // 生成两列布局的Markdown
        markdown += '<div style="display: flex; gap: 20px;">\n';

        // 左侧列
        markdown += '  <div style="flex: 1;">\n';
        leftElements.forEach((element) => {
          markdown += generateElementMarkdown(element);
        });
        markdown += '  </div>\n';

        // 右侧列
        markdown += '  <div style="flex: 1;">\n';
        rightElements.forEach((element) => {
          markdown += generateElementMarkdown(element);
        });
        markdown += '  </div>\n';

        markdown += '</div>\n\n';
      });

      // 处理最后一个布局元素后的元素
      if (currentIndex < elements.length) {
        elements.slice(currentIndex).forEach(element => {
          if (element.type !== '左右布局') {
            markdown += generateElementMarkdown(element);
          }
        });
      }
    } else {
      // 没有布局元素，正常生成
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