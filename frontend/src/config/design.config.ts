/**
 * 设计配置文件
 * 从Figma设计中提取的颜色、字体等设计令牌
 */

export const designConfig = {
  // 颜色
  colors: {
    // 标题颜色
    titlePrimary: '#bfad9d',
    titleSecondary: '#cab8a5',
    // 按钮颜色
    buttonBg: '#4c2618',
    buttonBorder: '#673d2e',
    buttonActive: '#8a6753',
    buttonActiveBorder: '#35241b',
    // 文字颜色
    textPrimary: '#fff',
    textSecondary: '#fff8f5',
    textDark: '#140700',
    textMuted: '#c1b6b1',
    textActive: '#e0d4ce',
    // 其他
    divider: '#feeddc',
    chatText: '#ad8768',
    chatQuestion: '#523c31',
  },

  // 字体
  fonts: {
    // 主标题字体
    title: "'Crimson Text', 'Spectral', serif",
    // 正文字体
    body: "'EB Garamond', 'Spectral', serif",
    // UI字体
    ui: "'Inter', sans-serif",
    // 中文字体
    chinese: "'PingFang SC', 'Microsoft YaHei', sans-serif",
  },

  // 字号
  fontSizes: {
    title: '63px',
    subtitle: '57px',
    heading: '49px',
    body: '36px',
    button: '32px',
    small: '22px',
  },

  // 按钮样式
  button: {
    borderRadius: '13px',
    padding: '8px 16px',
    borderWidth: '2px',
  },
};
