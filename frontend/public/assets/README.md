# Assets 目录结构说明

此目录包含项目的所有静态资源文件（图片、PDF等）。

## 目录结构

```
assets/
├── images/
│   ├── cover/          # 封面页资源
│   │   ├── background.jpg
│   │   └── building.gif
│   ├── home/           # 首页资源
│   │   ├── background.jpg
│   │   └── main-image.jpg
│   ├── detail/         # 详情页资源
│   │   └── carousel/   # 轮播图片
│   │       ├── carousel-1.jpg
│   │       ├── carousel-2.jpg
│   │       ├── carousel-3.jpg
│   │       └── carousel-4.jpg
│   ├── chat/           # 聊天页资源
│   │   ├── background.jpg
│   │   ├── bubble-left.png    # 左侧气泡背景
│   │   ├── bubble-right.png   # 右侧气泡背景
│   │   └── priest-model.png   # 牧师模型图片
│   └── icons/          # 图标资源
│       ├── back.png
│       └── book.png
└── pdfs/               # PDF文件
    ├── book-cn.pdf     # 中文PDF
    └── book-en.pdf     # 英文PDF
```

## 如何替换资源

所有资源路径都在 `src/config/assets.config.ts` 文件中配置。替换资源时：

1. **替换图片**：将新图片文件放到对应目录，保持文件名相同
2. **替换PDF**：将新的PDF文件放到 `assets/pdfs/` 目录，保持文件名相同
3. **修改路径**：如需更改文件名或添加新资源，请修改 `src/config/assets.config.ts` 中的配置

## 注意事项

- 所有路径都是相对于 `/public` 目录的相对路径
- 图片格式支持：jpg, png, gif, svg 等
- 气泡背景图片需要支持缩放（建议使用 PNG 格式，带透明背景）
- 封面页的建筑 GIF 建议使用循环播放的动画
- PDF 文件建议小于 10MB 以确保加载速度

## 资源要求

### 图片尺寸建议

- Cover 背景：375px × 812px 或更高（移动端适配）
- Home 主图：375px 宽度（高度自适应）
- Detail 轮播图：375px × 300px
- Chat 气泡：支持 9-slice 缩放
- 图标：建议 24px × 24px 或 44px × 44px（2x分辨率）

### PDF 文件

- 确保 PDF 文件可以正常在浏览器中打开
- 建议提供中文和英文两个版本
