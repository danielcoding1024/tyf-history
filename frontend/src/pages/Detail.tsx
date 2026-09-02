import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useLanguageStore } from '../store/languageStore';
import { assetsConfig, getOverviewPdfPath } from '../config/assets.config';
import {
  architectureStages,
  historicalEvents,
  historicalFigures,
  historyStages,
  overviewContent,
  siteCopy,
  type Language,
} from '../config/detail-content.config';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { Carousel } from '../components/Carousel';
import './Detail.css';

type TabType = 'overview' | 'events' | 'figures' | 'elements';

const validCategories = ['overview', 'history', 'architecture', 'voices'] as const;
type DetailCategory = (typeof validCategories)[number];

const isDetailCategory = (value: string): value is DetailCategory =>
  validCategories.includes(value as DetailCategory);

interface TabLabel {
  short: string;
  full: string;
}

const tabLabels: Record<'CN' | 'EN', Record<TabType, TabLabel>> = {
  CN: {
    overview: { short: '概览', full: '历史概述' },
    events: { short: '事件', full: '关键事件' },
    figures: { short: '人物', full: '关键人物' },
    elements: { short: '要素', full: '三要素脉络' },
  },
  EN: {
    overview: { short: 'Overview', full: 'History overview' },
    events: { short: 'Events', full: 'Key events' },
    figures: { short: 'Figures', full: 'Key figures' },
    elements: { short: 'Elements', full: 'Three elements' },
  },
};

