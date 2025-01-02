# 视频会议系统

基于 React + TypeScript + Vite 构建的现代化视频会议系统，集成了 LiveKit 实时通讯功能。

## 功能特性

- 💬 实时视频会议
- 👥 用户列表管理
- 💭 实时文字聊天
- 🎛️ 音视频控制
- 🎨 现代化 UI 设计 (Tailwind CSS)
- 📱 响应式布局

## 技术栈

- React 18
- TypeScript
- Vite
- LiveKit
- Tailwind CSS
- Shadcn/ui

## 快速开始

### 环境要求

- Node.js 16+
- pnpm

### 安装

```bash
# 克隆项目
git clone [项目地址]

# 安装依赖
npm install
# 或
yarn install

# 启动开发服务器
npm run dev
# 或
yarn dev
```

### 环境变量配置

创建 `.env` 文件：

## 项目结构

```
src/
├── api/          # API 接口
├── assets/       # 静态资源
├── components/   # 通用组件
├── views/        # 页面视图
│   └── room/     # 会议室相关组件
├── App.tsx       # 应用入口
└── main.tsx      # 主入口文件
```

## 开发指南

### 组件开发

所有UI组件都基于 Shadcn/ui 和 Tailwind CSS 开发。组件位于 `src/components/ui` 目录下。

### 视频会议功能

会议室相关功能在 `src/views/room` 目录下：

- `Control.tsx`: 音视频控制组件
- `UserList.tsx`: 用户列表组件
- `Message.tsx`: 聊天消息组件
- `LivekitContext.ts`: LiveKit 上下文配置

## 构建部署

```bash
# 构建生产版本
npm run build
# 或
yarn build

# 预览构建结果
npm run preview
# 或
yarn preview
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

[MIT License](LICENSE)
