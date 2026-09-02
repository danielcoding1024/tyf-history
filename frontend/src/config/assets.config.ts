/**
 * 资源配置文件
 * 所有图片和PDF路径在此配置，替换资源时只需修改此文件
 */

import type { CarouselImage } from '../components/Carousel';

// 导入本地资源（src/assets目录下的文件）
import reportCnPdf from '../assets/book/report-cn.pdf';
import reportEnPdf from '../assets/book/report-en.pdf';
import overviewCnPdf from '../assets/book/overview-cn.pdf';
import overviewEnPdf from '../assets/book/overview-en.pdf';
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
import coverImage from '../assets/first/all-image.webp';
import priestModel from '../assets/fourth/83e1a654bf92b4f5bb0c2e5cb6270899.webp';
import chatBubbleImage from '../assets/fourth/image11.webp';
import globalBackground from '../assets/home/image 1.webp';
// Cover页面图片（从home目录）
import coverMainImage from '../assets/home/dccf7b7d209f3effce1cf671c14f5c9f.webp';
import coverTitleImage from '../assets/home/b27c1646e4c20da9114005b0fe89f7e9.webp';
// 口述史音频文件
import voiceCn01 from '../assets/voice-cn/01.mp3';
import voiceCn02 from '../assets/voice-cn/02.mp3';
import voiceCn03 from '../assets/voice-cn/03.mp3';
import voiceEn01 from '../assets/voice-en/01.mp3';
import voiceEn02 from '../assets/voice-en/02.mp3';
import voiceEn03 from '../assets/voice-en/03.mp3';
// 网站更新照片（来自“8 网站更新照片.pptx”）
import gate2025 from '../assets/archive/gate-2025.webp';
import cathedralCurrent from '../assets/archive/cathedral-current.webp';
import holyChildhoodCurrent from '../assets/archive/holy-childhood-current.webp';
import reliefKitchen from '../assets/archive/relief-kitchen.webp';
import holyChildhoodLife from '../assets/archive/holy-childhood-life.webp';
import catholicSchool1905 from '../assets/archive/catholic-school-1905.webp';
import childrenWeaving from '../assets/archive/children-weaving.webp';
import cityWall1906 from '../assets/archive/city-wall-1906.webp';
import cathedral1932 from '../assets/archive/cathedral-1932.webp';
import bishopResidenceCorridor1906 from '../assets/archive/bishop-residence-corridor-1906.webp';
import orphanage from '../assets/archive/orphanage.webp';
import convent from '../assets/archive/convent.webp';

const overviewImages: CarouselImage[] = [
  {
    src: gate2025,
    alt: { CN: '2025年的通远天主教堂大门', EN: 'Main gate of Tongyuan Catholic Church in 2025' },
    caption: {
      CN: '图1 通远天主教堂大门（摄于2025年）',
      EN: 'Figure 1 The Main Gate of Tongyuan Catholic Church (photographed in 2025)',
    },
    objectPosition: 'center',
  },
  {
    src: cathedralCurrent,
    alt: { CN: '通远坊主教座堂现状', EN: 'Present-day Tongyuan Ward Cathedral' },
    caption: { CN: '图4-19 通远坊主教座堂', EN: 'Figure 4-19 Tongyuan Ward Cathedral' },
    objectPosition: 'center',
  },
];

const historyImages: CarouselImage[] = [
  {
    src: reliefKitchen,
    alt: { CN: '通远坊设立粥厂赈济灾民的历史照片', EN: 'Relief kitchen serving disaster victims in Tongyuan Ward' },
    caption: {
      CN: '图2-14 通远坊设粥厂赈济灾民，并作为泾惠渠工程的前线营地和后勤基地',
      EN: 'Figure 2-14 Setting up a soup kitchen in Tongyuan Ward to relieve disaster victims; serving as the “Frontline Camp and Logistical Base” for the Jinghui Canal Project',
    },
    objectPosition: 'center',
  },
  {
    src: holyChildhoodLife,
    alt: { CN: '保赤会儿童日常生活的历史照片', EN: 'Daily life in the Holy Childhood Association' },
    caption: { CN: '图2-8 保赤会的日常生活', EN: 'Figure 2-8 Daily life in the the Holy Childhood Association' },
    objectPosition: 'center',
  },
  {
    src: catholicSchool1905,
    alt: { CN: '1905年的通远天主教小学师生', EN: 'Tongyuan Catholic Primary School in 1905' },
    caption: { CN: '图2-9 通远天主教小学（摄于1905年）', EN: 'Figure2-9 Tongyuan Catholic Primary School (photographed in 1905)' },
    objectPosition: 'center',
  },
  {
    src: childrenWeaving,
    alt: { CN: '学习纺纱、织布和使用缝纫机的儿童', EN: 'Children learning spinning, weaving, and sewing' },
    caption: { CN: '图3-5 儿童学习纺纱、织布和使用缝纫机', EN: 'Figure 3-5 The children are learning to spin yarn, weave cloth, and use a sewing machine.' },
    objectPosition: 'center',
  },
  {
    src: cityWall1906,
    alt: { CN: '1906年的通远坊城墙', EN: 'Tongyuan Ward city wall in 1906' },
    caption: { CN: '图4-1 通远坊城墙（下图摄于1906年）', EN: 'Figure 4-1 The City Wall of Tongyuan Ward (The photo below was taken in 1906)' },
    objectPosition: 'center',
  },
  {
    src: cathedral1932,
    alt: { CN: '1932年的通远坊主教座堂', EN: 'Tongyuan Ward Cathedral in 1932' },
    caption: { CN: '图4-4 通远坊主教座堂（下图摄于1932年）', EN: 'Figure 4-4 Tongyuan Ward Cathedral (The photo below was taken in 1932)' },
    objectPosition: 'center',
  },
];