// 建筑类别的专用标签
const architectureTabLabels: Record<'CN' | 'EN', Record<TabType, TabLabel>> = {
  CN: {
    overview: { short: '概览', full: '建筑群概览' },
    events: { short: '详情', full: '建筑详情' },
    figures: { short: '形态', full: '建筑形态' },
    elements: { short: '融合', full: '中西融合' },
  },
  EN: {
    overview: { short: 'Overview', full: 'Building overview' },
    events: { short: 'Details', full: 'Building details' },
    figures: { short: 'Forms', full: 'Architectural forms' },
    elements: { short: 'Fusion', full: 'Sino-Western fusion' },
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

interface VoicesPanelProps {
  language: Language;
  title: string;
  stories: Array<{ content: string; audio: string }>;
}

type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'ended';

const formatPlaybackTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const VoicesPanel: React.FC<VoicesPanelProps> = ({ language, title, stories }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const removeAudioListenersRef = useRef<(() => void) | null>(null);

  useEffect(() => () => {
    removeAudioListenersRef.current?.();
    audioRef.current?.pause();
  }, []);

  const handlePlayPause = (index: number) => {
    const currentAudio = audioRef.current;

    if (activeIndex === index && currentAudio) {
      if (playbackStatus === 'playing') {
        currentAudio.pause();
        setPlaybackStatus('paused');
        return;
      }

      if (playbackStatus === 'ended') {
        currentAudio.currentTime = 0;
        setCurrentTime(0);
      }

      void currentAudio.play().catch(() => setPlaybackStatus('idle'));
      return;
    }

    if (currentAudio) {
      removeAudioListenersRef.current?.();
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const nextAudio = new Audio(stories[index].audio);
    const updateDuration = () => setDuration(nextAudio.duration);
    const updateCurrentTime = () => setCurrentTime(nextAudio.currentTime);
    const markPlaying = () => setPlaybackStatus('playing');
    const markPaused = () => {
      if (!nextAudio.ended) setPlaybackStatus('paused');
    };
    const markEnded = () => {
      setPlaybackStatus('ended');
      setCurrentTime(nextAudio.duration || nextAudio.currentTime);
    };
    const markError = () => setPlaybackStatus('idle');

    nextAudio.addEventListener('loadedmetadata', updateDuration);
    nextAudio.addEventListener('durationchange', updateDuration);
    nextAudio.addEventListener('timeupdate', updateCurrentTime);
    nextAudio.addEventListener('play', markPlaying);
    nextAudio.addEventListener('pause', markPaused);
    nextAudio.addEventListener('ended', markEnded);
    nextAudio.addEventListener('error', markError);
    removeAudioListenersRef.current = () => {
      nextAudio.removeEventListener('loadedmetadata', updateDuration);
      nextAudio.removeEventListener('durationchange', updateDuration);
      nextAudio.removeEventListener('timeupdate', updateCurrentTime);
      nextAudio.removeEventListener('play', markPlaying);
      nextAudio.removeEventListener('pause', markPaused);
      nextAudio.removeEventListener('ended', markEnded);
      nextAudio.removeEventListener('error', markError);
    };

    audioRef.current = nextAudio;
    setActiveIndex(index);
    setCurrentTime(0);
    setDuration(0);
    setPlaybackStatus('idle');
    void nextAudio.play().catch(() => setPlaybackStatus('idle'));
  };

  const getPlaybackLabel = (index: number) => {
    if (activeIndex === index && playbackStatus === 'playing') {
      return language === 'CN' ? '暂停播放' : 'Pause playback';
    }
    if (activeIndex === index && playbackStatus === 'paused') {
      return language === 'CN' ? '继续播放' : 'Resume playback';
    }
    return language === 'CN' ? '播放口述' : 'Play oral history';
  };

  return (
    <div className="voices-content">
      <div className="subsection">
        <h2 className="subsection-title">{title}</h2>
        {stories.map((story, index) => {
          const isActive = activeIndex === index;
          const isPlaying = isActive && playbackStatus === 'playing';

          return (
            <article key={story.content.slice(0, 24)} className="voice-story-item">
              <div className="voice-story-content">
                <p className="voice-story-text">{story.content}</p>
              </div>
              <button
                type="button"
                className="voice-play-button"
                onClick={() => handlePlayPause(index)}
                aria-pressed={isPlaying}
                aria-label={getPlaybackLabel(index)}
              >
                <svg className="voice-play-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  {isPlaying ? (
                    <path d="M7 5h3v14H7zm7 0h3v14h-3z" />
                  ) : (
                    <path d="M8 5.7v12.6c0 .8.9 1.3 1.6.8l9-6.3c.6-.4.6-1.2 0-1.6l-9-6.3C8.9 4.4 8 4.9 8 5.7Z" />
                  )}
                </svg>
                <span className="voice-play-label">{getPlaybackLabel(index)}</span>
              </button>
              {isActive && (
                <p className="voice-playback-time" aria-live="polite">
                  {formatPlaybackTime(currentTime)} / {formatPlaybackTime(duration)}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};


export const Detail: React.FC = () => {
  const navigate = useNavigate();
  const { category = 'overview' } = useParams<{ category: string }>();
  const { language } = useLanguageStore();
  const [tabSelection, setTabSelection] = useState<{ category: string; tab: TabType }>({
    category,
    tab: 'overview',
  });
  const activeTab = tabSelection.category === category ? tabSelection.tab : 'overview';

  if (!isDetailCategory(category)) {
    return <Navigate to="/detail/overview" replace />;
  }

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

  const renderOverviewContent = () => {
    const content = overviewContent[language];

    return (
      <div className="overview-content">
        <div className="ebook-button-container">
          <a
            href={getOverviewPdfPath(language)}
            target="_blank"
            rel="noreferrer"
            className="ebook-button"
          >
            <span className="ebook-marker" aria-hidden="true">PDF</span>
            <span className="ebook-text">{siteCopy[language].readOverview}</span>
            <span className="ebook-meta">{language === 'CN' ? 'PDF · 新标签页打开' : 'PDF · Opens in a new tab'}</span>
          </a>
        </div>

        <section className="overview-section">
          <p className="section-kicker">{language === 'CN' ? '项目概览' : 'PROJECT OVERVIEW'}</p>
          <h3 className="section-title">{language === 'CN' ? '通远坊是什么' : 'What is Tongyuan Ward?'}</h3>
          <p className="subsection-text overview-lead">{content.what}</p>

          <div className="subsection">
            <h4 className="subsection-title">{content.whyImportant.title}</h4>
            <div className="value-list">
              {content.whyImportant.values.map((value) => (
                <article key={value.title} className="value-item">
                  <h5 className="value-title">{value.title}</h5>
                  <p className="value-text">{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="overview-section">
          <h3 className="section-title">{content.readingGuide.title}</h3>
          <div className="section-list">
            {content.readingGuide.sections.map((section, index) => (
              <article key={section.title} className="section-item">
                <span className="section-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h4 className="section-name">{section.title}</h4>
                  <p className="section-desc">{section.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="overview-section">
          <h3 className="section-title">{language === 'CN' ? '基本信息' : 'Basic Information'}</h3>
          <div className="basic-info-grid">
            <article className="subsection">
              <h4 className="subsection-title">{language === 'CN' ? '地理位置 / 现状' : 'Location / Status'}</h4>
              <p className="subsection-text">{content.basicInfo.location}</p>
            </article>
            <article className="subsection">
              <h4 className="subsection-title">{language === 'CN' ? '文保信息' : 'Protection Status'}</h4>
              <p className="subsection-text">{content.basicInfo.protection}</p>
            </article>
          </div>
        </section>
      </div>
    );
  };

  // 建筑类别专用内容数据（4个分类）
  const architectureContent = {
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
            text: "其最初形态可追溯至1716年方启升购地建堂；19世纪中叶冯尚任确立通远坊为总堂后持续使用；1875年在高一志与林奇爱时期扩建为规模宏大的砖木结构大教堂，形成可容纳约2000人礼拜的主体格局；1900年前后虽经历破坏，但在辛丑条约后得以修复并延续至今，成为通远坊历史连续性的关键见证。"
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
          timeline: { title: "Timeline", text: "Its initial form can be traced back to 1716 when Fang Qisheng purchased land and built the church." }
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

  const historyElementsContent = {
    CN: {
      administrative: {
        title: '宗教行政地位变化',
        text: '通远坊始建于1711年，最初只是清代禁教背景下的地方性传教据点；1845年冯尚任被正式任命为陕西主教后，通远坊被确立为陕西乃至西北地区的天主教总堂，成为直接隶属罗马教廷的区域性宗教行政中枢；1900年后虽在战乱与重建中继续维持核心地位，但教权纷争与区域格局变化逐渐削弱其行政优势；1932年总堂正式迁至西安南堂，通远坊由最高行政中心转为三原教区下属的功能性会院，至1952年完成由外籍主导向本土管理的最终转型。',
      },
      architecture: {
        title: '建筑形态演变',
        text: '通远坊早期（18世纪—19世纪中叶）建筑形态以低调隐蔽为特征，主要为砖木结构的小型教堂与居住性建筑，顺应禁教环境，外观接近普通乡村聚落；1845年成为西北总堂后，建筑迅速扩展，主教堂、修院、修女院、育婴堂等相继兴建，形成以城垣环绕的封闭式组群，兼具宗教、行政与防御功能；20世纪初在维持总体格局的同时，内部功能趋于多元化，部分建筑引入西式空间与设施；1932年行政中心转移后，新建活动基本停止，建筑群逐步转向修道、慈善与公共使用，其形态以既有格局的延续与改造为主，成为今天所见的历史建筑形态。',
      },
      social: {
        title: '社会环境冲击',
        text: '通远坊三百余年的历史，始终处于中国社会剧烈变迁的冲击之下：它在清廷禁教的压抑中秘密萌芽，凭借不平等条约特权获得扩张机遇，更将回民起义、军阀混战中的暴力动荡转化为提供庇护、吸引信众的“安全岛”；它通过赈济特大饥荒吸纳了大量为求生计而“吃教”的民众，却也因此埋下社会矛盾；进入20世纪，它遭遇了民族主义觉醒带来的内外权力冲突，并在抗日战争中履行人道救援；新中国成立后，它经历了政治运动的压抑与建筑损毁，最终在当代工业化与城市化的包围中，面临传统信仰社区结构解体的新挑战。贯穿始终，通远坊的历史是一部在政治高压、社会失序、经济崩溃与文化冲突的夹缝中，不断将外部危机转化为内部生存与发展动力的适应性生存史。',
      },
    },
    EN: {
      administrative: {
        title: 'Religious Administrative Status Changes',
        text: `Tongyuanfang was founded in 1711, initially just a local missionary base under the Qing Dynasty's ban on Christianity. After Feng Shangren was officially appointed Bishop of Shaanxi in 1845, Tongyuanfang was established as the Catholic General Church of Shaanxi and Northwest China, becoming a regional religious administrative center directly subordinate to the Holy See.`,
      },
      architecture: {
        title: 'Architectural Form Evolution',
        text: `Tongyuanfang's early architecture (18th century to mid-19th century) was characterized by low-profile concealment, mainly small brick-wood churches and residential buildings, conforming to the ban environment and appearing similar to ordinary rural settlements.`,
      },
      social: {
        title: 'Social Environment Impact',
        text: `Tongyuanfang's three-hundred-year history has always been under the impact of China's dramatic social changes: it secretly sprouted under the Qing Dynasty's ban on Christianity, gained expansion opportunities through unequal treaty privileges, and transformed violent turmoil from the Hui Rebellion and warlord conflicts into a "safe haven" providing shelter and attracting believers.`,
      },
    },
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
                {archContent.overview.fourBuildings.buildings.map((building) => (
                  <div key={building.title} className="value-item">
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
            <div className="archive-timeline architecture-stage-list">
              {architectureStages[language].map((stage) => (
                <article key={stage.code} className="archive-stage-card">
                  <p className="archive-stage-period">{stage.code} · {stage.period}</p>
                  <h3 className="archive-stage-feature">{stage.title}</h3>
                  <p className="archive-stage-details">{stage.text}</p>
                </article>
              ))}
            </div>
            <div className="subsection">
              <h4 className="subsection-title">{figuresContent.reconstruction.title}</h4>
              {figuresContent.reconstruction.changes.map((change) => (
                <div key={change.title} className="subsection">
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
              {elementsContent.timberStructure.sections.map((section) => (
                <div key={section.title} className="subsection">
                  <h5 className="subsection-title">{section.title}</h5>
                  <p className="subsection-text">{section.text}</p>
                </div>
              ))}
            </div>
            <div className="subsection">
              <h4 className="subsection-title">{elementsContent.archStructure.title}</h4>
              <div className="subsection">
                <h5 className="subsection-title">{elementsContent.archStructure.arches.title}</h5>
                {elementsContent.archStructure.arches.sections.map((section) => (
                  <div key={section.title} className="subsection">
                    <h6 className="subsection-title">{section.title}</h6>
                    <p className="subsection-text">{section.text}</p>
                  </div>
                ))}
              </div>
              <div className="subsection">
                <h5 className="subsection-title">{elementsContent.archStructure.vaults.title}</h5>
                {elementsContent.archStructure.vaults.sections.map((section) => (
                  <div key={section.title} className="subsection">
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
      return (
        <VoicesPanel
          key={language}
          language={language}
          title={voicesData.title}
          stories={voicesData.stories}
        />
      );
    }

    if (activeTab === 'overview') {
      return (
        <div className="archive-timeline">
          {historyStages[language].map((stage) => (
            <article key={stage.period} className="archive-stage-card">
              <p className="archive-stage-period">{stage.period}</p>
              <h3 className="archive-stage-feature">{stage.feature}</h3>
              <p className="archive-stage-details">{stage.details}</p>
            </article>
          ))}
        </div>
      );
    }

    if (activeTab === 'events') {
      return (
        <div className="events-content archive-card-list">
          {historicalEvents[language].map((event) => (
            <article key={`${event.period ?? ''}-${event.title}`} className="event-card">
              {event.period && <p className="event-period">{event.period}</p>}
              <h3 className="event-title">{event.title}</h3>
              <p className="event-text">{event.text}</p>
            </article>
          ))}
        </div>
      );
    }

    if (activeTab === 'figures') {
      return (
        <div className="figures-content archive-card-list">
          {historicalFigures[language].map((figure) => (
            <article key={`${figure.name}-${figure.years ?? ''}`} className="figure-card">
              <div className="figure-heading">
                <h3 className="figure-name">{figure.name}</h3>
                {figure.latinName && <p className="figure-latin-name">{figure.latinName}</p>}
              </div>
              {figure.years && <p className="figure-years">{figure.years}</p>}
              <p className="figure-text">{figure.description}</p>
            </article>
          ))}
        </div>
      );
    }

    if (activeTab === 'elements') {
      const content = historyElementsContent[language];
      return (
        <div className="elements-content archive-card-list">
          {Object.values(content).map((element) => (
            <article key={element.title} className="subsection">
              <h3 className="subsection-title">{element.title}</h3>
              <p className="subsection-text">{element.text}</p>
            </article>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="detail-page">
      <header className="detail-header">
        <button
          type="button"
          className="detail-back-button"
          onClick={handleBack}
          aria-label={language === 'CN' ? '返回首页' : 'Back to home'}
        >
          <img src={assetsConfig.icons.back} alt="" aria-hidden="true" />
        </button>
        <h1 className="detail-title">{pageTitle}</h1>
        <LanguageSwitch />
      </header>

      <div className="detail-scroll-content">
        <div className="detail-carousel">
          {category === 'overview' ? (
            <Carousel images={assetsConfig.detail.overviewImages} language={language} />
          ) : category === 'history' ? (
            <Carousel images={assetsConfig.detail.historyImages} language={language} />
          ) : category === 'architecture' ? (
            <Carousel images={assetsConfig.detail.architectureImages} language={language} />
          ) : (
            <img
              src={assetsConfig.detail.otherImage}
              alt={language === 'CN' ? '通远坊口述历史资料' : 'Tongyuan Ward oral history archive'}
              className="detail-main-image"
            />
          )}
        </div>

        {category !== 'overview' && category !== 'voices' && (
          <div className="detail-tabs" role="tablist" aria-label={pageTitle}>
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                className={`detail-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setTabSelection({ category, tab })}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls="detail-tab-panel"
                aria-label={labels[tab].full}
                title={labels[tab].full}
              >
                {labels[tab].short}
              </button>
            ))}
          </div>
        )}

        <main
          id="detail-tab-panel"
          className="detail-content"
          role={category !== 'overview' && category !== 'voices' ? 'tabpanel' : undefined}
        >
          {renderTabContent()}
        </main>
      </div>

      <div className="detail-actions">
        <button type="button" className="detail-chat-button" onClick={handleEnterChat}>
          <img src={assetsConfig.icons.chat} alt="" aria-hidden="true" className="detail-chat-icon" />
          <span className="detail-chat-text">
            {siteCopy[language].chatWithMe}
          </span>
        </button>
      </div>
    </div>
  );
};
