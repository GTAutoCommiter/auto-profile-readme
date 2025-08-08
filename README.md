# 自动生成个人简介工具
一个直观的拖放式个人简介生成器，可以帮助你快速创建、定制并导出个人简介为Markdown格式。

## 功能特点
- 拖放式界面：通过简单的拖放操作添加和排列各种元素
- 多种元素支持：包括标题、段落、列表、徽章、代码块和内容区域
- 内容区域布局：支持创建多列内容区域，自动平分宽度
- 实时预览：所见即所得的编辑体验
- 一键导出：将编辑好的内容复制为Markdown格式
- 响应式设计：在不同设备上都能良好工作

## 如何安装和运行
### 前提条件
- Node.js (v14.0.0或更高版本)
- npm 或 pnpm

### 安装步骤
1. 克隆仓库：
````bash
git clone https://github.com/GTAutoCommiter/auto-profile-readme.git
cd auto-profile-readme
````
2. 安装依赖：
````bash
# 使用npm
npm install

# 或使用pnpm
pnpm install
````
3. 启动开发服务器：
````bash
# 使用npm
npm start

# 或使用pnpm
pnpm start
````
4. 在浏览器中打开 http://localhost:3000 即可使用应用。
## 使用方法
1. 从左侧元素选择器中拖放元素到右侧预览区域
2. 内容区域可以嵌套放置其他元素
3. 点击元素上的删除按钮可以移除元素
4. 完成编辑后，点击"一键复制README内容"按钮将内容复制到剪贴板
5. 将复制的Markdown内容粘贴到你的README文件中
## 项目结构
>auto-profile-readme/
├── public/            # 静态资源
├── src/               # 源代码
│   ├── components/    # 组件
│   │   ├── common/    # 通用组件
│   │   └── layout/    # 布局组件
│   ├── hooks/         # 自定义钩子
│   ├── store/         # 状态管理
│   ├── styles/        # CSS样式
│   ├── App.js         # 应用入口
│   └── index.js       # 渲染入口
├── package.json       # 项目依赖
└── README.md          # 项目文档

## 技术栈
- React：用于构建用户界面
- MobX：状态管理
- React DnD：拖放功能
- CSS：样式设计
## 贡献指南
1. Fork 仓库
2. 创建你的特性分支 (git checkout -b feature/AmazingFeature)
3. 提交你的更改 (git commit -m 'Add some AmazingFeature')
4. 推送到分支 (git push origin feature/AmazingFeature)
5. 打开一个Pull Request
## 许可证
本项目采用MIT许可证 - 详情请查看 LICENSE 文件