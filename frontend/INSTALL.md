# 安装说明

## 问题说明

代码报错是因为依赖包还没有安装。需要先安装以下依赖：

- `react-router-dom` - 路由管理
- `zustand` - 状态管理

## 安装步骤

在终端中运行以下命令：

```bash
cd frontend
npm install
```

这个命令会安装 `package.json` 中列出的所有依赖，包括：
- react-router-dom (^6.28.0)
- zustand (^4.5.5)
- 以及其他已列出的依赖

## 如果 npm install 失败

如果遇到权限问题或网络问题，可以尝试：

1. **使用管理员权限**（如果需要）：
   ```bash
   sudo npm install
   ```

2. **清除缓存后重试**：
   ```bash
   npm cache clean --force
   npm install
   ```

3. **使用国内镜像**（如果网络较慢）：
   ```bash
   npm install --registry=https://registry.npmmirror.com
   ```

## 安装完成后

安装完成后，运行以下命令启动开发服务器：

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

## 验证安装

如果安装成功，运行以下命令应该不会有错误：

```bash
npm run build
```

如果还有 TypeScript 类型错误（非模块找不到的错误），请检查具体错误信息并修复。
