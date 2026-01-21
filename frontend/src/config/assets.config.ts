/**
 * 资源配置文件
 * 所有图片和PDF路径在此配置，替换资源时只需修改此文件
 */

// 导入本地资源（src/assets目录下的文件）
import cnPdf from '../assets/book/CN.pdf';
import enPdf from '../assets/book/EN.pdf';
import background1 from '../assets/home/Background-1.webp';
import background2 from '../assets/home/Background-2.webp';
import bookIcon from '../assets/home/Image-5.webp';
import priestIcon from '../assets/home/68c26995ddc4eb8b6c0447ac1ae8f918 2.webp';
import timelineIcon1 from '../assets/home/Image.webp';
import timelineIcon2 from '../assets/home/Image-1.webp';
import timelineIcon3 from '../assets/home/Image-4.webp';
import timelineIcon4 from '../assets/home/Image-7.webp';
import backIcon from '../assets/third/image.webp';
// church.webp 文件不存在，使用 jianzhu.webp 作为主图片
import jianzhu from '../assets/third/jianzhu.webp';
import chatIcon from '../assets/third/Group 2.webp';
import historyImage from '../assets/third/history.webp';
import otherImage from '../assets/third/image copy.webp';
// 建筑轮播图
import jianzhu2 from '../assets/third/jianzhu2.webp';
import jianzhu3 from '../assets/third/jianzhu3.webp';
import jianzhu5 from '../assets/third/jianzhu5.webp';
import jianzhu6 from '../assets/third/jianzhu6.webp';
import jianzhu8 from '../assets/third/jianzhu8.webp';
import jianzhu9 from '../assets/third/jianzhu9.webp';
import jianzhu10 from '../assets/third/jianzhu10.webp';
import jianzhu12 from '../assets/third/jianzhu12.webp';
import jianzhu13 from '../assets/third/jianzhu13.webp';
import jianzhu117 from '../assets/third/jianzhu117.webp';
import coverImage from '../assets/first/all-image.webp';
import priestModel from '../assets/fourth/83e1a654bf92b4f5bb0c2e5cb6270899.webp';
import chatBubbleImage from '../assets/fourth/image11.webp';
import globalBackground from '../assets/home/image 1.webp';
// Cover页面图片（从home目录）
import coverMainImage from '../assets/home/dccf7b7d209f3effce1cf671c14f5c9f.webp';
import coverButtonImage from '../assets/home/4c7c9898dd2f8cd53547c81ba1ed5190.webp';
import coverTitleImage from '../assets/home/b27c1646e4c20da9114005b0fe89f7e9.webp';
import coverDescriptionImage from '../assets/home/6475cf0298bfff104ee781bed66897d3.webp';
// 口述史音频文件
import voiceCn01 from '../assets/voice-cn/01.mp3';
import voiceCn02 from '../assets/voice-cn/02.mp3';
import voiceCn03 from '../assets/voice-cn/03.mp3';
import voiceEn01 from '../assets/voice-en/01.mp3';
import voiceEn02 from '../assets/voice-en/02.mp3';
import voiceEn03 from '../assets/voice-en/03.mp3';
// 口述史播放按钮图片
import voicePlaying from '../assets/voice-cn/voice1.webp'; // 播放中的图片
import voiceMuted from '../assets/voice-cn/novoice.webp'; // 静音状态的图片

export const assetsConfig = {
  // 全局背景图
  globalBackground: globalBackground,

  // Cover页面资源
  cover: {
    background: '', // 未使用的占位符
    buildingGif: coverMainImage, // 使用 home 目录下的主图片
    buttonImage: coverButtonImage, // 按钮图片
    titleImage: coverTitleImage, // 标题图片
    descriptionImage: coverDescriptionImage, // 描述图片
  },

  // Home页面资源
  home: {
    background: '', // 未使用的占位符
    mainImage: coverImage, // 主图片（使用封面图片）
    titleImage: coverTitleImage, // 标题图片
    questionBackground: background1, // 问题按钮背景
    readBookBackground: background2, // 阅读电子书按钮背景
    priestIcon: priestIcon, // 问题按钮右侧的图标
    timelineIcons: [timelineIcon1, timelineIcon2, timelineIcon3, timelineIcon4], // 时间轴图标
  },

  // PDF文件
  pdfs: {
    chinese: cnPdf,
    english: enPdf,
  },

  // Detail页面资源
  detail: {
    mainImage: jianzhu, // Overview页面使用（使用建筑图片作为占位）
    historyImage: historyImage, // History页面使用
    otherImage: otherImage, // Voices页面使用
    architectureImages: [jianzhu2, jianzhu3, jianzhu5, jianzhu6, jianzhu8, jianzhu9, jianzhu10, jianzhu12, jianzhu13, jianzhu117], // Architecture页面轮播图
  },

  // Chat页面资源
  chat: {
    priestModel: priestModel, // 数字人图片
    bubbleImage: chatBubbleImage, // 对话框背景图片
    background: '', // 未使用的占位符
  },

  // 图标资源
  icons: {
    book: bookIcon,
    back: backIcon,
    chat: chatIcon,
    language: '', // 未使用的占位符
  },

  // 口述史音频资源
  voices: {
    cn: [voiceCn01, voiceCn02, voiceCn03],
    en: [voiceEn01, voiceEn02, voiceEn03],
    playing: voicePlaying, // 播放中的图片
    muted: voiceMuted, // 静音状态的图片
  },
};

/**
 * 根据语言获取PDF路径
 */
export function getPdfPath(language: 'CN' | 'EN'): string {
  return language === 'CN' ? assetsConfig.pdfs.chinese : assetsConfig.pdfs.english;
}
