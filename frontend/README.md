# 同源方 H5 项目

基于 React + TypeScript + Vite 开发的移动端 H5 应用。

## 功能特性

- ✅ 路由系统（React Router）
- ✅ 四个主要页面：Cover / Home / Detail / Chat
- ✅ 全局语言切换（CN/EN）使用 Zustand 状态管理
- ✅ 动态动画：呼吸动画 + 打字机效果
- ✅ 轮播组件（Carousel）
- ✅ 聊天 UI（可扩展的气泡背景图片）
- ✅ 资源配置文件化（可替换图片和PDF，无需修改组件代码）

## 项目结构

```
frontend/
├── public/
│   └── assets/           # 静态资源目录
│       ├── images/       # 图片资源
│       └── pdfs/         # PDF文件
├── src/
│   ├── components/       # 组件
│   │   ├── animations/   # 动画组件
│   │   ├── Carousel.tsx  # 轮播组件
│   │   └── LanguageSwitch.tsx  # 语言切换组件
│   ├── config/           # 配置文件
│   │   ├── assets.config.ts    # 资源路径配置
│   │   └── questions.config.ts # 建议问题配置
│   ├── pages/            # 页面组件
│   │   ├── Cover.tsx     # 封面页
│   │   ├── Home.tsx      # 首页
│   │   ├── Detail.tsx    # 详情页
│   │   └── Chat.tsx      # 聊天页
│   ├── store/            # 状态管理
│   │   └── languageStore.ts    # 语言状态
│   └── App.tsx           # 主应用组件
```

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 添加资源文件

将图片和PDF文件按照 `public/assets/README.md` 中的说明放置到对应目录。

**必需的资源文件：**

- `public/assets/images/cover/background.jpg` - 封面背景
- `public/assets/images/cover/building.gif` - 建筑GIF动画
- `public/assets/images/home/background.jpg` - 首页背景
- `public/assets/images/home/main-image.jpg` - 首页主图
- `public/assets/images/detail/carousel/*.jpg` - 详情页轮播图（至少1张）
- `public/assets/images/chat/*` - 聊天页相关图片
- `public/assets/images/icons/*` - 图标文件
- `public/assets/pdfs/book-cn.pdf` - 中文PDF
- `public/assets/pdfs/book-en.pdf` - 英文PDF

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 4. 构建生产版本

```bash
npm run build
```

## 配置说明

### 替换资源文件

所有资源路径都在 `src/config/assets.config.ts` 中配置。替换资源时：

1. **直接替换**：将新文件放到相同位置，保持文件名不变
2. **修改路径**：如需更改文件名或路径，编辑 `assets.config.ts`

示例：

```typescript
export const assetsConfig = {
  cover: {
    background: '/assets/images/cover/background.jpg', // 修改此处路径
    buildingGif: '/assets/images/cover/building.gif',
      },
  // ...
};
```

### 修改建议问题

编辑 `src/config/questions.config.ts` 文件，可以添加或修改建议问题列表。

## API 集成

聊天功能需要后端API支持。项目配置了代理，将 `/api/chat` 请求转发到 `http://localhost:8000`。

### API 接口规范

**POST** `/api/chat`

请求体：
```json
{
  "lang": "CN" | "EN",
  "message": "用户消息",
  "sessionId": "session-xxx"
}
```

响应：
```json
{
  "reply": "机器人回复"
}
```

### 修改API地址

编辑 `vite.config.ts` 中的 `server.proxy` 配置：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url:port',
      changeOrigin: true,
    },
  },
}
```

## 页面说明

### Cover（封面页）
- 中央建筑 GIF 循环播放
- "Get Started" 按钮进入首页

### Home（首页）
- "Read Book" 按钮：根据语言打开对应PDF（带呼吸动画）
- "What happened during this era?" 按钮：打字机动画，点击进入聊天页
- 底部时间轴导航：4个分类（Overview/History/Architecture/Voices）

### Detail（详情页）
- 顶部轮播图
- 4个标签页切换内容
- "AskMe" 按钮（带呼吸动画）进入聊天页
- 返回按钮可返回首页

### Chat（聊天页）
- 固定顶部区域：问候语气泡 + 牧师模型（呼吸动画）
- 消息气泡：使用图片背景，可扩展适应文本长度
- 建议问题：每次随机显示2个（根据语言选择对应题库）
- 语言强制：机器人回复遵循当前选择的语言

## 技术栈

- **React 19** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **React Router** - 路由管理
- **Zustand** - 轻量级状态管理
- **CSS3** - 样式和动画

## 浏览器支持

- iOS Safari 12+
- Chrome Mobile 90+
- 其他现代移动浏览器

## 注意事项

1. 设计稿为 375px 宽度，高度 812px 基准，页面可滚动
2. 所有资源路径使用相对路径（相对于 `/public`）
3. 语言切换会影响PDF打开、聊天回复和建议问题
4. 会话无持久化，关闭网页后上下文清除
