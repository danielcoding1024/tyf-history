# 修复模块找不到的错误

## 问题

错误：`找不到模块"react-router-dom"或其相应的类型声明`

## 原因

`package.json` 中已配置了依赖，但 `node_modules` 中尚未安装这些包。

## 解决方案

在终端中运行以下命令安装依赖：

```bash
cd frontend
npm install
```

或者只安装缺失的包：

```bash
cd frontend
npm install react-router-dom@^6.28.0 zustand@^4.5.5
```

## 验证

安装完成后，TypeScript 错误应该消失。可以运行：

```bash
npm run dev
```

如果还有问题，请检查 `node_modules/react-router-dom` 目录是否存在。
