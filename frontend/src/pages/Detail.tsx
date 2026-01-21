import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguageStore } from '../store/languageStore';
import { assetsConfig, getPdfPath } from '../config/assets.config';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { BreathingAnimation } from '../components/animations/BreathingAnimation';
import { Carousel } from '../components/Carousel';
import './Detail.css';

type TabType = 'overview' | 'events' | 'figures' | 'elements';

const tabLabels: Record<'CN' | 'EN', Record<TabType, string>> = {
  CN: {
    overview: '概述',
    events: '关键事件',
    figures: '关键人物',
    elements: '三要素脉络',
  },
  EN: {
    overview: 'Overview',
    events: 'Key Events',
    figures: 'Key Figures',
    elements: 'Three Elements',
  },
};

// 建筑类别的专用标签
const architectureTabLabels: Record<'CN' | 'EN', Record<TabType, string>> = {
  CN: {
    overview: '概述',
    events: '建筑详情',
    figures: '建筑形态',
    elements: '中西融合',
  },
  EN: {
    overview: 'Overview',
    events: 'Building Details',
    figures: 'Architectural Forms',
    elements: 'Sino-Western Fusion',
  },
};

const categoryLabels: Record<'CN' | 'EN', Record<string, string>> = {
  CN: {
    overview: '概述',
    history: '历史',
    architecture: '建筑',
    voices: '口述',
  },
  EN: {
    overview: 'Overview',
    history: 'History',
    architecture: 'Architecture',
    voices: 'Voices',
  },
};


