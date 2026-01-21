# Figma 设计资源说明

## 从 Figma 获取的图片资源（临时URL，7天有效）

以下是从 Figma 设计中提取的图片 URL。这些 URL 是临时的（7天有效），建议尽快下载并保存到本地 `public/assets/` 目录。

### 封面页 (Cover)
- 背景图: `https://www.figma.com/api/mcp/asset/c98624bc-b556-47d1-9854-3631c4a5ba2f`
- 建筑GIF: `https://www.figma.com/api/mcp/asset/57a605d8-1cd4-418a-9179-89a292a98f4f`
- 按钮背景: `https://www.figma.com/api/mcp/asset/b208256f-dc6f-4d7e-89dc-334f01ccf41c`
- 语言切换背景: `https://www.figma.com/api/mcp/asset/3496883e-b904-498c-8a7e-f22de811a3b3`

### 首页 (Home)
- 背景图: `https://www.figma.com/api/mcp/asset/27e3afeb-fd6a-4b8b-b5a2-00d4405cc5d0`
- 主图: `https://www.figma.com/api/mcp/asset/9588f9d8-9ecd-4107-b5c6-cd0c89214f0c`
- Read Book按钮背景: `https://www.figma.com/api/mcp/asset/667fb46a-0680-4eb0-975b-e4b94b9a27fe`
- 问题按钮背景: `https://www.figma.com/api/mcp/asset/cc0af89e-b07a-41b5-aa89-2cf09b7309c7`
- 时间轴背景: `https://www.figma.com/api/mcp/asset/5881e22b-5d7e-4f4f-8aee-006904ce2818`
- 时间轴图标: 多个图标URL

### 对话页 (Chat)
- 背景图: `https://www.figma.com/api/mcp/asset/d054e456-7226-48f9-85bb-72856977c08a`
- 气泡背景: 多个气泡图片URL
- 牧师模型: `https://www.figma.com/api/mcp/asset/2a6e2098-4e28-443e-a32e-031fa97ae761`

## 已更新的样式

### 字体
- 标题字体: Crimson Text, Spectral (serif)
- 正文字体: EB Garamond, Spectral (serif)
- UI字体: Inter (sans-serif)
- 中文字体: PingFang SC, Microsoft YaHei

### 颜色
- 标题颜色: `#bfad9d`
- 按钮背景: `#4c2618`
- 按钮激活: `#8a6753`
- 文字颜色: `#fff`, `#fff8f5` 等

### 已应用的更新
- ✅ 字体系统（通过CSS变量）
- ✅ 颜色系统（部分应用）
- ✅ 按钮样式（语言切换按钮）
- ✅ 标题样式
- ⏳ 图片资源（需要手动下载并替换）

## 下一步

1. **下载图片**: 从上述URL下载所有图片，保存到 `public/assets/` 对应目录
2. **更新配置**: 下载完成后，更新 `assets.config.ts` 中的路径为本地路径
3. **测试样式**: 检查所有页面的样式是否与设计一致

## 注意事项

- Figma MCP 提供的图片URL有效期只有7天
- 建议立即下载所有图片资源
- 如果需要使用Figma图片URL临时测试，可以临时更新 `assets.config.ts`