const architectureImages: CarouselImage[] = [
  {
    src: cathedralCurrent,
    alt: { CN: '通远坊主教座堂建筑外观', EN: 'Architectural exterior of Tongyuan Ward Cathedral' },
    caption: { CN: '图4-19 通远坊主教座堂', EN: 'Figure 4-19 Tongyuan Ward Cathedral' },
    objectPosition: 'center',
  },
  {
    src: holyChildhoodCurrent,
    alt: { CN: '通远坊保赤会建筑现状', EN: 'Present-day Holy Childhood Association building in Tongyuan Ward' },
    caption: { CN: '图4 通远坊保赤会', EN: 'Figure 4 Holy Childhood Association at Tongyuan Ward' },
    objectPosition: 'center',
  },
  {
    src: cityWall1906,
    alt: { CN: '1906年的通远坊城墙与建筑群', EN: 'Tongyuan Ward city wall and complex in 1906' },
    caption: { CN: '图4-1 通远坊城墙（下图摄于1906年）', EN: 'Figure 4-1 The City Wall of Tongyuan Ward (The photo below was taken in 1906)' },
    objectPosition: 'center',
  },
  {
    src: bishopResidenceCorridor1906,
    alt: { CN: '1906年连接主教府与主教座堂的走廊', EN: `Corridor between the Bishop's Residence and cathedral in 1906` },
    caption: { CN: '图4-6 通远坊主教府与主教座堂连接走廊（摄于1906年）', EN: "Figure 4-6 Corridor Connecting the Bishop's Residence and the Cathedral in Tongyuan Ward (Taken in 1906)" },
    objectPosition: 'center',
  },
  {
    src: orphanage,
    alt: { CN: '通远坊孤儿院历史建筑', EN: 'Historic Tongyuan Ward Orphanage' },
    caption: { CN: '图4-12 通远坊孤儿院', EN: 'Figure 4-12 Tongyuan Ward Orphanage' },
    objectPosition: 'center',
  },
  {
    src: convent,
    alt: { CN: '通远坊修女住所与修道院小堂', EN: `Sisters' residence and convent chapel in Tongyuan Ward` },
    caption: { CN: '图4-13 通远坊修女住所与修道院小堂', EN: "Figure 4-13 Sisters' Resident and Convent Chapel of Tongyuan Ward" },
    objectPosition: 'center',
  },
];

export const assetsConfig = {
  // 全局背景图
  globalBackground: globalBackground,

  // Cover页面资源
  cover: {
    background: '', // 未使用的占位符
    buildingGif: coverMainImage, // 使用 home 目录下的主图片
    titleImage: coverTitleImage, // 标题图片
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
    reports: {
      chinese: reportCnPdf,
      english: reportEnPdf,
    },
    overviews: {
      chinese: overviewCnPdf,
      english: overviewEnPdf,
    },
  },

  // Detail页面资源
  detail: {
    mainImage: jianzhu, // Overview页面使用（使用建筑图片作为占位）
    historyImage: historyImage, // History页面使用
    otherImage: otherImage, // Voices页面使用
    overviewImages,
    historyImages,
    architectureImages,
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
  },
};

export function getReportPdfPath(language: 'CN' | 'EN'): string {
  return language === 'CN' ? assetsConfig.pdfs.reports.chinese : assetsConfig.pdfs.reports.english;
}

export function getOverviewPdfPath(language: 'CN' | 'EN'): string {
  return language === 'CN' ? assetsConfig.pdfs.overviews.chinese : assetsConfig.pdfs.overviews.english;
}