export const Detail: React.FC = () => {
  const navigate = useNavigate();
  const { category = 'overview' } = useParams<{ category: string }>();
  const { language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // 音频播放状态（移到组件级别，以便在页面切换时停止）
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRefs = useRef<Array<HTMLAudioElement | null>>([null, null, null]);
  // 存储每个音频对应的语言，用于检测语言变化
  const audioLanguageRefs = useRef<Array<'CN' | 'EN' | null>>([null, null, null]);

  // 当category变化时，重置activeTab为overview，并停止所有音频
  useEffect(() => {
    setActiveTab('overview');
    // 停止所有正在播放的音频
    audioRefs.current.forEach((audio) => {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    setPlayingIndex(null);
  }, [category]);
  
  // 当语言变化时，停止所有音频并清理audioRefs
  useEffect(() => {
    // 停止所有正在播放的音频
    audioRefs.current.forEach((audio) => {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    // 清理audioRefs和audioLanguageRefs，以便下次播放时使用新语言的音频
    audioRefs.current = [null, null, null];
    audioLanguageRefs.current = [null, null, null];
    setPlayingIndex(null);
  }, [language]);
  
  // 当组件卸载时，停止所有音频
  useEffect(() => {
    return () => {
      audioRefs.current.forEach((audio) => {
        if (audio && !audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  const handleBack = () => {
    navigate('/home');
  };

  const handleEnterChat = () => {
    navigate('/chat', { state: { returnTo: `/detail/${category}` } });
  };

  const tabs: TabType[] = ['overview', 'events', 'figures', 'elements'];
  // 根据category选择标签：建筑类别使用专用标签，其他使用通用标签（voices 不显示标签页）
  const labels = category === 'architecture' 
    ? architectureTabLabels[language]
    : tabLabels[language];
  
  // 根据category动态设置标题（使用categoryLabels而不是labels）
  const pageTitle = categoryLabels[language][category] || categoryLabels[language].overview;

  // 各标签页内容数据
  // 注意：旧的 overviewContent 已删除，请使用 tabContent
  // const _old_overviewContent_removed = {
  //   CN: {
  //     what: "通远坊是位于陕西西安高陵的一个以天主教主教座堂为核心形成的历史性宗教社区，始建于清康熙五十年（1711年），19世纪中叶起成为天主教陕西宗座代牧区乃至整个中国西北地区的最高教务行政与传教中心，被称为\"陕西总堂\"。它不仅承担宗教礼仪功能，还集主教驻地、修道院、神学院、育婴堂和慈善医疗于一体，构成一个自给自足的宗教—社会综合体；其建筑群在近代毁灭与重建中形成中西合璧的形态，至今仍延续宗教使用，既是西北天主教传播与本土化的重要见证，也是研究近代中西文化交流与地方宗教社区史的关键遗产样本。",
  //     values: [
  //       {
  //         title: "历史价值",
  //         text: "通远坊是天主教在中国西北内陆最早扎根并长期作为核心的传教与行政中心，自清初禁教时期存续至近代，曾为陕西及西北宗座代牧区主教座堂，直接隶属罗马教廷，其发展完整呈现了天主教在中国由地下传播、制度化扩展到本土化转型的历史进程。"
  //       },
  //       {
  //         title: "建筑价值",
  //         text: "通远坊保存了西北地区规模最大、体系最完整的天主教建筑群，空间格局承袭中国传统院落秩序，结构与装饰以本土营造技术转译西方教堂形制，是内陆地区中西建筑融合与近代教堂本土化的典型实物范例，具有突出的建筑史与技术史价值。"
  //       },
  //       {
  //         title: "社会价值",
  //         text: "通远坊不仅是宗教建筑，更是一个延续至今的教民社区核心，长期承担教育、医疗、育婴与慈善职能，形成以信仰为纽带的稳定社会网络，其礼仪、节庆与生活方式体现了宗教与地方文化的深度融合，是研究近代内陆宗教社区与社会变迁的重要活态样本。"
  //       }
  //     ],
  //     sections: [
  //       { title: "历史沿革", text: "通远坊自清初建堂至近代的历史进程，以及其作为西北天主教中心的形成与变迁。" },
  //       { title: "建筑", text: "通远坊教堂及相关建筑群的空间格局、建筑形制与中西融合特征。" },
  //       { title: "社区口述史", text: "教民亲身经历中的日常生活、信仰实践与动荡年代的集体记忆。" }
  //     ],
  //     recommended: [
  //       {
  //         title: "四阶段",
  //         text: "清初至1845年为初创与扎根期，在禁教与松动并存的环境中形成稳定教民基础；1845年至1901年为总堂确立与快速扩张期，通远坊成为西北天主教行政中心，通过赈灾、营建与堡垒化在动荡中壮大；1902年至1932年为危机应对与地位转移期，在教权纷争与军阀混战中维持多重社会功能，最终总堂迁离；1933年至1952年为功能延续与本土化转型期，通远坊由区域中枢转为地方会院，完成从外籍主导向本地教会的历史转折。"
  //       },
  //       {
  //         title: "四座建筑",
  //         text: "通远坊现存的四座核心建筑共同构成了其宗教与社区体系的物质核心：主教堂作为礼仪与精神中心，承载主教主持的重要宗教活动；小修院用于培养本土神职人员，是教会延续与本地化的关键空间；修女院承担修女居住与修行职能，并直接运营教育、医疗与慈善事务；育婴堂则集中体现通远坊长期从事的孤儿收养与社会救济功能，四者在空间与功能上相互支撑，形成一个完整而自给的宗教—社会综合体。"
  //       },
  //       {
  //         title: "口述史",
  //         text: "通远坊的口述史以亲历者记忆为核心，从孤儿院生活、修女与神父的日常照料，到信徒在政治运动中的冲击与坚守，呈现了一个兼具慈善救助、宗教实践与社区互助功能的生活世界；这些叙述还记录了文革时期教堂被保护的曲折经过，以及\"圣母洒花\"等信仰事件如何支撑教民在高压环境下维系信仰与共同体认同，构成通远坊历史中最具温度与情感深度的记忆层面。"
  //       }
  //     ],
  //     events: [
  //       { title: "清初建堂与教民聚落形成", text: "通远坊于清初建堂并逐步形成稳定教民社区，成为天主教在西北内陆扎根的重要起点。" },
  //       { title: "确立为西北宗座代牧区总堂", text: "19世纪中叶通远坊成为西北天主教最高教务与行政中心，确立其区域性枢纽地位。" },
  //       { title: "教难冲击与建筑重建（1901年前后）", text: "在社会动荡中教堂遭受破坏并重建，推动通远坊建筑形态与防御格局的形成。" },
  //       { title: "总堂外迁与功能转型", text: "20世纪初西北教务中心迁离后，通远坊由区域中枢转为地方性宗教与社区中心。" },
  //       { title: "改革开放后宗教恢复与重建", text: "1980年代政策放宽后，通远坊教堂修复、宗教生活恢复，社区信仰重新公开延续。" }
  //     ],
  //     location: "通远坊位于陕西省西安市高陵区通远街道一带，现为仍在使用中的天主教堂与教民社区，历史建筑主体得以保存，并持续承载宗教与社区活动。",
  //     protection: "通远坊作为西北地区保存较为完整的天主教历史建筑群，于2008年被列为陕西省重点文物保护单位。"
  //   },
  //   EN: {
  //     what: "Tongyuanfang is a historical religious community centered around a Catholic cathedral located in Gaoling, Xi'an, Shaanxi, established in 1711. From the mid-19th century, it became the highest administrative and missionary center of the Catholic Shaanxi Apostolic Vicariate and the entire Northwest China, known as the 'Shaanxi General Church'.",
  //     values: [
  //       { title: "Historical Value", text: "Tongyuanfang represents the earliest and longest-standing Catholic missionary and administrative center in Northwest China." },
  //       { title: "Architectural Value", text: "Tongyuanfang preserves the largest and most complete Catholic architectural complex in Northwest China." },
  //       { title: "Social Value", text: "Tongyuanfang is not just a religious building but a core of a continuing Christian community." }
  //     ],
  //     sections: [
  //       { title: "Historical Evolution", text: "The historical process of Tongyuanfang from the early Qing Dynasty to modern times." },
  //       { title: "Architecture", text: "The spatial layout, architectural forms and Sino-Western fusion features of Tongyuanfang church and related buildings." },
  //       { title: "Community Oral History", text: "Daily life, faith practices and collective memories in the experience of believers." }
  //     ],
  //     recommended: [
  //       { title: "Four Stages", text: "Four major historical stages of development." },
  //       { title: "Four Buildings", text: "Four core buildings that constitute the material core of the religious and community system." },
  //       { title: "Oral History", text: "Personal memories of believers and community members." }
  //     ],
  //     events: [
  //       { title: "Early Church Establishment", text: "The formation of a stable Christian community in the early Qing Dynasty." },
  //       { title: "Establishment as General Church", text: "Becoming the highest administrative center of Northwest China Catholicism in the mid-19th century." },
  //       { title: "Religious Persecution and Reconstruction", text: "Church destruction and reconstruction during social turmoil around 1901." },
  //       { title: "Relocation and Functional Transformation", text: "Transition from regional center to local religious and community center." },
  //       { title: "Post-Reform Religious Restoration", text: "Church restoration and resumption of religious life after the 1980s." }
  //     ],
  //     location: "Tongyuanfang is located in Tongyuan Street, Gaoling District, Xi'an City, Shaanxi Province, and remains an active Catholic church and Christian community.",
  //     protection: "Tongyuanfang was listed as a Shaanxi Provincial Key Cultural Relics Protection Unit in 2008."
  //   }
  // };

  // Overview页面三个分类内容数据
  const overviewContent = {
    CN: {
      项目概览: {
        what: "通远坊是位于陕西西安高陵的一个以天主教主教座堂为核心形成的历史性宗教社区，始建于清康熙五十年（1711年），19世纪中叶起成为天主教陕西宗座代牧区乃至整个中国西北地区的最高教务行政与传教中心，被称为\"陕西总堂\"。它不仅承担宗教礼仪功能，还集主教驻地、修道院、神学院、育婴堂和慈善医疗于一体，构成一个自给自足的宗教—社会综合体；其建筑群在近代毁灭与重建中形成中西合璧的形态，至今仍延续宗教使用，既是西北天主教传播与本土化的重要见证，也是研究近代中西文化交流与地方宗教社区史的关键遗产样本。",
        whyImportant: {
          title: "为什么重要",
          values: [
            {
              title: "历史价值",
              text: "通远坊是天主教在中国西北内陆最早扎根并长期作为核心的传教与行政中心，自清初禁教时期存续至近代，曾为陕西及西北宗座代牧区主教座堂，直接隶属罗马教廷，其发展完整呈现了天主教在中国由地下传播、制度化扩展到本土化转型的历史进程。"
            },
            {
              title: "建筑价值",
              text: "通远坊保存了西北地区规模最大、体系最完整的天主教建筑群，空间格局承袭中国传统院落秩序，结构与装饰以本土营造技术转译西方教堂形制，是内陆地区中西建筑融合与近代教堂本土化的典型实物范例，具有突出的建筑史与技术史价值。"
            },
            {
              title: "社会价值",
              text: "通远坊不仅是宗教建筑，更是一个延续至今的教民社区核心，长期承担教育、医疗、育婴与慈善职能，形成以信仰为纽带的稳定社会网络，其礼仪、节庆与生活方式体现了宗教与地方文化的深度融合，是研究近代内陆宗教社区与社会变迁的重要活态样本。"
            }
          ]
        }
      },
      阅读指引: {
        howToRead: {
          title: "本站怎么读",
          sections: [
            { title: "历史沿革", text: "通远坊自清初建堂至近代的历史进程，以及其作为西北天主教中心的形成与变迁。" },
            { title: "建筑", text: "通远坊教堂及相关建筑群的空间格局、建筑形制与中西融合特征。" },
            { title: "社区口述史", text: "教民亲身经历中的日常生活、信仰实践与动荡年代的集体记忆。" }
          ]
        }
      },
      基本信息: {
        location: "通远坊位于陕西省西安市高陵区通远街道一带，现为仍在使用中的天主教堂与教民社区，历史建筑主体得以保存，并持续承载宗教与社区活动。",
        protection: "通远坊作为西北地区保存较为完整的天主教历史建筑群，于2008年被列为陕西省重点文物保护单位。"
      }
    },
    EN: {
      项目概览: {
        what: "Tongyuanfang is a historical religious community centered around a Catholic cathedral located in Gaoling, Xi'an, Shaanxi, established in 1711. From the mid-19th century, it became the highest administrative and missionary center of the Catholic Shaanxi Apostolic Vicariate and the entire Northwest China, known as the 'Shaanxi General Church'.",
        whyImportant: {
          title: "Why Important",
          values: [
            {
              title: "Historical Value",
              text: "Tongyuanfang represents the earliest and longest-standing Catholic missionary and administrative center in Northwest China."
            },
            {
              title: "Architectural Value",
              text: "Tongyuanfang preserves the largest and most complete Catholic architectural complex in Northwest China."
            },
            {
              title: "Social Value",
              text: "Tongyuanfang is not just a religious building but a core of a continuing Christian community."
            }
          ]
        }
      },
      阅读指引: {
        howToRead: {
          title: "How to Read This Site",
          sections: [
            { title: "Historical Evolution", text: "The historical process of Tongyuanfang from the early Qing Dynasty to modern times." },
            { title: "Architecture", text: "The spatial layout, architectural forms and Sino-Western fusion features of Tongyuanfang church and related buildings." },
            { title: "Community Oral History", text: "Daily life, faith practices and collective memories in the experience of believers." }
          ]
        }
      },
      基本信息: {
        location: "Tongyuanfang is located in Tongyuan Street, Gaoling District, Xi'an City, Shaanxi Province, and remains an active Catholic church and Christian community.",
        protection: "Tongyuanfang was listed as a Shaanxi Provincial Key Cultural Relics Protection Unit in 2008."
      }
    }
  };

  const handleReadBook = () => {
    const pdfPath = getPdfPath(language);
    window.open(pdfPath, '_blank');
  };

  const renderOverviewContent = () => {
    const content = overviewContent[language];
    
    return (
      <div className="overview-content">
        <div className="ebook-button-container">
          <button className="ebook-button" onClick={handleReadBook}>
            <BreathingAnimation>
              <img src={assetsConfig.icons.book} alt="Book" className="ebook-icon" />
            </BreathingAnimation>
            <span className="ebook-text">{language === 'CN' ? '阅读电子书' : 'Reading Book'}</span>
          </button>
        </div>

        <section className="overview-section">
          <h3 className="section-title">{language === 'CN' ? '概览' : 'Overview'}</h3>
          
          <div className="subsection">
            <h4 className="subsection-title">{language === 'CN' ? '通远坊是什么' : 'What is Tongyuanfang'}</h4>
            <p className="subsection-text">{content.项目概览.what}</p>
          </div>

          <div className="subsection">
            <h4 className="subsection-title">{content.项目概览.whyImportant.title}</h4>
            <div className="value-list">
              {content.项目概览.whyImportant.values.map((value, index) => (
                <div key={index} className="value-item">
                  <h5 className="value-title">{value.title}</h5>
                  <p className="value-text">{value.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overview-section">
          <h3 className="section-title">{language === 'CN' ? '阅读指引' : 'Reading Guide'}</h3>
          
          <div className="subsection">
            <h4 className="subsection-title">{content.阅读指引.howToRead.title}</h4>
            <div className="section-list">
              {content.阅读指引.howToRead.sections.map((section, index) => (
                <div key={index} className="section-item">
                  <span className="section-number">{index + 1}.</span>
                  <div>
                    <strong className="section-name">{section.title}</strong>
                    <span className="section-desc">：{section.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overview-section">
          <h3 className="section-title">{language === 'CN' ? '基本信息' : 'Basic Information'}</h3>
          
          <div className="subsection">
            <h4 className="subsection-title">{language === 'CN' ? '地理位置/现状' : 'Location/Status'}</h4>
            <p className="subsection-text">{content.基本信息.location}</p>
          </div>

          <div className="subsection">
            <h4 className="subsection-title">{language === 'CN' ? '文保信息' : 'Protection Status'}</h4>
            <p className="subsection-text">{content.基本信息.protection}</p>
          </div>
        </section>
      </div>
    );
  };

  // 建筑类别专用内容数据（4个分类）
  const architectureContent: Record<'CN' | 'EN', Record<TabType, any>> = {
    CN: {
      overview: {
        // 类别一：建筑群概览
        overallLayout: {
          title: "建筑群总体格局",
          text: "通远坊建筑群以主教堂为核心，整体呈现出集宗教、行政、教育、医疗、慈善与防御于一体的封闭型复合格局。建筑沿中轴与院落展开，主教堂居于视觉与功能中心，周边依次分布主教府、神学院（小修院）、修女院、育婴堂、医院及学校等功能性建筑；外围以高大城墙与城门围合，形成具有防御性的堡垒空间。整体布局既遵循中国传统聚落与院落组织方式，又吸收西方教会建筑的功能分区理念，使通远坊成为一个自给自足、层级分明的宗教—社区综合体。"
        },
        fourBuildings: {
          title: "现存四座核心建筑总览",
          buildings: [
            {
              title: "1. 主教堂",
              text: "主教堂是通远坊建筑群的精神与礼仪中心，承担弥撒、圣事与重要宗教仪式，其形制融合西方教堂空间与本土营造技术，象征通远坊作为西北天主教核心的历史地位。"
            },
            {
              title: "2. 小修院",
              text: "小修院是培养本土神职人员的重要场所，承担神学教育与日常修道功能，标志着通远坊在19世纪中叶后系统推进教会本土化与人才培养的制度基础。"
            },
            {
              title: "3. 修女院",
              text: "修女院为修女居住与修行之所，也是慈善与教育事务的管理中心，修女们由此主持医疗、育婴和救济工作，使宗教实践深入地方社会生活。"
            },
            {
              title: "4. 育婴堂",
              text: "育婴堂集中体现通远坊的慈善属性，长期收养孤儿与弃婴，并配合教育、医疗与劳作训练，形成兼具救助、抚育与社会整合功能的社区机构。"
            }
          ]
        }
      },
      events: {
        // 类别二：单体建筑详情（映射到 events 标签页）
        cathedral: {
          title: "主教堂：概述/功能/年代线索/图集",
          overview: {
            title: "概述",
            text: "通远坊主教堂是整个建筑群的核心与象征性建筑，体量宏大、位置居中，形制上融合西方教堂空间与中国传统砖木营造方式，是\"西北总堂\"地位最直观的物质体现。"
          },
          function: {
            title: "功能",
            text: "主教堂承担弥撒、圣事、主教典礼及重大宗教活动，是区域教会的礼仪与精神中心；在通远坊作为行政中枢时期，它同时也是教会权威展示与教民集体认同的核心空间。"
          },
          timeline: {
            title: "年代线索",
            text: "其最初形态可追溯至1711年方启升购地建堂；19世纪中叶冯尚任确立通远坊为总堂后持续使用；1875年在高一志与林奇爱时期扩建为规模宏大的砖木结构大教堂，形成可容纳约2000人礼拜的主体格局；1900年前后虽经历破坏，但在辛丑条约后得以修复并延续至今，成为通远坊历史连续性的关键见证。"
          }
        },
        seminary: {
          title: "小修院：同上",
          overview: {
            title: "概述",
            text: "通远坊小修院是通远坊建筑群中承担神职教育职能的核心建筑之一，与主教堂共同构成教会制度运行的基础空间，体现了通远坊由传教据点向制度化教区中心的发展。"
          },
          function: {
            title: "功能",
            text: "小修院主要用于培养本土神职人员，教授拉丁文、神学及基础文化课程，为西北各地教区持续输送中国籍司铎与修生，是通远坊推进教会本土化与长期扩展的人才中枢。"
          },
          timeline: {
            title: "年代线索",
            text: "小修院始建于1845年冯尚任主教确立通远坊为陕西教区总堂之际，并由其亲自授课；在高一志与林奇爱时期不断扩充并制度化，成为西北重要的神职培养基地；1932年总堂迁移后，小修院仍作为功能性会院的重要组成部分得以延续使用。"
          }
        },
        convent: {
          title: "修女院：同上",
          overview: {
            title: "概述",
            text: "通远坊修女院是建筑群中承担女性修会生活与慈善事务的核心空间，与主教堂、小修院共同构成通远坊完整的教会运行体系，是其社会服务功能的重要物质载体。"
          },
          function: {
            title: "功能",
            text: "修女院主要用于修女的居住与修行，同时作为慈善与社会事务的管理中心，修女们由此主持育婴堂、孤儿院、医院、养老院及女子教育等工作，使天主教的信仰实践深入地方社会与日常生活。"
          },
          timeline: {
            title: "年代线索",
            text: "修女院的设立与发展集中于19世纪末，尤其在林奇爱主教时期（1887–1901），随着方济各圣母传教会修女的引入而正式建成并投入使用；此后在20世纪上半叶持续运作，1949年后随宗教活动受限而功能中断，其历史遗存成为通远坊慈善传统的重要见证。"
          }
        },
        orphanage: {
          title: "育婴堂：同上",
          overview: {
            title: "概述",
            text: "通远坊育婴堂是通远坊建筑群中最具社会救助属性的核心建筑之一，集中体现了天主教在当地长期开展的慈善抚育与社会关怀实践，是通远坊区别于单一宗教场所的重要标志。"
          },
          function: {
            title: "功能",
            text: "育婴堂主要收养因贫困、灾荒或动乱被遗弃的婴幼儿与孤儿，提供抚养、教育与基本医疗，并通过劳动训练和婚配安排帮助其融入社会，构成一个兼具救助、教育与社会整合功能的慈善机构。"
          },
          timeline: {
            title: "年代线索",
            text: "育婴堂的制度化运行始于19世纪末林奇爱主教时期，随修女会与保赤会的引入而规模化发展；其功能在20世纪上半叶持续延续，1949年后逐步解散，建筑先后被改作医院等公共用途，成为通远坊近代社会功能变迁的重要历史见证。"
          }
        }
      },
      figures: {
        // 类别三：建筑形态与阶段变化（映射到 figures 标签页）
        expansion: {
          title: "扩张与\"堡垒化\"（城垣/防御性等线索）",
          sections: [
            {
              title: "一、扩张过程：从传教点到\"东方小罗马\"",
              stages: [
                {
                  period: "1. 初创阶段（1711年）",
                  text: "意大利主教方启升建立最初圣堂，为地方性传教据点，后因\"礼仪之争\"被毁。"
                },
                {
                  period: "2. 权力中心确立（1844–1848年）",
                  text: "禁教结束后，冯尚仁重建圣方济各主教座堂，规模宏大，成为陕西代牧区主教驻地，标志着通远坊成为西北天主教行政中心。"
                },
                {
                  period: "3. 功能扩张（1849年起）",
                  text: "高一志新建主教府与神哲学院，培养本土神职人员，推动信仰内化与社区教育。"
                },
                {
                  period: "4. 社会服务与设施完善（1862–1878年）",
                  text: "同治年间回民暴乱，教会因与回民关系良好吸引大量灾民，影响力扩大。光绪四年（1878年）陕西大旱，高一志与林奇爱以工代赈修建城墙，并陆续兴建修女院、育婴堂、医院、学校等，形成功能齐全的教会社区。"
                },
                {
                  period: "5. 全盛时期（19世纪末）",
                  text: "林奇爱邀请欧洲修女来华，新建修女院，并设立邮政所、气象站、地震站、发电站等设施，通远坊被誉为\"东方小罗马\"，面积达426亩，房屋1600间。"
                }
              ]
            },
            {
              title: "二、城垣修筑与\"堡垒化\"的成形",
              stages: [
                {
                  period: "1. 同治—光绪年间的社会危机",
                  text: "1862年回民起义、1878年关中大旱，是通远坊空间形态发生质变的直接诱因。战乱使通远坊成为\"避难岛\"，大量非教民依附教会；饥荒时期教会通过赈灾与\"以工代赈\"掌握了人力与组织资源。在这一背景下，修筑城垣不再只是象征性围界，而成为现实防御设施。"
                },
                {
                  period: "2. 城垣的防御与象征双重功能",
                  text: "资料明确记载，通远坊在19世纪后期四周筑有高大城墙，并由不同主教分段修筑：城墙限定了教区的清晰边界，区分\"教内\"与\"教外\"；形成可控制出入口的半军事化空间；在心理层面强化了\"安全区\"\"庇护所\"的集体认知。至19世纪末，\"教堂高耸、城垣环绕\"的格局已经稳定，被称为\"东方小罗马\"。"
                }
              ]
            }
          ]
        },
        reconstruction: {
          title: "重建后的细部变化",
          changes: [
            {
              title: "1. 风格定型为成熟的中西合璧",
              text: "建筑普遍采用青砖墙体、西式拱券门窗与壁柱，但屋顶保持中式抬梁木构与青瓦。细节上出现玫瑰窗、连续券脚等西式装饰，与雕花青脊、砖叠涩檐口等本土工艺融合。"
            },
            {
              title: "2. 结构技术本地化与混合化",
              text: "承重体系发展为青砖厚墙与砖拱券相结合，并使用铁扒钉加强连接。墙体砌法多样，甚至出现土坯外包青砖的混合做法，体现对本地材料的适应性改造。"
            },
            {
              title: "3. 平面布局反映功能与秩序",
              text: "建筑平面设计明确服务于功能，如小修院的\"凸\"字形、修女院的\"T\"字形、育婴堂的\"回\"字形，分别对应教学、生活与慈善照管的需求，空间组织清晰且高效。"
            },
            {
              title: "4. 内外装饰兼具宗教与艺术性",
              text: "室内出现彩绘壁画、圣像彩绘及雕刻石柱底座；外立面注重比例划分与装饰性砌筑。房间内天花与墙角的圆角处理成为特色细部。"
            }
          ]
        },
        monastery: {
          title: "会院化后的功能空间（1933后）",
          text: "1933年后，通远坊\"会院化\"形成功能完备的封闭社区，其核心功能空间可概括为：1.圣事与行政核心：主教座堂与公署，为宗教与权力中心。2.神职教育区：神哲学院，专门培养本土神职人员。3.修女灵修生活区：圣母会与圣心会修女院，提供集体居住与灵修空间。4.社会服务区：育婴堂、医院、学校、邮政等，实现社区服务自足。整体空间布局呈现出\"向心围合、等级分明、自足闭环\"的堡垒化特征，是一个集信仰、教育、生活、慈善于一体的独立天主教社区。"
        }
      },
      elements: {
        // 类别四：营造技艺（映射到 elements 标签页）
        timberStructure: {
          title: "木构梁架/筒瓦屋面",
          sections: [
            {
              title: "一、形制层面：营造西式礼仪空间",
              text: "通远坊主教堂通过运用中轴对称、纵深空间、拱券门窗、壁柱分段及券顶空间等经典建筑元素，旨在营造出接近巴洛克或新古典主义的视觉效果，从而在空间氛围与象征意义上满足天主教礼仪所需的庄严仪式感。"
            },
            {
              title: "二、结构与技术层面：中式核心，西式表皮",
              text: "通远坊建筑的真正核心是中国传统的木构梁架体系，它实际承担了建筑的全部荷载；而外观上的西式元素，如拱券、壁柱与券顶，大多作为非承重的装饰性构件附着于主体结构之上，主要起到视觉分隔与空间引导的作用。这种\"西式形象\"与\"中式结构\"的分离，正是其\"形似而实非\"建造智慧的关键所在。"
            },
            {
              title: "三、材料与施工层面：彻底的本地化转译",
              text: "建筑广泛采用本地的木材、青砖与筒瓦，完全摒弃了对西方石材的依赖；施工则交由地方工匠沿用传统工艺完成，无需引入复杂的西方专业技术。这一选择使建筑更好地适应了地方气候条件，并获得了易于维修、可持续传承的本土生命力。"
            }
          ]
        },
        archStructure: {
          title: "拱券门窗/券式拱顶",
          arches: {
            title: "一、拱券门窗：西式形制，本土化砌筑",
            sections: [
              {
                title: "1. 形式多样，功能明确",
                text: "主要采用半圆券（如小修院正门、育婴堂西/北侧）与扁平券（育婴堂东/南侧），形式选择与立面构图及内部空间需求相关。小修院正立面将连续券门与券窗上下对应，形成严谨的古典三段式构图，具有强烈的西式秩序感。"
              },
              {
                title: "2. 本土材料与砌法",
                text: "券体均采用本地青砖砌筑，而非西式石材，这是最根本的材质本土化。砌筑工艺精湛，如小修院券门呈现\"券顶与壁柱自外向内连续叠进三层\"的立体效果，展示了本地工匠对砖砌技艺的高超掌握。"
              },
              {
                title: "3. 与中式元素的组合",
                text: "拱券常与突出墙面的砖砌壁柱结合，构成西式的\"柱-券\"母题。这些西式母题被整合到以青砖墙、木门窗为主的中式墙体体系中，并在檐口等处与砖叠涩等中式做法衔接。"
              }
            ]
          },
          vaults: {
            title: "二、券式拱顶：结构适应与有限使用",
            sections: [
              {
                title: "1. 作为主要结构体系",
                text: "在育婴堂一层，明确使用了由砖柱（700mm×800mm）支撑的砖拱券作为核心受力体系，这是西式拱顶技术的直接应用，以创造连续、开阔的内部空间。"
              },
              {
                title: "2. 技术融合的关键",
                text: "砖拱券结构与上部的木梁板楼层或木屋架之间的连接与荷载传递，是中西技艺融合的关键技术点。使用铁扒钉等金属件进行拉结，正是为解决此类问题。"
              }
            ]
          }
        },
        localization: {
          title: "本土化\"形似而实非\"的建造语汇",
          text: "在形制层面，通远坊主教堂及附属建筑通过中轴对称、纵深空间、拱券门窗、壁柱分段和券顶空间等元素，营造出接近巴洛克或新古典主义教堂的视觉效果，使建筑在仪式感与象征意义上符合天主教礼仪需求。但在结构与技术层面，这些\"西式\"形象并不依赖石砌拱券或承重墙体系，而是由中国传统木构梁架真实承担荷载。拱券、壁柱与券顶多为非承重构件或装饰性做法，嵌附于墙体或梁架之下，起到视觉分隔与空间引导的作用，而非结构核心。在材料与施工层面，通远坊广泛使用本地可得的木材、青砖与筒瓦，由地方工匠按传统做法施工，避免了对西方石材工艺与专业技术的依赖，使建筑既符合地方气候条件，又具备可维修、可延续的生命力。这种\"形似而实非\"的建造语汇，本质上是西方宗教建筑功能与中国传统营造体系之间的调适结果：它既保留了教堂应有的空间象征，又通过本土结构、材料与工艺完成了在地转译，构成通远坊作为内陆地区天主教建筑最具代表性的本土化实践。"
        }
      }
    },
    EN: {
      // 英文版本可以后续补充，先使用中文版本的结构作为占位
      overview: {
        overallLayout: {
          title: "Overall Layout of the Architectural Complex",
          text: "The Tongyuanfang architectural complex centers around the main cathedral, presenting a closed composite pattern integrating religion, administration, education, medical care, charity, and defense."
        },
        fourBuildings: {
          title: "Overview of Four Existing Core Buildings",
          buildings: [
            {
              title: "1. Main Cathedral",
              text: "The main cathedral is the spiritual and liturgical center of the Tongyuanfang architectural complex, hosting Mass, sacraments, and important religious ceremonies."
            },
            {
              title: "2. Minor Seminary",
              text: "The minor seminary is an important place for training local clergy, undertaking theological education and daily monastic functions."
            },
            {
              title: "3. Convent",
              text: "The convent serves as a residence and spiritual practice space for nuns, and also as a management center for charity and educational affairs."
            },
            {
              title: "4. Orphanage",
              text: "The orphanage embodies Tongyuanfang's charitable nature, long-term adoption of orphans and abandoned infants."
            }
          ]
        }
      },
      events: {
        cathedral: {
          title: "Main Cathedral: Overview/Function/Timeline/Gallery",
          overview: { title: "Overview", text: "The main cathedral is the core and symbolic building of the entire complex." },
          function: { title: "Function", text: "The cathedral hosts Mass, sacraments, bishop ceremonies, and major religious activities." },
          timeline: { title: "Timeline", text: "Its initial form can be traced back to 1711 when Fang Qisheng purchased land and built the church." }
        },
        seminary: {
          title: "Minor Seminary: Same as above",
          overview: { title: "Overview", text: "The minor seminary is a core building undertaking theological education functions." },
          function: { title: "Function", text: "The seminary is mainly used to train local clergy, teaching Latin, theology, and basic cultural courses." },
          timeline: { title: "Timeline", text: "The seminary was founded in 1845 when Feng Shangren established Tongyuanfang as the general church of Shaanxi Diocese." }
        },
        convent: {
          title: "Convent: Same as above",
          overview: { title: "Overview", text: "The convent is a core space for female religious life and charitable affairs in the complex." },
          function: { title: "Function", text: "The convent is mainly used for nuns' residence and spiritual practice." },
          timeline: { title: "Timeline", text: "The establishment and development of the convent concentrated in the late 19th century." }
        },
        orphanage: {
          title: "Orphanage: Same as above",
          overview: { title: "Overview", text: "The orphanage is one of the most socially charitable core buildings in the Tongyuanfang complex." },
          function: { title: "Function", text: "The orphanage mainly adopts abandoned infants and orphans due to poverty, famine, or turmoil." },
          timeline: { title: "Timeline", text: "The institutional operation of the orphanage began in the late 19th century during Bishop Lin Qi'ai's period." }
        }
      },
      figures: {
        expansion: {
          title: "Expansion and 'Fortification'",
          sections: [
            {
              title: "I. Expansion Process: From Mission Point to 'Little Rome of the East'",
              stages: [
                { period: "1. Initial Stage (1711)", text: "Italian Bishop Fang Qisheng established the initial church as a local mission base." },
                { period: "2. Power Center Establishment (1844–1848)", text: "After the ban ended, Feng Shangren rebuilt St. Francis Cathedral on a grand scale." },
                { period: "3. Functional Expansion (from 1849)", text: "Gao Yizhi built the bishop's residence and theological seminary." },
                { period: "4. Social Services and Facility Completion (1862–1878)", text: "During the Hui Rebellion and the great drought, the church attracted many refugees." },
                { period: "5. Peak Period (late 19th century)", text: "Lin Qi'ai invited European nuns to China, and Tongyuanfang was known as 'Little Rome of the East'." }
              ]
            },
            {
              title: "II. City Wall Construction and the Formation of 'Fortification'",
              stages: [
                { period: "1. Social Crises in Tongzhi-Guangxu Period", text: "The Hui Rebellion in 1862 and the great drought in 1878 were direct causes of qualitative changes in Tongyuanfang's spatial form." },
                { period: "2. Dual Function of City Walls: Defense and Symbolism", text: "Records clearly document that Tongyuanfang built high city walls in the late 19th century." }
              ]
            }
          ]
        },
        reconstruction: {
          title: "Detail Changes After Reconstruction",
          changes: [
            { title: "1. Style Solidified as Mature Sino-Western Fusion", text: "Buildings generally adopt blue brick walls, Western arched doors and windows with pilasters." },
            { title: "2. Localization and Hybridization of Structural Technology", text: "The load-bearing system developed into a combination of blue brick thick walls and brick arches." },
            { title: "3. Floor Plans Reflect Function and Order", text: "Building floor plans clearly serve functions." },
            { title: "4. Interior and Exterior Decoration with Both Religious and Artistic Features", text: "Interior features painted murals, icon paintings, and carved stone column bases." }
          ]
        },
        monastery: {
          title: "Functional Spaces After Monastery Transformation (after 1933)",
          text: "After 1933, Tongyuanfang 'monastery transformation' formed a functionally complete closed community."
        }
      },
      elements: {
        timberStructure: {
          title: "Timber Frame/Tile Roof",
          sections: [
            {
              title: "I. Formal Level: Creating Western Liturgical Space",
              text: "Tongyuanfang's main cathedral employs classic architectural elements such as central axis symmetry, longitudinal space, arched doors and windows, pilaster segmentation, and vault space, aiming to create visual effects close to Baroque or Neoclassical styles, thereby satisfying the solemn ritual atmosphere and symbolic meaning required by Catholic liturgy."
            },
            {
              title: "II. Structural and Technical Level: Chinese Core, Western Surface",
              text: "The true core of Tongyuanfang's architecture is the traditional Chinese timber frame system, which actually bears all the building loads; while the Western elements in appearance, such as arches, pilasters, and vaults, mostly serve as non-load-bearing decorative components attached to the main structure, primarily playing roles in visual separation and spatial guidance. This separation between 'Western appearance' and 'Chinese structure' is precisely the key to its construction wisdom of 'form similar but reality different'."
            },
            {
              title: "III. Material and Construction Level: Complete Localization Translation",
              text: "The architecture widely adopts local timber, blue bricks, and tiles, completely abandoning dependence on Western stone; construction is completed by local craftsmen using traditional techniques, without introducing complex Western professional technology. This choice allows the architecture to better adapt to local climate conditions and gain local vitality that is easy to maintain and sustainably inherited."
            }
          ]
        },
        archStructure: {
          title: "Arched Doors and Windows/Arched Vaults",
          arches: {
            title: "I. Arched Doors and Windows: Western Form, Localized Construction",
            sections: [
              { title: "1. Diverse Forms, Clear Functions", text: "Mainly adopts semicircular arches and flat arches." },
              { title: "2. Local Materials and Construction Methods", text: "Arches are built with local blue bricks, not Western stone." },
              { title: "3. Combination with Chinese Elements", text: "Arches are often combined with brick pilasters protruding from walls." }
            ]
          },
          vaults: {
            title: "II. Arched Vaults: Structural Adaptation and Limited Use",
            sections: [
              { title: "1. As Main Structural System", text: "In the first floor of the orphanage, brick arches supported by brick columns are clearly used." },
              { title: "2. Key to Technology Fusion", text: "The connection and load transfer between brick arch structures and upper timber floors is a key technical point." }
            ]
          }
        },
        localization: {
          title: "Localized Construction Vocabulary of 'Form Similar but Reality Different'",
          text: "At the formal level, Tongyuanfang's main cathedral and auxiliary buildings create visual effects close to Baroque or Neoclassical churches through elements like central axis symmetry, longitudinal space, arched doors and windows, pilaster segmentation, and vault space."
        }
      }
    }
  };

  // 口述史（Voices）类别专用内容数据（3个分类）
  // 口述史内容：3个故事
  const voicesContent: Record<'CN' | 'EN', { title: string; stories: Array<{ content: string; audio: string }> }> = {
    CN: {
      title: "口述史",
      stories: [
        {
          content: '一、通远坊育婴堂曾收留数百名弃婴，孩子们亲切地称呼老修士们为"仨柴火老头子"。中外修女共同教导纺织、农耕与文化，堂内设有医院与学校，培养出如韩小道般的医生。1949年解散后，教会仍为适龄女子筹办婚事、置办嫁妆。如今教会重建，这里依旧是许多人心中的"娘家"。',
          audio: assetsConfig.voices.cn[0]
        },
        {
          content: '二、1966年，我们村中三次欲拆教堂，皆因突发冰雹暴雨而止，村民视之为天意。后得知县委书记之母幼年受育婴堂养育，为报恩情，书记于1974-1975年间筹资在教堂前建楼，将其隐蔽并改为仓库，亲自保管钥匙，使珍贵木结构得以保存。周围建筑多损毁，唯教堂幸免。',
          audio: assetsConfig.voices.cn[1]
        },
        {
          content: '三、我们这里的王学涛修女18岁入教会学医，虽无正规学历，却以简廉药物屡救危重，尤其孩童。她行医不问钱财，常接济贫困。动荡年间返乡为"草鞋医生"，有求必应；80年代应乡亲联名恳请回归，坚守小诊所至93岁。其仁心源于信仰，深受敬重。',
          audio: assetsConfig.voices.cn[2]
        }
      ]
    },
    EN: {
      title: "Oral History",
      stories: [
        {
          content: 'The Tongyuanfang Orphanage once took in hundreds of abandoned children, who affectionately called the elderly friars "the three old firewood men." Both foreign and local nuns taught weaving, farming, and literacy. The orphanage also housed a hospital and a school, nurturing medical professionals like Han Xiaodao. Although it disbanded in 1949, the church continued to arrange marriages and provide dowries for young women. Today, the rebuilt church remains a cherished "maternal home" in the hearts of many people.',
          audio: assetsConfig.voices.en[0]
        },
        {
          content: 'In 1966, three attempts were made to demolish the church in our village, but each was halted by sudden hailstorms and heavy rain. The villagers saw this as a sign from heaven. It was later learned that the mother of the county Party secretary had been raised in the orphanage as a child. Out of gratitude, the secretary raised funds between 1974 and 1975 to construct a building in front of the church, concealing it and converting it into a warehouse. He personally kept the keys, thereby preserving the precious wooden structure. While many surrounding buildings were destroyed, the church alone survived.',
          audio: assetsConfig.voices.en[1]
        },
        {
          content: 'Sister Wang Xuetao from our community entered the church at the age of 18 to study medicine. Though without formal qualifications, she repeatedly saved critically ill patients, especially children, using simple and affordable remedies. She never prioritized payment for her services and often aided the poor. During turbulent years, she returned to her hometown as a "folk doctor," responding to every call for help. In the 1980s, she heeded the villagers\' petition and returned, dedicating herself to a small clinic until the age of 93. Her compassion, rooted in faith, earned her deep respect.',
          audio: assetsConfig.voices.en[2]
        }
      ]
    }
  };

  // 四个标签页的完整内容数据
  const tabContentData: Record<'CN' | 'EN', Record<TabType, any>> = {
    CN: {
      overview: {
        stages: [
          { period: "1711–1845", text: "通远坊在清廷禁教背景下隐秘起步并逐步扎根，最终在政策松动中被确立为陕西教区的区域性行政核心。" },
          { period: "1845–1901", text: "通远坊依托社会危机实现快速扩张，通过营建与堡垒化发展，形成集宗教、行政与防御于一体的西北天主教中心。" },
          { period: "1902–1932", text: "在外部环境趋缓的同时，教会内部教权纷争加剧，通远坊维持多功能运作并最终失去总堂行政地位。" },
          { period: "1933–1952", text: "通远坊进入功能性会院阶段，在民族主义高涨与政治变革中完成由外籍主导向本土教会的历史转型。" }
        ]
      },
      events: {
        stageEvents: {
          title: "每阶段关键事件",
          events: [
            "1711 购地建堂",
            "禁教时期的隐秘存续",
            "1844 政策松动",
            "1845 确立总堂、创办男修道院"
          ]
        },
        special: {
          title: "重要转折专题：1900毁灭—辛丑条约后重建",
          text: "1900年前后，受义和团运动与反教浪潮影响，通远坊教堂及附属建筑遭到严重破坏，宗教活动一度中断。1901年《辛丑条约》签订后，清政府承认并保护教会财产，通远坊得以依托赔款与政策支持展开系统性重建。重建不仅恢复原有宗教功能，还通过扩建主教堂、主教府及修院，并修筑围墙，形成更具防御性的堡垒化格局，使通远坊在物质形态与教务地位上达到鼎盛，同时也加剧了其与地方社会之间的紧张关系。"
        },
        transfer: {
          title: "行政中心转移节点：1932总堂移至西安南堂",
          text: "1932年，在教权纷争加剧、交通与城市重心转移的背景下，梵蒂冈重新划分关中教区，将西北天主教总堂由通远坊迁至西安南堂，标志其区域性行政中心地位的终结。此后通远坊转为以修院、慈善与地方牧灵为主的功能性会院，完成由教务中枢向地方宗教社区核心的转型。"
        }
      },
      figures: {
        stage1: [
          { name: "方启升（1711年建堂；陕晋代牧主教）", text: "在清廷禁教背景下于通远购地建堂并长期坚持牧灵，使通远坊成为西北教区地下存续的核心据点。" },
          { name: "冯尚任（1845–1848，陕西教区首任主教）", text: "完成陕西教区行政独立，战略性选定通远坊为总堂并创办男修道院，奠定其西北总堂地位与本土化方向。" }
        ],
        stage2: [
          { name: "高一志（1849–1884，陕西主教）", text: "利用回民起义与大饥荒，通过赈灾、以工代赈和扩建教堂与城墙，推动通远坊快速扩张并完成堡垒化。" },
          { name: "林奇爱（1887–1901，陕西主教）", text: "完善主教府、城垣和慈善医疗体系，引入修女会，使通远坊发展为功能齐全、影响力达顶峰的\"东方小罗马\"。" }
        ],
        stage3: [
          { name: "希贤（1916–1928，陕西主教）", text: "在军阀混战中维系通远坊的社会庇护功能，并创建中国修女会，推动教会组织的初步本土化。" },
          { name: "戴夏德（1928–1932，陕西主教）", text: "引入发电机、无线电台和气象台，将通远坊塑造为西北科技与教育传播的重要节点，并为总堂迁移作准备。" }
        ],
        stage4: [
          { name: "班锡宜（1933–1952，三原监牧主教）", text: "在民族主义高涨与政治变革中执掌教区，其统治引发中外矛盾，最终以外籍神职人员被驱逐、教会全面本土化告终。" }
        ]
      },
      elements: {
        administrative: {
          title: "宗教行政地位变化",
          text: "通远坊始建于1711年，最初只是清代禁教背景下的地方性传教据点；1845年冯尚任被正式任命为陕西主教后，通远坊被确立为陕西乃至西北地区的天主教总堂，成为直接隶属罗马教廷的区域性宗教行政中枢；1900年后虽在战乱与重建中继续维持核心地位，但教权纷争与区域格局变化逐渐削弱其行政优势；1932年总堂正式迁至西安南堂，通远坊由最高行政中心转为三原教区下属的功能性会院，至1952年完成由外籍主导向本土管理的最终转型。"
        },
        architecture: {
          title: "建筑形态演变",
          text: "通远坊早期（18世纪—19世纪中叶）建筑形态以低调隐蔽为特征，主要为砖木结构的小型教堂与居住性建筑，顺应禁教环境，外观接近普通乡村聚落；1845年成为西北总堂后，建筑迅速扩展，主教堂、修院、修女院、育婴堂等相继兴建，形成以城垣环绕的封闭式组群，兼具宗教、行政与防御功能；20世纪初在维持总体格局的同时，内部功能趋于多元化，部分建筑引入西式空间与设施；1932年行政中心转移后，新建活动基本停止，建筑群逐步转向修道、慈善与公共使用，其形态以既有格局的延续与改造为主，成为今天所见的历史建筑形态。"
        },
        social: {
          title: "社会环境冲击",
          text: "通远坊三百余年的历史，始终处于中国社会剧烈变迁的冲击之下：它在清廷禁教的压抑中秘密萌芽，凭借不平等条约特权获得扩张机遇，更将回民起义、军阀混战中的暴力动荡转化为提供庇护、吸引信众的\"安全岛\"；它通过赈济特大饥荒吸纳了大量为求生计而\"吃教\"的民众，却也因此埋下社会矛盾；进入20世纪，它遭遇了民族主义觉醒带来的内外权力冲突，并在抗日战争中履行人道救援；新中国成立后，它经历了政治运动的压抑与建筑损毁，最终在当代工业化与城市化的包围中，面临传统信仰社区结构解体的新挑战。贯穿始终，通远坊的历史是一部在政治高压、社会失序、经济崩溃与文化冲突的夹缝中，不断将外部危机转化为内部生存与发展动力的适应性生存史。"
        }
      }
    },
    EN: {
      overview: {
        stages: [
          { period: "1711–1845", text: "Tongyuanfang started secretly and gradually rooted under the Qing Dynasty's ban on Christianity, eventually established as the regional administrative core of Shaanxi Diocese as policies relaxed." },
          { period: "1845–1901", text: "Tongyuanfang achieved rapid expansion through social crises, developing into a Northwestern Catholic center integrating religion, administration and defense through construction and fortification." },
          { period: "1902–1932", text: "While external conditions eased, internal church conflicts intensified, and Tongyuanfang maintained multi-functional operations but eventually lost its status as the general church administrative center." },
          { period: "1933–1952", text: "Tongyuanfang entered a functional monastery stage, completing the historical transformation from foreign-led to local church amidst rising nationalism and political changes." }
        ]
      },
      events: {
        stageEvents: {
          title: "Key Events by Stage",
          events: [
            "1711 Land purchase and church construction",
            "Secret survival during the ban on Christianity",
            "1844 Policy relaxation",
            "1845 Established as general church, founded male seminary"
          ]
        },
        special: {
          title: "Key Turning Point: 1900 Destruction and Post-Boxer Protocol Reconstruction",
          text: "Around 1900, affected by the Boxer Rebellion and anti-Christian movements, Tongyuanfang's church and affiliated buildings were severely damaged, and religious activities were interrupted. After the Boxer Protocol was signed in 1901, the Qing government recognized and protected church property, allowing Tongyuanfang to carry out systematic reconstruction with indemnity funds and policy support."
        },
        transfer: {
          title: "Administrative Center Transfer: 1932 General Church Moved to Xi'an South Church",
          text: "In 1932, amidst intensified church conflicts and shifts in transportation and urban centers, the Vatican reorganized the Guanzhong Diocese, moving the Northwestern Catholic General Church from Tongyuanfang to Xi'an South Church, marking the end of its regional administrative center status."
        }
      },
      figures: {
        stage1: [
          { name: "Fang Qisheng (Church founder in 1711; Shaanxi-Shanxi Apostolic Vicar)", text: "Purchased land and built the church in Tongyuan under the Qing Dynasty's ban on Christianity, making Tongyuanfang a core base for the underground survival of Northwestern Diocese." },
          { name: "Feng Shangren (1845–1848, First Bishop of Shaanxi Diocese)", text: "Completed the administrative independence of Shaanxi Diocese, strategically selected Tongyuanfang as the general church and founded the male seminary, establishing its status as Northwestern General Church and direction toward localization." }
        ],
        stage2: [
          { name: "Gao Yizhi (1849–1884, Bishop of Shaanxi)", text: "Utilized the Hui Rebellion and great famine, promoting rapid expansion and fortification of Tongyuanfang through disaster relief, work-for-relief, and expansion of church and city walls." },
          { name: "Lin Qi'ai (1887–1901, Bishop of Shaanxi)", text: "Perfected the bishop's residence, city walls and charitable medical system, introduced women's religious orders, developing Tongyuanfang into a fully functional \"Little Rome of the East\" with peak influence." }
        ],
        stage3: [
          { name: "Xi Xian (1916–1928, Bishop of Shaanxi)", text: "Maintained Tongyuanfang's social shelter function during warlord conflicts, and created Chinese women's religious orders, promoting the initial localization of church organization." },
          { name: "Dai Xiade (1928–1932, Bishop of Shaanxi)", text: "Introduced generators, wireless radio and weather stations, shaping Tongyuanfang as an important node for Northwestern technology and education dissemination, and preparing for the general church transfer." }
        ],
        stage4: [
          { name: "Ban Xiyi (1933–1952, Apostolic Prefect of Sanyuan)", text: "Led the diocese amidst rising nationalism and political changes, his rule triggered Sino-foreign conflicts, ultimately ending with the expulsion of foreign clergy and complete localization of the church." }
        ]
      },
      elements: {
        administrative: {
          title: "Religious Administrative Status Changes",
          text: "Tongyuanfang was founded in 1711, initially just a local missionary base under the Qing Dynasty's ban on Christianity. After Feng Shangren was officially appointed Bishop of Shaanxi in 1845, Tongyuanfang was established as the Catholic General Church of Shaanxi and Northwest China, becoming a regional religious administrative center directly subordinate to the Holy See."
        },
        architecture: {
          title: "Architectural Form Evolution",
          text: "Tongyuanfang's early architecture (18th century to mid-19th century) was characterized by low-profile concealment, mainly small brick-wood churches and residential buildings, conforming to the ban environment and appearing similar to ordinary rural settlements."
        },
        social: {
          title: "Social Environment Impact",
          text: "Tongyuanfang's three-hundred-year history has always been under the impact of China's dramatic social changes: it secretly sprouted under the Qing Dynasty's ban on Christianity, gained expansion opportunities through unequal treaty privileges, and transformed violent turmoil from the Hui Rebellion and warlord conflicts into a \"safe haven\" providing shelter and attracting believers."
        }
      }
    }
  };

  const renderTabContent = () => {
    // Overview 页面显示三个分类（项目概览、阅读指引、基本信息）
    if (category === 'overview') {
      return renderOverviewContent();
    }
    
    // Architecture 页面显示建筑专用内容
    if (category === 'architecture') {
      const archContent = architectureContent[language];
      
      if (activeTab === 'overview') {
        // 类别一：建筑群概览
        return (
          <div className="overview-content">
            <div className="subsection">
              <h4 className="subsection-title">{archContent.overview.overallLayout.title}</h4>
              <p className="subsection-text">{archContent.overview.overallLayout.text}</p>
            </div>
            <div className="subsection">
              <h4 className="subsection-title">{archContent.overview.fourBuildings.title}</h4>
              <div className="value-list">
                {archContent.overview.fourBuildings.buildings.map((building: any, index: number) => (
                  <div key={index} className="value-item">
                    <h5 className="value-title">{building.title}</h5>
                    <p className="value-text">{building.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      
      if (activeTab === 'events') {
        // 类别二：单体建筑详情
        const eventsContent = archContent.events;
        return (
          <div className="events-content">
            <div className="subsection">
              <div className="subsection">
                <h5 className="subsection-title">{eventsContent.cathedral.overview.title}</h5>
                <p className="subsection-text">{eventsContent.cathedral.overview.text}</p>
              </div>
              <div className="subsection">
                <h5 className="subsection-title">{eventsContent.cathedral.function.title}</h5>
                <p className="subsection-text">{eventsContent.cathedral.function.text}</p>
              </div>
              <div className="subsection">
                <h5 className="subsection-title">{eventsContent.cathedral.timeline.title}</h5>
                <p className="subsection-text">{eventsContent.cathedral.timeline.text}</p>
              </div>
            </div>
            <div className="subsection">
              <div className="subsection">
                <h5 className="subsection-title">{eventsContent.seminary.overview.title}</h5>
                <p className="subsection-text">{eventsContent.seminary.overview.text}</p>
              </div>
              <div className="subsection">
                <h5 className="subsection-title">{eventsContent.seminary.function.title}</h5>
                <p className="subsection-text">{eventsContent.seminary.function.text}</p>
              </div>
              <div className="subsection">
                <h5 className="subsection-title">{eventsContent.seminary.timeline.title}</h5>
                <p className="subsection-text">{eventsContent.seminary.timeline.text}</p>
              </div>
            </div>
            <div className="subsection">
              <div className="subsection">
                <h5 className="subsection-title">{eventsContent.convent.overview.title}</h5>
                <p className="subsection-text">{eventsContent.convent.overview.text}</p>
              </div>
              <div className="subsection">
                <h5 className="subsection-title">{eventsContent.convent.function.title}</h5>
                <p className="subsection-text">{eventsContent.convent.function.text}</p>
              </div>
              <div className="subsection">
                <h5 className="subsection-title">{eventsContent.convent.timeline.title}</h5>
                <p className="subsection-text">{eventsContent.convent.timeline.text}</p>
              </div>
            </div>
            <div className="subsection">
              <div className="subsection">
                <h5 className="subsection-title">{eventsContent.orphanage.overview.title}</h5>
                <p className="subsection-text">{eventsContent.orphanage.overview.text}</p>
              </div>
              <div className="subsection">
                <h5 className="subsection-title">{eventsContent.orphanage.function.title}</h5>
                <p className="subsection-text">{eventsContent.orphanage.function.text}</p>
              </div>
              <div className="subsection">
                <h5 className="subsection-title">{eventsContent.orphanage.timeline.title}</h5>
                <p className="subsection-text">{eventsContent.orphanage.timeline.text}</p>
              </div>
            </div>
          </div>
        );
      }
      
      if (activeTab === 'figures') {
        // 类别三：建筑形态与阶段变化
        const figuresContent = archContent.figures;
        return (
          <div className="figures-content">
            <div className="subsection">
              <h4 className="subsection-title">{figuresContent.expansion.title}</h4>
              {figuresContent.expansion.sections.map((section: any, index: number) => (
                <div key={index} className="subsection">
                  <h5 className="subsection-title">{section.title}</h5>
                  {section.stages && section.stages.map((stage: any, stageIndex: number) => (
                    <div key={stageIndex} className="stage-item">
                      <h6 className="stage-period">{stage.period}</h6>
                      <p className="stage-text">{stage.text}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="subsection">
              <h4 className="subsection-title">{figuresContent.reconstruction.title}</h4>
              {figuresContent.reconstruction.changes.map((change: any, index: number) => (
                <div key={index} className="subsection">
                  <h5 className="subsection-title">{change.title}</h5>
                  <p className="subsection-text">{change.text}</p>
                </div>
              ))}
            </div>
            <div className="subsection">
              <h4 className="subsection-title">{figuresContent.monastery.title}</h4>
              <p className="subsection-text">{figuresContent.monastery.text}</p>
            </div>
          </div>
        );
      }
      
      if (activeTab === 'elements') {
        // 类别四：营造技艺
        const elementsContent = archContent.elements;
        return (
          <div className="elements-content">
            <div className="subsection">
              <h4 className="subsection-title">{elementsContent.timberStructure.title}</h4>
              {elementsContent.timberStructure.sections.map((section: any, index: number) => (
                <div key={index} className="subsection">
                  <h5 className="subsection-title">{section.title}</h5>
                  <p className="subsection-text">{section.text}</p>
                </div>
              ))}
            </div>
            <div className="subsection">
              <h4 className="subsection-title">{elementsContent.archStructure.title}</h4>
              <div className="subsection">
                <h5 className="subsection-title">{elementsContent.archStructure.arches.title}</h5>
                {elementsContent.archStructure.arches.sections.map((section: any, index: number) => (
                  <div key={index} className="subsection">
                    <h6 className="subsection-title">{section.title}</h6>
                    <p className="subsection-text">{section.text}</p>
                  </div>
                ))}
              </div>
              <div className="subsection">
                <h5 className="subsection-title">{elementsContent.archStructure.vaults.title}</h5>
                {elementsContent.archStructure.vaults.sections.map((section: any, index: number) => (
                  <div key={index} className="subsection">
                    <h6 className="subsection-title">{section.title}</h6>
                    <p className="subsection-text">{section.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="subsection">
              <h4 className="subsection-title">{elementsContent.localization.title}</h4>
              <p className="subsection-text">{elementsContent.localization.text}</p>
            </div>
          </div>
        );
      }
      
      return null;
    }
    
    // Voices 页面显示口述史内容（无标签页）
    if (category === 'voices') {
      const voicesData = voicesContent[language];
      
      const handlePlayPause = (index: number) => {
        const currentAudioPath = voicesData.stories[index].audio;
        let audio = audioRefs.current[index];
        const storedLanguage = audioLanguageRefs.current[index];
        
        // 如果audio不存在，或者存储的语言与当前语言不匹配，重新创建
        if (!audio || storedLanguage !== language) {
          // 先停止并清理旧的audio（如果存在）
          if (audio) {
            audio.pause();
            audio.currentTime = 0;
          }
          
          // 创建新的audio对象
          audio = new Audio(currentAudioPath);
          audioRefs.current[index] = audio;
          audioLanguageRefs.current[index] = language;
          
          audio.addEventListener('ended', () => {
            setPlayingIndex(null);
          });
          
          audio.addEventListener('error', () => {
            setPlayingIndex(null);
            console.error('Audio playback failed');
          });
        }
        
        // 停止所有正在播放的音频（包括当前index的音频，如果正在播放）
        audioRefs.current.forEach((ref, i) => {
          if (ref && !ref.paused) {
            ref.pause();
            ref.currentTime = 0;
          }
        });
        
        // 如果当前点击的是正在播放的音频，则暂停
        if (playingIndex === index && !audio.paused) {
          audio.pause();
          setPlayingIndex(null);
        } else {
          // 播放当前音频
          audio.play();
          setPlayingIndex(index);
        }
      };
      
      return (
        <div className="voices-content">
          <div className="subsection">
            <h4 className="subsection-title">{voicesData.title}</h4>
            {voicesData.stories.map((story, index) => (
              <div key={index} className="voice-story-item">
                <div className="voice-story-content">
                  <p className="voice-story-text">{story.content}</p>
                </div>
                <button 
                  className="voice-play-button"
                  onClick={() => handlePlayPause(index)}
                >
                  <img 
                    src={playingIndex === index ? assetsConfig.voices.playing : assetsConfig.voices.muted}
                    alt={playingIndex === index ? 'Playing' : 'Muted'}
                    className="voice-play-icon"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // History 页面显示四个标签（使用通用的 tabContentData）
    if (activeTab === 'overview') {
      const content = tabContentData[language].overview;
      return (
        <div className="overview-content">
          <div className="stages-list">
            {content.stages.map((stage, index) => (
              <div key={index} className="stage-item">
                <h4 className="stage-period">{stage.period}</h4>
                <p className="stage-text">{stage.text}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (activeTab === 'events') {
      const content = tabContentData[language].events;
      return (
        <div className="events-content">
          <div className="subsection">
            <h4 className="subsection-title">{content.stageEvents.title}</h4>
            <ul className="events-list">
              {content.stageEvents.events.map((event, index) => (
                <li key={index} className="event-item">{index + 1}. {event}</li>
              ))}
            </ul>
          </div>
          <div className="subsection">
            <h4 className="subsection-title">{content.special.title}</h4>
            <p className="subsection-text">{content.special.text}</p>
          </div>
          <div className="subsection">
            <h4 className="subsection-title">{content.transfer.title}</h4>
            <p className="subsection-text">{content.transfer.text}</p>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'figures') {
      const content = tabContentData[language].figures;
      return (
        <div className="figures-content">
          <div className="subsection">
            <h4 className="subsection-title">{language === 'CN' ? '第一阶段（1711–1845）' : 'Stage 1 (1711–1845)'}</h4>
            {content.stage1.map((figure, index) => (
              <div key={index} className="figure-item">
                <h5 className="figure-name">{figure.name}</h5>
                <p className="figure-text">{figure.text}</p>
              </div>
            ))}
          </div>
          <div className="subsection">
            <h4 className="subsection-title">{language === 'CN' ? '第二阶段（1845–1901）' : 'Stage 2 (1845–1901)'}</h4>
            {content.stage2.map((figure, index) => (
              <div key={index} className="figure-item">
                <h5 className="figure-name">{figure.name}</h5>
                <p className="figure-text">{figure.text}</p>
              </div>
            ))}
          </div>
          <div className="subsection">
            <h4 className="subsection-title">{language === 'CN' ? '第三阶段（1902–1932）' : 'Stage 3 (1902–1932)'}</h4>
            {content.stage3.map((figure, index) => (
              <div key={index} className="figure-item">
                <h5 className="figure-name">{figure.name}</h5>
                <p className="figure-text">{figure.text}</p>
              </div>
            ))}
          </div>
          <div className="subsection">
            <h4 className="subsection-title">{language === 'CN' ? '第四阶段（1933–1952）' : 'Stage 4 (1933–1952)'}</h4>
            {content.stage4.map((figure, index) => (
              <div key={index} className="figure-item">
                <h5 className="figure-name">{figure.name}</h5>
                <p className="figure-text">{figure.text}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (activeTab === 'elements') {
      const content = tabContentData[language].elements;
      return (
        <div className="elements-content">
          <div className="subsection">
            <h4 className="subsection-title">{content.administrative.title}</h4>
            <p className="subsection-text">{content.administrative.text}</p>
          </div>
          <div className="subsection">
            <h4 className="subsection-title">{content.architecture.title}</h4>
            <p className="subsection-text">{content.architecture.text}</p>
          </div>
          <div className="subsection">
            <h4 className="subsection-title">{content.social.title}</h4>
            <p className="subsection-text">{content.social.text}</p>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="detail-back-button" onClick={handleBack}>
          <img src={assetsConfig.icons.back} alt="Back" />
        </button>
        <h2 className="detail-title">{pageTitle}</h2>
        <LanguageSwitch />
      </div>

      <div className="detail-carousel">
        {category === 'history' ? (
          <Carousel images={[assetsConfig.detail.historyImage, assetsConfig.detail.otherImage]} />
        ) : category === 'architecture' ? (
          <Carousel images={assetsConfig.detail.architectureImages} />
        ) : (
          <img 
            src={
              category === 'overview' 
                ? assetsConfig.detail.mainImage 
                : assetsConfig.detail.otherImage
            } 
            alt={category === 'overview' ? 'Church' : 'Detail'} 
            className="detail-main-image" 
          />
        )}
      </div>

      {category !== 'overview' && category !== 'voices' && (
        <div className="detail-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`detail-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {labels[tab]}
            </button>
          ))}
        </div>
      )}

      <div className="detail-content">
        {renderTabContent()}
      </div>

      <div className="detail-actions">
        <BreathingAnimation>
          <button className="detail-chat-button" onClick={handleEnterChat}>
            <img src={assetsConfig.icons.chat} alt="Chat" className="detail-chat-icon" />
            <span className="detail-chat-text">
              {language === 'CN' ? '和我聊天' : 'Chat With me'}
            </span>
          </button>
        </BreathingAnimation>
      </div>
    </div>
  );
};
