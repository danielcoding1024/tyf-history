export type Language = 'CN' | 'EN';

export interface HistoricalStage {
  period: string;
  feature: string;
  details: string;
}

export interface HistoricalEvent {
  title: string;
  period?: string;
  text: string;
}

export interface HistoricalFigure {
  name: string;
  latinName?: string;
  years?: string;
  description: string;
}

export interface ArchitectureStage {
  code: string;
  title: string;
  period: string;
  text: string;
}

export interface SiteCopy {
  reportTitle: string;
  readOverview: string;
  chatTitle: string;
  chatGreeting: string;
  chatPlaceholder: string;
  send: string;
  suggestedQuestions: string;
  chatWithMe: string;
}

export interface OverviewContent {
  what: string;
  whyImportant: {
    title: string;
    values: Array<{ title: string; text: string }>;
  };
  readingGuide: {
    title: string;
    sections: Array<{ title: string; text: string }>;
  };
  basicInfo: {
    location: string;
    protection: string;
  };
}

export const siteCopy: Record<Language, SiteCopy> = {
  CN: {
    reportTitle: '通远坊的历史和建筑',
    readOverview: '阅读通远坊概述',
    chatTitle: '数字历史向导',
    chatGreeting: '你好，我是通远坊数字历史向导。你想了解什么？',
    chatPlaceholder: '输入你的问题…',
    send: '发送',
    suggestedQuestions: '你可能想问',
    chatWithMe: '和我聊聊通远坊',
  },
  EN: {
    reportTitle: 'History and Architecture of Tongyuan Ward',
    readOverview: 'Read the Tongyuan Ward overview',
    chatTitle: 'Digital History Guide',
    chatGreeting: 'Hello, I am your Tongyuan Ward digital history guide. What would you like to know?',
    chatPlaceholder: 'Ask about Tongyuan Ward…',
    send: 'Send',
    suggestedQuestions: 'You may want to ask',
    chatWithMe: 'Ask about Tongyuan Ward',
  },
};

export const overviewContent: Record<Language, OverviewContent> = {
  CN: {
    what: `通远坊是位于陕西西安高陵的一个以天主教主教座堂为核心形成的历史性宗教社区，始建于清康熙五十五年（1716年），19世纪中叶起成为天主教陕西宗座代牧区乃至整个中国西北地区的最高教务行政与传教中心，被称为“陕西总堂”。它不仅承担宗教礼仪功能，还集主教驻地、修道院、神学院、育婴堂和慈善医疗于一体，构成一个自给自足的宗教—社会综合体；其建筑群在近代毁灭与重建中形成中西合璧的形态，至今仍延续宗教使用，既是西北天主教传播与本土化的重要见证，也是研究近代中西文化交流与地方宗教社区史的关键遗产样本。`,
    whyImportant: {
      title: '为什么重要',
      values: [
        {
          title: '历史价值',
          text: '通远坊是天主教在中国西北内陆最早扎根并长期作为核心的传教与行政中心，自清初禁教时期存续至近代，曾为陕西及西北宗座代牧区主教座堂，直接隶属罗马教廷，其发展完整呈现了天主教在中国由地下传播、制度化扩展到本土化转型的历史进程。',
        },
        {
          title: '建筑价值',
          text: '通远坊保存了西北地区规模最大、体系最完整的天主教建筑群，空间格局承袭中国传统院落秩序，结构与装饰以本土营造技术转译西方教堂形制，是内陆地区中西建筑融合与近代教堂本土化的典型实物范例，具有突出的建筑史与技术史价值。',
        },
        {
          title: '社会价值',
          text: '通远坊不仅是宗教建筑，更是一个延续至今的教民社区核心，长期承担教育、医疗、育婴与慈善职能，形成以信仰为纽带的稳定社会网络，其礼仪、节庆与生活方式体现了宗教与地方文化的深度融合，是研究近代内陆宗教社区与社会变迁的重要活态样本。',
        },
      ],
    },
    readingGuide: {
      title: '本站怎么读',
      sections: [
        { title: '历史沿革', text: '通远坊自清初建堂至近代的历史进程，以及其作为西北天主教中心的形成与变迁。' },
        { title: '建筑', text: '通远坊教堂及相关建筑群的空间格局、建筑形制与中西融合特征。' },
        { title: '社区口述史', text: '教民亲身经历中的日常生活、信仰实践与动荡年代的集体记忆。' },
      ],
    },
    basicInfo: {
      location: '通远坊位于陕西省西安市高陵区通远街道一带，现为仍在使用中的天主教堂与教民社区，历史建筑主体得以保存，并持续承载宗教与社区活动。',
      protection: '通远坊作为西北地区保存较为完整的天主教历史建筑群，于2008年被列为陕西省重点文物保护单位。',
    },
  },
  EN: {
    what: `Tongyuanfang is a historical religious community centered around a Catholic cathedral located in Gaoling, Xi'an, Shaanxi, established in 1716. From the mid-19th century, it became the highest administrative and missionary center of the Catholic Shaanxi Apostolic Vicariate and the entire Northwest China, known as the “Shaanxi General Church”.`,
    whyImportant: {
      title: 'Why Important',
      values: [
        { title: 'Historical Value', text: 'Tongyuanfang represents the earliest and longest-standing Catholic missionary and administrative center in Northwest China.' },
        { title: 'Architectural Value', text: 'Tongyuanfang preserves the largest and most complete Catholic architectural complex in Northwest China.' },
        { title: 'Social Value', text: 'Tongyuanfang is not just a religious building but a core of a continuing Christian community.' },
      ],
    },
    readingGuide: {
      title: 'How to Read This Site',
      sections: [
        { title: 'Historical Evolution', text: 'The historical process of Tongyuanfang from the early Qing Dynasty to modern times.' },
        { title: 'Architecture', text: 'The spatial layout, architectural forms and Sino-Western fusion features of Tongyuanfang church and related buildings.' },
        { title: 'Community Oral History', text: 'Daily life, faith practices and collective memories in the experience of believers.' },
      ],
    },
    basicInfo: {
      location: `Tongyuanfang is located in Tongyuan Street, Gaoling District, Xi'an City, Shaanxi Province, and remains an active Catholic church and Christian community.`,
      protection: 'Tongyuanfang was listed as a Shaanxi Provincial Key Cultural Relics Protection Unit in 2008.',
    },
  },
};

export const historyStages: Record<Language, HistoricalStage[]> = {
  CN: [
    {
      period: '1711 年—1845 年',
      feature: '初创扎根与总堂地位的奠定。经历清禁教后的隐秘发展，最终迎来政策解禁，通远被正式确立为区域行政中枢。',
      details: '方启升：1716年购地建堂，标志高陵地区天主教传播正式起步。1844年：清政府禁教政策松动。1845年被冯尚任任命为陕西主教，选定通远坊为陕西教区总堂，创办男修道院，开启西北传教新阶段。1848年始办教会学校。',
    },
    {
      period: '1845 年—1901 年',
      feature: '快速扩张、堡垒化成形与危机应对。利用回民起义和饥荒等社会危机迅速扩张信众（吃教、靠教），通过大规模营缮活动，形成“东方小罗马”的军事化宗教中心的理形态。1901年林奇爱去世时通远坊教堂高耸、城垣环绕。',
      details: '高一志（1808-1884）：任职最久。同治元年（1860）回民起义时使通远安然无恙，信众猛增；陕西代牧区在通远坊教堂创办孤儿院，收养了因战争沦为孤儿和弃婴。利用丁戊奇荒（1875年）赈灾，并以工代赈修筑通远坊城墙。1875年，高主教与林奇爱助理（1833-1901）将高陵通远坊原7间主教座堂，扩建为砖木结构中西结合的14间大教堂。引入方济各圣母传教会修女，完善保赤会、医院等功能性建筑。1875年的饥荒中，高主教和林助理设立救灾站，向难民发放钱粮衣物，建慈善医院救治病患，收养孤老、埋葬饿死饥民，向灾民提供籽种；以工代赈方式召集灾民修建通远坊城墙。1880年林助理主教在通远坊修建一座三层大楼，作主教公署。1888年10月修建通远救济医院。',
    },
    {
      period: '1901 年—1932 年',
      feature: '教权纷争表面化与行政中心地位转移。外部矛盾暂缓，教会内部不同国籍神职人员权力斗争激化，但教会功能持续多元发展，在军阀混战中充当庇护所。最终总堂行政中心地位被转移。',
      details: '何理熙、胡定邦、穆斯理时期：1902年起教权纷争表面化，德法西教士间互相排挤。1908年胡定邦（1857-1908）在通远坊召开了中国方济各会传教区主教会议，有华北各省八位方济各会主教出席。1913年，穆斯理（1862-1925）在通远坊建立了邮电代办所。希贤（1975-1944）：1916年军阀混战中刘镇华围城，通远坊成为万人避难所。戴夏德（1892-1932）：精通物理和机械学，尤其电学，在通远坊安置自动发电机、地动仪，监测地球变动。1920年修建气象台，预报天象变化。1928年民国十八年年馑，戴夏德联系华洋义赈会，出资四十万美元并提供技术，帮助李仪祉修复泾惠渠（古郑国渠）。1932年其将总堂正式移至西安南堂，梵蒂冈将关中教区划分，通远坊作为行政中心的历史终结，进入功能性会院时代。',
    },
    {
      period: '1932 年—1952 年',
      feature: '功能性会院时代与本土化转型。降为三原教区下的会院。中国民族主义高涨，中外矛盾激化，最终以外籍神职人员被驱逐、本土化转型完成告终。',
      details: '班锡宜：1932年任三原监牧主教。其排斥中国籍人士，引发神学院学生多次反抗运动，矛盾白热化。1952年，外籍神职人员被驱逐出境。',
    },
  ],
  EN: [
    {
      period: '1711–1845',
      feature: 'Initial Roots and Headquarters Designation. After secret development through the Qing religious prohibition, Tongyuan was officially confirmed as the regional administrative hub following the policy deregluation.',
      details: 'Francesco Saraceni (方启升): In 1716, purchased land and built a church, marking the official beginning of the Catholic mission in the Gaoling area and laying its foundational groundwork. 1844: The Qing government relaxed its prohibition policy on Christianity. Alfonso Maria di Donato (冯尚仁): Was formally appointed as Bishop of Shaanxi, selected Tongyuan Ward as the seat of the Shaanxi Vicariate in 1845, and established a male seminary, ushering in a new phase of missionary work in Northwest China. Church schools were first established in 1848.',
    },
    {
      period: '1845–1901',
      feature: 'Rapid Expansion, Fortification, and Crisis Response. Leveraging social crises such as the Hui Muslim Revolts and widespread famines, the Church rapidly expanded its congregation—a phenomenon often characterized by “converting for bread” (chi jiao) or “relying on the Church for survival” (kao jiao). Through large-scale building and fortification activities, it developed the spatial morphology of a militarized religious hub known as the “Little Rome of the East.” By the time Bishop Amato Pagnani (林爱奇) passed away in 1901, Tongyuan Ward was described as a settlement with “soaring church spires and surrounding city walls.”',
      details: 'Ephysius Chiais (高一志): The longest-serving bishop. During the Hui Muslim Uprising in the first year of the Tongzhi reign (1860), Tongyuan remained safe and unharmed, leading to a surge in the number of believers. Meanwhile, the Apostolic Vicariate of Shaanxi established an orphanage at the Tongyuan Church, taking in infants and children left orphaned or abandoned due to the war. During the Incredible Famine of the Guangxu Era (Ding-Wu Qi Huang, 1875), he provided relief and implemented a work-for-relief program to construct the Tongyuan city walls. In 1875, Bishop Ephysius Chiais (高一志), and his coadjutor, Amato Pagnani (林爱奇), expanded the original 7-bay cathedral in Tongyuan Ward, Gaoling, into a 14-bay cathedral featuring a hybrid Sino-Western brick-and-timber structure. They introduced the Franciscan Missionaries of Mary sisters and perfected functional infrastructure such as the Holy Childhood Association (Sainte Enfance) and hospitals. During the 1875 famine, Bishop Ephysius Chiais and Coadjutor Amato Pagnani established relief stations to distribute money, grain, and clothing to refugees. They founded a charitable hospital to treat the sick, adopted the elderly and orphans, buried those who died of starvation, and provided seeds to famine victims. Through a work-for-relief initiative, they mobilized refugees to construct the defensive city walls of Tongyuan Ward. In 1880, Coadjutor Bishop Pagnani constructed a three-story building in Tongyuan Ward to serve as the Bishop’s Palace. In October 1888, the Tongyuan Relief Hospital was established.',
    },
    {
      period: '1901–1932',
      feature: 'The overt emergence of clerical power struggles and the relocation of the administrative center. As external conflicts temporarily eased, internal power struggles intensified among clergy of different nationalities within the Church. Nevertheless, the Church’s functions continued to diversify, serving as a sanctuary during warlord infighting. Ultimately, its status as the primary administrative center was transferred elsewhere.',
      details: 'The Era of Odorico Giuseppe Rizz (何理熙), Athanasius Götte (胡定邦), and Auguste Jean Gabriel Maurice (穆理思): Beginning in 1902, internal clerical power struggles came to the fore, with escalating infighting and factional rivalry among German, French, and Spanish friars. In 1908, Bishop Athanasius Goette convened the Synod of Franciscan Bishops in China at Tongyuan Ward, attended by eight Franciscan bishops from various northern provinces. In 1913, Bishop Eugenio Massi established a postal and telegraph agency in Tongyuan Ward. Eugenio Massi (希贤): In 1916, amid warlord conflicts, when Liu Zhenhua besieged the city, Tongyuan Ward served as a sanctuary for tens of thousands of refugees. Fiorenz Umberto Tessiatore (戴夏德): Highly proficient in physics and mechanics—particularly electromagnetism—he installed an automated generator and a seismograph in Tongyuan Ward to monitor seismic activity. In 1920, he built a meteorological observatory to forecast weather changes. During the Great Northwest Famine of 1928, he contacted the China International Famine Relief Commission, securing $400,000 in funding along with technical support to assist Li Yizhi in restoring the Jinghui Canal. In 1932, he officially transferred the cathedral’s administrative seat to the South Church in Xi’an. As the Vatican divided the Guanzhong Diocese, Tongyuan Ward’s history as an administrative center came to an end, transitioning into an era as a functional monastery.',
    },
    {
      period: '1933—1950’S',
      feature: 'The Era of the Functional Monastery and Indigenous Transformation. Relegated to a monastery under the Diocese of Sanyuan, the site witnessed rising Chinese nationalism and escalating Sino-foreign tensions. This period ultimately culminated in the expulsion of foreign clergy and the completion of the Church’s indigenous transformation.',
      details: 'Fulgenzio Pasini (班锡宜): Appointed Apostolic Prefect of Sanyuan in 1932. His marginalization of Chinese personnel sparked repeated protest movements among seminary students, bringing internal tensions to a boiling point. In 1952, foreign clergy were expelled from China.',
    },
  ],
};

export const historicalEvents: Record<Language, HistoricalEvent[]> = {
  CN: [
    {
      title: '起源与早期发展',
      period: '1668—1742 年',
      text: '高陵通远坊原名“南刘家”（又称刘家堡），早先人烟稀少。此地天主教历史悠久，可追溯至明朝末年，相传当时村民刘光祖一家便已皈依。清康熙7年（1668年），富平县魏家庄天主教徒魏良栋的后裔，因生活所迫迁至高陵刘家堡定居。以后又迁来富平康姓教民，在当地发展刘、李、王、吕、韩等诸姓入教。此后，通远坊的宗教活动日益频繁，在周边群众中的影响力不断扩大，信徒人数也随之逐渐增加。康熙时期，意大利籍方济各会士方启升（Francesco Saraceni）来华，1716年赴陕西管理西安和三原教务，在通远坊置地建堂，建成了一座拥有七间房、具有浓郁中国传统建筑风格的砖木结构教堂。作为第一位常驻通远坊、管理山陕两省教务的主教，方启升在此直至1742年逝世，葬于通远坊。这次选址确立了通远坊作为陕西教区总堂的历史地位。以此为起点，在长达一个多世纪的岁月里，直至1932年，共有12位主教相继在通远坊驻节。',
    },
    {
      title: '同治元年战乱与庇护',
      period: '1862 年',
      text: '同治元年（1862年），陕西因战乱人口锐减数百万，基层秩序崩溃。在这场浩劫中，渭北通远坊等天主教村落却奇迹般安然无恙，成为汉民避难的安全岛，引发“靠教”热潮，推动其演变为庞大的综合性宗教社区。通远坊之所以能独善其身，主因并非回军优待，而是高一志主教构筑坚固防御体系的武装自保，结合不平等条约带来的外交特权威慑，让起义军有所忌惮。',
    },
    {
      title: '丁戊奇荒与赈灾修寨',
      period: '1875—1878 年',
      text: '光绪元年至四年（1875—1878年），一场席卷华北的“丁戊奇荒”重创陕西。关中平原尤甚，史载“赤地千里”，饿殍遍野。方济各会利用海外募集的赈灾款项，在通远坊实施赈灾修寨工程。教会以工代赈方式雇佣灾民，修筑长达数公里的坚固城墙，同时要求领粮者立誓入教。这种带有鲜明生存功利色彩的吃教现象使陕西信徒增加，通远坊亦由此完成从村堂到大型宗教社区的第二次关键扩张。',
    },
    {
      title: '庚子教难与义和团运动',
      period: '1900 年',
      text: '光绪二十六年（1900年）庚子教难和义和团运动爆发，数千名自周边县市涌入的避难教友以及修院全体师生进入通远坊，通远坊转入战时防御状态。坊内动员教民自筹粮草、自备武器，并依托此前修筑的坚固围墙与土堡建筑群，构筑起防御体系。尽管面临防御物资匮乏，仍成为庚子年间陕西境内极少数未被攻破的教会据点之一，保全了数千人性命。',
    },
    {
      title: '林奇爱与“东方小罗马”',
      period: '1880—1899 年',
      text: '林奇爱（Pasquale Amato Pagnucci）主教进一步完善了通远坊的功能，使其达到了“东方小罗马”的影响力顶峰。首先是建筑群落与防御体系的最终完善。林奇爱新建了主教府三层大楼（主教公署，1954年由于基础不牢而拆除），并修建了北城，最终完成了通远坊城垣的建设，使整个防御体系更加巩固和完备。其次是慈善医疗体系的全面引入。1890年林主教邀请玛利亚方济各传教修女会（简称圣母会，俗称“白会”）来陕西传教，同年12月21日，圣母会六位修女从马赛经过六个多月的旅程抵达通远坊，接管保赤会，开办救济医院、敬老院等社会慈善事业。之后由高陵一地传入其他地区。1899年，圣母圣心会传入三原，在油坊道购地建修女院，意大利人若忍娜任院长，医院、养老院、学校等教会机构与慈善体系逐步建立。',
    },
    {
      title: '刘镇华围城',
      period: '1926 年',
      text: '1926年，刘镇华率镇嵩军围攻西安，其部将梅发奎驻守高陵期间军纪败坏、掠夺百姓，致使民不聊生。而天主教陕西教区中枢通远坊却安然无恙，成为罕见的“避风港”。通远坊之所以能独善其身，主要得益于两点：一是意大利籍主教希贤圆滑善际，且教会背后有西方列强外交保护，军阀唯恐引发涉外纠纷而不敢侵犯；二是其具备严密的防御体系。战时，周边士绅、百姓甚至军阀家眷近万人纷纷涌入避难。教会不仅提供了安全屏障，还通过施粥舍药及下设的修女会等机构开展战时救济，成为民国乱世中教会势力交织的典型缩影。',
    },
    {
      title: '民国十八年年馑救济',
      period: '1928—1931 年',
      text: '在民国十八年年馑（1928—1931年）期间，位于高陵的通远天主教堂及其附属机构（如“圣心会”/“黑会”、“保赤会”等），依托其深厚的基层组织力、西方背景与医疗救济网络，开展了全方位的救灾行动，发挥了不可替代的基层慈善救济、对外沟通桥梁与工程后勤保障作用。年馑期间，通远教堂及其附属会院设立大型粥厂施粥，收容逃荒至高陵及周边地区的极贫难民；通过下设的“保赤会”（育婴堂）、孤儿院和养老院，集中收养了大批因灾荒被遗弃的婴幼儿、孤儿与无依无靠的老人。面对灾荒中后期横行的霍乱、伤寒与疟疾等瘟疫，通远教堂诊所免费向灾民发放现代药品并提供基础医疗庇护，极大地遏制了瘟疫在通远及周边村落的蔓延。',
    },
    {
      title: '大灾与泾惠渠重建',
      period: '1928—1931 年',
      text: '民国十八年大旱、蝗灾与瘟疫交织，加上军阀混战与苛捐杂税，导致关中在1928至1931年间惨遭旷世灾荒，900万人口中死亡达250万至300万人，社会崩溃。在此绝境中，高陵通远坊天主教会发挥了关键的救灾作用，不仅接纳流民避难，还积极施粥舍药，成为重要的民间救援基地。大灾也促使各界达成“以工代赈、根治水利”共识。1930年，杨虎城主政陕西并力邀李仪祉出山，联合“华洋义赈会”开修泾惠渠。工程耗资约150万银元，由政府拨款、国际援助及华侨捐款等多方筹措。泾惠渠是中国首座采用现代水利理论与钢筋水泥修建的大型灌溉工程。李仪祉任总指挥负责技术设计，杨虎城提供政治、资金保障并派兵护渠，美籍工程师塔德协助。该工程不仅缓解了灾荒，也拉开了中国近代现代水利建设的序幕。',
    },
    {
      title: '关中教区划分',
      period: '1932 年',
      text: '1932年，梵蒂冈将关中教区划分为五个独立的教区（西安、三原、周至、大荔、凤翔）。高陵地区被划归三原教区，新教区的总堂设于三原。这一行政划分标志着通远坊作为西北天主教行政中枢的历史彻底终结。它从一个地区性的行政中心，降格并转型为方济各会的功能性会院，主要承担修道、教育和慈善等职能。',
    },
  ],
  EN: [
    {
      title: 'Origins and Early Development',
      period: '1668–1742',
      text: `Tongyuanfang, originally named "Nanliujia" (also known as Liujiabao), was sparsely populated before its long-standing Catholic history took root in the late Ming dynasty. Legend has it that a local villager named Liu Guangzu and his family converted during this period. In the 7th year of the Kangxi reign (1668), descendants of Wei Liangdong, a Catholic from Weijiazhuang in Fuping County, relocated to Liujiabao due to hardship. They were later followed by Kang-family Catholics from Fuping, which led families with the surnames Liu, Li, Wang, Lü, and Han to convert. Consequently, religious activities in Tongyuanfang grew increasingly frequent, expanding its influence and local follower base. During the Kangxi period, the Italian Franciscan missionary Francesco Saraceni came to China. In 1716, he traveled to Shaanxi to manage the dioceses of Xi'an and Sanyuan, purchasing land in Tongyuanfang and constructing a traditional Chinese-style brick-and-wood church with seven rooms. As the first resident bishop managing the dioceses of Shaanxi and Shanxi, Saraceni remained in Tongyuanfang until his death in 1742, where he was buried. This site selection cemented Tongyuanfang’s historical status as the seat of the Shaanxi Diocese. For over a century until 1932, a succession of 12 bishops resided here.`,
    },
    {
      title: 'The First Year of Tongzhi',
      period: '1862',
      text: `In 1862 (the first year of the Tongzhi reign), Shaanxi’s population plummeted by millions due to warfare, causing local governance and social order to collapse. Amidst this catastrophe, Catholic villages like Tongyuanfang in northern Weibei miraculously remained unscathed, turning into safe havens for Han refugees and sparking a wave of conversions. This propelled its transformation into a sprawling, multi-functional religious community. Tongyuanfang was able to stand alone largely due to two factors: Bishop Ephysius Chiais’s armed self-preservation through a robust defense system, combined with the diplomatic deterrence brought by unequal treaties, which made the rebel forces wary of provoking external powers.`,
    },
    {
      title: 'The Great Ding-Wu Famine',
      period: '1875–1878',
      text: `From the 1st to the 4th year of the Guangxu reign (1875–1878), the "Ding-Wu Famine," which swept across northern China, severely devastated Shaanxi. The Guanzhong Plain was hit worst; historical records describe it as "a thousand miles of barren land" littered with corpses. Using disaster relief funds raised overseas, the Franciscans launched a fortification and relief project in Tongyuanfang. Employing a "work-relief" approach, they hired refugees to build solid city walls several kilometers long while requiring recipients to take an oath of conversion. This utilitarian approach to survival boosted the local Catholic population and marked Tongyuanfang's second major expansion from a village chapel into a large-scale religious community.`,
    },
    {
      title: 'The Boxer Uprising of 1900',
      period: '1900',
      text: `In the 26th year of the Guangxu reign (1900), the Boxer Uprising broke out, driving thousands of refugees from neighboring counties—along with seminary faculty and students—into Tongyuanfang, forcing the settlement into a wartime defense posture. Residents mobilized to secure their own food, supplies, and weapons, relying on the previously constructed fortress walls and earthen bastions. Despite facing a severe shortage of defensive materials, Tongyuanfang became one of the very few Catholic strongholds in Shaanxi that remained unbreached during the crisis, preserving thousands of lives. This event reinforced the village's diplomatic and defensive shielding.`,
    },
    {
      title: 'Bishop Pasquale Amato Pagnucci and the “Little Rome of the East”',
      period: '1880–1899',
      text: `Bishop Pasquale Amato Pagnucci further expanded Tongyuanfang's functions, elevating its influence to the pinnacle of a "Little Rome of the East." First, he completed the architectural and defensive complexes by constructing a three-story bishop's residence (demolished in 1954 due to weak foundations) and the North City wall, solidifying the entire fortification network. Second, he fully integrated a charitable medical system. The introduction of the Franciscan Missionaries of Mary (commonly known as the "White Sisters") in 1890 saw six sisters arrive in Tongyuanfang on December 21 of that year, after a journey of over six months from Marseille. They took over the Baochi Hui (Infant Preservation Society), establishing rescue hospitals, old-age homes, and other social welfare programs. This model later spread to other regions, such as Sanyuan in 1899, where a women's convent, hospital, nursing home, and school were established under the Italian Sister Rosina.`,
    },
    {
      title: `Liu Zhenhua’s Siege of Xi'an`,
      period: '1926',
      text: `In 1926, warlord Liu Zhenhua led the Zhensong Army to besiege Xi'an. During his garrison in Gaoling, his subordinate Mei Fakui imposed brutal rule and looted the populace, driving them to destitution. Yet, Tongyuanfang, the administrative center of the Shaanxi Catholic Diocese, remained unharmed and served as a rare safe haven. Tongyuanfang survived largely because of two elements: first, Italian Bishop Eugenio Massi was politically astute, and the backing of Western extraterritorial protection deterred warlords from provoking international disputes; second, it maintained a strict defense system. During the conflict, thousands of local gentry, commoners, and even family members of rival warlords (such as the primary wife of famous Shaanxi National Pacification Army commander Guo Jian) fled to take shelter in facilities like the Baochi Hui. The church provided safety, distributed porridge and medicine, and functioned as a classic microcosm of church influence during the Republican era.`,
    },
    {
      title: 'Relief Actions During the 1928–1931 Famine',
      period: '1928–1931',
      text: `During the catastrophic famine of 1928–1931, the Tongyuanfang Catholic Church and its affiliated institutions (such as the "Sisters of the Sacred Heart" or "Black Sisters," and the Baochi Hui) deployed their grassroots organizational strength, Western backing, and medical networks to execute comprehensive disaster relief, serving as an irreplaceable hub for grassroots charity, external diplomacy, and logistical support. The church established large soup kitchens to feed destitute refugees fleeing to Gaoling and surrounding areas, while utilizing the Baochi Hui, orphanages, and nursing homes to shelter abandoned infants, orphans, and the elderly. When cholera, typhus, and malaria swept through the region, the church clinic distributed free modern medicines and provided basic medical refuge, greatly containing the spread of epidemics.`,
    },
    {
      title: 'The Great Famine and the Reconstruction of the Jinghui Canal',
      period: '1928–1931',
      text: `An intertwining of drought, locust plagues, epidemics, and man-made burdens like warlord conflict caused 2.5 to 3 million deaths out of Shaanxi's 9 million people between 1928 and 1931, collapsing society. Amidst this despair, the Tongyuanfang Catholic Church played a critical rescue role by harboring refugees and distributing food and medicine. This disaster forged a public consensus for "work-relief and radical water conservation." In 1930, Yang Hucheng, who came to power in Shaanxi, invited hydraulic expert Li Yizhi to cooperate with the China International Famine Relief Commission (CIFRC) to rebuild the Jinghui Canal. Costing roughly 1.5 million silver dollars, funding was raised via government appropriations, international aid, and overseas Chinese donations. The Jinghui Canal was China's first large-scale irrigation project built using modern hydraulic engineering theories and modern materials (concrete and steel). Li Yizhi served as chief engineer, Yang Hucheng provided political support and military protection, and American engineer O. J. Todd assisted. The project alleviated the famine and launched China's modern water conservation era.`,
    },
    {
      title: 'Administrative Subdivision in 1932',
      period: '1932',
      text: `In 1932, the Vatican divided the Guanzhong Diocese into five independent ecclesiastical jurisdictions (Xi'an, Sanyuan, Zhouzhi, Dali, and Fengxiang). Gaoling was assigned to the Sanyuan Diocese, and the new seat was established in Sanyuan. This administrative change marked the complete end of Tongyuanfang's history as the administrative hub of Northwest Catholicism, reducing it from a regional center to a specialized Franciscan functional house dedicated primarily to monastic, educational, and charitable duties.`,
    },
  ],
};

export const historicalFigures: Record<Language, HistoricalFigure[]> = {
  CN: [
    {
      name: '利玛窦',
      latinName: 'Matteo Ricci',
      years: '1552.10.6—1610.5.11',
      description: '意大利天主教耶稣会会士。天主教在华传教开拓者。以天主教教义与儒家伦理观念相融合为传教策略，接纳传统礼仪，认为中国人祭祖祭孔仅是追思先贤的世俗仪式，不违背天主教教义。',
    },
    {
      name: '金尼閣',
      latinName: 'Trigault, Nicolas',
      years: '1577—1628',
      description: '天主教耶稣会会士。翻译了Matteo Ricci的《中国札记》。',
    },
    {
      name: '汤若望',
      latinName: 'Johann Adam Schall von Bell，或 Adam Schall',
      years: '1591.5.1—1666.8.15',
      description: '天主教耶稣会会士。明末清初来华传教47年，官至一品。1622年6月23日，与耶稣会士布鲁诺、罗雅各指挥炮手击退了入侵澳门的英荷联军。1627年夏，在西安城内建立了一座小教堂。用中文写了一本介绍伽利略望远镜的《远镜说》，1630年协助徐光启编修《崇祯历书》，并为明铸造西式火炮。',
    },
    {
      name: '曾德昭',
      latinName: 'Alvaro Semedo',
      years: '1586—1658',
      description: '天主教耶稣会会士。曾名谢务禄，1616年经历南京教案，著有《大中华帝国志》（The History of That Great and Renowned Monarchy of China），翻译《大唐景教碑》，在西方引起关注。',
    },
    {
      name: '方启升',
      latinName: 'Francesco Saraceni',
      years: '1679—1741.12.1',
      description: '意大利方济各会士。1716年赴陕西管理西安和三原教务，先在西安五星街建设西安南堂，又在通远坊购置荒地修建圣堂。曾避难于渭南貟曲乡张葛沟山坡的土窑洞。',
    },
    {
      name: '叶宗贤',
      latinName: 'Basilius Brollo',
      years: '1848.3.25—1704.11.16',
      description: '意大利方济各会士。1701年4月抵达陕西主持教务，编纂了两部中文词典《汉拉词典》。',
    },
    {
      name: '冯尚仁',
      latinName: 'Alfonso Maria di Donato',
      years: '1783—1848.5.20',
      description: '意大利方济各会士。1845年在通远坊办修道院，培养由山西带来的修道生。1848年始办教会学校提高教友素质。',
    },
    {
      name: '高一志',
      latinName: 'Ephysius Chiais',
      years: '1808.2.17—1884.4.12',
      description: '意大利方济各会士。1848年为陕西代牧区主教，办修院和学校。同治元年（1860）陕甘回变时，在通远坊创办孤儿院，收养战争孤儿和弃婴。1867年，因病任命意籍林奇爱（Pasquale Amato Pagnucci）为助理主教，主持陕西代牧区教务。1875年，高主教与林助理主教将高陵通远坊原7间主教座堂扩建为砖木结构中西结合的14间大教堂。1878年饥荒中，高主教和林助理主教大力赈灾救济，在通远坊和其他地方设立救灾站，向难民发放钱粮衣物，建慈善医院救治病患，收养孤老、救灾济贫，埋葬饿死饥民，为恢复生产向灾民提供籽种；以工代赈方式召集灾民修通远坊城墙。',
    },
    {
      name: '林奇爱',
      latinName: 'Pasquale Amato Pagnucci',
      years: '1833.10.12—1901.2.1',
      description: '意大利籍方济各会士。1880年林助理主教在通远坊建一座三层楼作主教公署。1883年重建西安南堂12间和北堂。1888年10月建通远救济医院，1890年邀请玛利亚方济各传教修女会（简称圣母会）来陕西传教，12月21日修女抵达通远坊，接管保赤会，办救济医院、敬老院等社会慈善。',
    },
    {
      name: '何理熙',
      latinName: 'Odorico Giuseppe Rizz',
      years: '1858.4.28—1905.3.22',
      description: '意大利籍方济各会士。',
    },
    {
      name: '胡定邦',
      latinName: 'Athanasius Götte',
      years: '1857.4.11—1908.3.29',
      description: '德国籍方济各会士。于1908年在通远坊召开了中国方济各会传教区主教会议。',
    },
    {
      name: '穆理思',
      latinName: 'Auguste Jean GabrielMaurice',
      years: '1862.10.10—1925.7.27',
      description: '法国籍方济各会士。1913年在通远坊建立了邮电代办所，方便当地人通信。',
    },
    {
      name: '希贤',
      latinName: 'Eugenio Massi',
      years: '1875.8.13—1944.12.10',
      description: '意大利籍方济各会士。1916时值军阀混战、教难频繁，希贤主教与各方联络，使通远坊主教座堂暂免于战乱，来此逃难者多至万人。1927年11月守夜祈祷和火炬游行，使高陵驻军放弃夜袭通远坊。',
    },
    {
      name: '戴夏德',
      latinName: 'Fiorenz Umberto Tessiatore',
      years: '1892.4.27—1932.4.10',
      description: '意大利方济各会士。精通物理和机械，在通远坊置自动发电机、地动仪。1920年修建气象台，预报天象变化。重视中国文化，1925年在教宗庇护十一世的梵蒂冈展览会上，他将1917年在泾阳王徵十世孙王果手里出资买走的明代天主教拉丁文、叙利亚文书各一本和圣爵一个带去参展。1927年将主教府从通远坊迁入西安南堂。',
    },
    {
      name: '班锡宜',
      latinName: 'Fulgenzio Pasini',
      years: '1897.4.2—1985.4.17',
      description: '意大利方济各会士。',
    },
  ],
  EN: [
    {
      name: 'Matteo Ricci',
      latinName: '利玛窦',
      years: '1552.10.6–1610.5.11',
      description: 'An Italian Catholic Jesuit missionary. A pioneer of Catholic evangelization in China. He adopted a missionary strategy that synthesized Catholic doctrine with Confucian ethical concepts, accepting traditional rites. He maintained that ancestor worship among the Chinese was merely an expression of reverence for forebears—intended to teach descendants to honor their living parents—and carried no religious significance. In his view, ancestor veneration and Confucian rites were purely secular ceremonies of commemoration that did not contradict Catholic doctrine.',
    },
    {
      name: 'Nicolas Trigault',
      latinName: '金尼閣',
      years: '1577–1628',
      description: `An Italian Catholic Jesuit missionary. He translated Nicolas Trigault's China in the Sixteenth Century: The Journals of Matthew Ricci.`,
    },
    {
      name: 'Johann Adam Schall von Bell, or Adam Schall',
      latinName: '汤若望',
      years: '1591.5.1–1666.8.15',
      description: `A Catholic Jesuit missionary. Served in China for 47 years during the late Ming and early Qing dynasties, eventually reaching the rank of first-class official. On June 23, 1622, together with two other fellow Jesuits Giovanni Bruno and Giacomo Rho, he commanded gunners to successfully repel the combined Anglo-Dutch fleet invading Macao. In the summer of 1627, he established a small church within the city of Xi'an. He authored Yuanjing Shuo (On the Telescope) in Chinese, introducing Galileo's telescope, and in 1630 assisted Xu Guangqi in compiling the Chongzhen Lishu (Chongzhen Calendar), as well as casting Western-style cannons for the Ming court.`,
    },
    {
      name: 'Alvaro Semedo',
      latinName: '曾德昭',
      years: '1586–1658',
      description: 'A Catholic Jesuit missionary. Formerly went by the name Xie Wulu. Having survived the Nanjing Religious Incident of 1616, he authored The History of That Great and Renowned Monarchy of China (Imperio de la China) and translated the Nestorian Stele of the Tang Dynasty (Nestorian Tablet), which aroused widespread attention in the West.',
    },
    {
      name: 'Francesco Saraceni',
      latinName: '方启升',
      years: '1679–1741.12.1',
      description: `An Italian Franciscan friar. He traveled to Shaanxi in 1716 to oversee ecclesiastical affairs in Xi'an and Sanyuan. He first constructed the Xi'an South Church on Wuxing Street, and subsequently purchased wasteland in Tongyuan Ward to erect a church. During a period of anti-Catholic persecution, he took refuge in an earthen cave dwelling on the hillside of Zhanggegou in Yuanqu Village, Weinan.`,
    },
    {
      name: 'Basilius Brollo',
      latinName: '叶宗贤',
      years: '1848.3.25–1704.11.16',
      description: 'An Italian Franciscan friar. Arrived in Shaanxi in April 1701 to oversee ecclesiastical affairs. He compiled two Chinese–Latin dictionaries (Dictionarium Sinico-Latinum).',
    },
    {
      name: 'Alfonso Maria di Donato',
      latinName: '冯尚仁',
      years: '1783–1848.5.20',
      description: 'An Italian Franciscan friar. Established a seminary in Tongyuan Ward in 1845 to train seminarians brought from Shanxi. In 1848, he founded a church school to enhance the general education and religious literacy of local Catholics.',
    },
    {
      name: 'Ephysius Chiais',
      latinName: '高一志',
      years: '1808.2.17–1884.4.12',
      description: 'An Italian Franciscan friar. Became the Vicar Apostolic of Shaanxi in 1848, establishing seminaries and schools. During the Hui Muslim Uprising in the first year of the Tongzhi reign (1860), the Apostolic Vicariate of Shaanxi established an orphanage at the Tongyuan Church, taking in infants and children who were orphaned or abandoned due to the war. In 1867, due to failing health that hindered his pastoral duties, he appointed the Italian missionary Pasquale Amato Pagnucci (林爱奇) in Tongyuan Ward as Coadjutor Bishop to take charge of the Shaanxi Vicariate. In 1875, Bishop Gao and Coadjutor Bishop Lin expanded the original seven-bay cathedral in Tongyuan Ward into a 14-bay brick-and-timber structure blending Chinese and Western architectural styles. During the severe famine of 1878, both bishops launched extensive relief efforts by establishing centers in Tongyuan Ward and other regions to distribute money, grain, and clothing to refugees, opening a charitable hospital to treat the sick, taking in orphans and the elderly, burying victims, and providing seeds to restore agricultural production. They also organized relief-for-work projects to assemble refugees to build the Tongyuan Ward town wall, fostering harmonious relations between the Church and local civil authorities.',
    },
    {
      name: 'Pasquale Amato Pagnucci',
      latinName: '林奇爱',
      years: '1833.10.12–1901.2.1',
      description: `An Italian Franciscan friar. In 1883, he rebuilt both the Xi'an South Church—a 12-bay structure comprising three altar bays, eight nave bays, and one facade bay—and the North Church. In 1880, Coadjutor Bishop Lin constructed a three-story building in Tongyuan Ward to serve as the episcopal residence (bishop's palace). In October 1888, the Tongyuan Relief Hospital was established. In 1890, he invited the Franciscan Missionaries of Mary to undertake missionary work in Shaanxi. On December 21, the sisters arrived in Tongyuan Ward, where they took over the Holy Childhood Association (Baochi Hui) and launched social charitable endeavors, including a relief hospital and a home for the aged.`,
    },
    {
      name: 'Odorico Giuseppe Rizz',
      latinName: '何理熙',
      years: '1858.4.28–1905.3.22',
      description: 'An Italian Franciscan friar.',
    },
    {
      name: 'Athanasius Götte',
      latinName: '胡定邦',
      years: '1857.4.11–1908.3.29',
      description: 'A German Franciscan friar. Convened the Conference of Bishops from Franciscan Mission Dioceses in China at Tongyuan Ward in 1908.',
    },
    {
      name: 'Auguste Jean GabrielMaurice',
      latinName: '穆理思',
      years: '1862.10.10–1925.7.27',
      description: 'A French Franciscan friar. Established an agency postal and telegraph office in Tongyuan Ward in 1913 to facilitate local communications.',
    },
    {
      name: 'Eugenio Massi',
      latinName: '希贤',
      years: '1875.8.13–1944.12.10',
      description: 'An Italian Franciscan friar. In 1916, amidst warlord infighting and frequent anti-Christian unrest, Bishop Goette coordinated with various factions to safeguard the Tongyuan Ward Cathedral from the ravages of war, providing refuge for up to 10,000 displaced people. In November 1927, a night vigil prayer and a torchlight procession deterred the local garrison stationed in Gaoling from launching a planned night raid on Tongyuan Ward.',
    },
    {
      name: 'Fiorenz Umberto Tessiatore',
      latinName: '戴夏德',
      years: '1892.4.27–1932.4.10',
      description: `An Italian Franciscan friar. Well-versed in physics, mechanics, and particularly electricity, he installed an automatic generator and a seismograph at the Tongyuan Ward Seminary to monitor seismic activity. In 1920, he constructed a meteorological observatory to forecast weather changes. Deeply appreciative of Chinese culture, he brought three artifacts to Pope Pius XI’s 192 Vatican Exhibition, which he had purchased in 1917 from Wang Guo, a tenth-generation descendant of Wang Zheng: two Ming-dynasty Catholic manuscripts—one in Latin and one in Syriac—along with a chalice. In 1927, he relocated the episcopal residence from Tongyuan Ward, Gaoling, to the Xi'an South Church.`,
    },
    {
      name: 'Fulgenzio Pasini',
      latinName: '班锡宜',
      years: '1897.4.2–1985.4.17',
      description: 'An Italian Franciscan friar.',
    },
  ],
};

export const architectureStages: Record<Language, ArchitectureStage[]> = {
  CN: [
    {
      code: '4.1.1',
      title: '隐秘萌芽期',
      period: '1716 年',
      text: '这一时期奠定总堂基石。通远坊建筑的起点可追溯至清康熙五十（1716）年。在禁教背景下，陕晋代牧主教方启升（Francesco Saraceni）为避开官府监控，在远离政治中心的高陵通远购置土地，主持建造了一座7间房屋的砖木结构教堂。此时建筑较为简陋，主要为满足日常宗教活动与传教，但它成功在当地发展了数百名教民，为通远坊日后升格为西北天主教的中心奠定了最早的物质与社会基础。',
    },
    {
      code: '4.1.2',
      title: '行政确立与本土化建设期',
      period: '1845 年',
      text: '主教府与修道院的创立。道光二十五（1845）年，尽管禁教政策有所松动，但内地传教仍受严密管控。考虑到西安作为省城的政治敏感性，冯尚任主教（Alfonso Maria di Donato）听取了精通武艺、具备较强自保能力的郭路家村教友建议，将总堂正式定于地处偏僻、不通大路的通远坊，采取“半地下”策略建立据点。在建筑布局上，冯尚任于同年在通远坊正式设立主教府，确立了其作为辖管陕甘数万教友的行政中心地位；同时创办了男修道院，由其亲自教授拉丁语（至1848年已有修生19人）。这一时期的建设标志着通远坊正式具备了教区行政与本土神职人员培养的功能。',
    },
    {
      code: '4.1.3',
      title: '军事堡垒化与大教堂扩建期',
      period: '1860 年代—1870 年代',
      text: '灾变中的物理扩张。19世纪中后期，面对同治陕甘回变与1878年“丁戊奇荒”的社会剧变，高一志主教（Ephysius Chiais）与林奇爱助理主教（Pasquale Amato Pagnucci）将通远坊改造成一座高度具备自保能力的军事堡垒。城垣防御体系：1860年代起，教会将通远坊打造成筑有深壕高墙、配备火炮并悬挂外国旗帜的“安全特区”。在1878年饥荒期间，教会更推行“以工代赈”，组织灾民加固城墙、掘宽深壕，使通远坊形成了异常坚固的城垣防御体系。',
    },
    {
      code: '4.1.4',
      title: '鼎盛时期',
      period: '19 世纪末—20 世纪初',
      text: '“东方小罗马”综合机构群落。在林奇爱主教主政时期，通远坊的建设达到了历史顶峰，形成了功能高度集成、自成一体的“城中之城”，被誉为“东方小罗马”。整体建筑状况：至此，通远坊形成了外有高大城垣包围，内有14间大教堂、三层主教公署、修女楼、神学院、保禄学校、医院、保赤会各大院落及长房转角楼错落耸立的庞大建筑群，集宗教、行政、教育、医疗与防御功能于一体。',
    },
    {
      code: '4.1.5',
      title: '机构延续与现代化转型期',
      period: '1932 年—1950 年代初',
      text: '权属变更与地标拆除。进入20世纪，尽管教区行政中心有所转移，但通远坊作为重要会院依然保有雄厚的物质资产。截至1932年班锡宜主政时期，通远坊拥有大楼3座、各类房屋共计342间、土地195亩，并持续运营光华学校、养病院、孤儿院及养老院等机构。1952年，随着政治环境的根本改变，外籍神职人员被驱逐出境，“三自革新运动筹备委员会”成立，教会管理权全面交由中国神职人员，实现了教务的本土自理。1954年，作为鼎盛时期地标之一的三层主教府大楼因基础不牢被拆除，其中主教堂改作仓库，主堂面及六座耳堂遭拆毁；小修院用作住房，修女院及育婴堂改作校舍。修女院保存现状较差，屋顶部分坍塌，门窗严重损毁。育婴堂在1999年和2004年曾两次发生火灾，目前仅残存墙体。',
    },
  ],
  EN: [
    {
      code: '4.1.1',
      title: 'Hidden Germination Period',
      period: '1716',
      text: `This period laid the cornerstone for the head cathedral. The starting point of the Tongyuan Ward architecture can be traced back to 1716 (the 50th year of the Kangxi reign in the Qing Dynasty). Under the prohibition of Christianity, Bishop Giovanni Francesco Nicolai (Fang Qisheng) of the Shaanxi-Shanxi Vicariate purchased land in Tongyuan, Gaoling—far removed from political centers—to evade government surveillance. He presided over the construction of a brick-and-timber church comprising seven rooms. Although the structure was relatively modest at the time, primarily serving daily religious activities and evangelism, it successfully converted hundreds of local villagers, laying the earliest material and social foundation for Tongyuan Ward's eventual elevation to the center of Catholicism in Northwest China.`,
    },
    {
      code: '4.1.2',
      title: 'Administrative Establishment and Localization Period',
      period: '1845',
      text: `Establishment of the Bishop's Residence and Seminary. In 1845 (the 25th year of the Daoguang reign), although the ban on Christianity had eased slightly, proselytizing in inland China remained under strict control. Considering the political sensitivity of Xi'an as the provincial capital, Bishop Basilio Rocchi (Feng Shangren) took the advice of parishioners from Guolujia Village—who were skilled in martial arts and possessed strong self-defense capabilities—and officially established the head cathedral in the remote and inaccessible Tongyuan Ward, adopting a "semi-underground" strategy to set up the stronghold. Regarding architectural layout, Bishop Rocchi officially established the Bishop's Residence in Tongyuan Ward that same year, confirming its status as the administrative center governing tens of thousands of believers across Shaanxi and Gansu. Simultaneously, he founded a male seminary where he personally taught Latin (housing 19 seminarians by 1848). The construction during this period marked Tongyuan Ward's official acquisition of administrative functions and native clergy training capacities.`,
    },
    {
      code: '4.1.3',
      title: 'Military Fortification and Cathedral Expansion Period',
      period: '1860s–1870s',
      text: `Physical Expansion Amidst Disasters. In the mid-to-late 19th century, in response to social upheavals such as the Tongzhi Shaanxi-Gansu Muslim Revolt and the Great Famine of 1876–1879 ("Ding-Wu Disaster"), Bishop Ephrem Giesen (Gao Yizhi) and Coadjutor Bishop Pasquale Pagnucci (Lin Qiai) transformed Tongyuan Ward into a highly self-defensible military fortress. Rampart Defense System: Beginning in the 1860s, the church developed Tongyuan Ward into a "safe zone" protected by deep moats, high walls, cannons, and foreign flags. During the 1878 famine, the church further implemented a "food-for-work" program, organizing refugees to reinforce the city walls and widen the deep moats, forming an exceptionally formidable rampart defense system for Tongyuan Ward. Note: In 1887, Shaanxi suffered a severe drought that led to catastrophic famine. Pasquale Pagnucci (林爱奇), serving as Vicar General, collaborated with Bishop Ephysius Chiais (高一志) to provide disaster relief. They seized this opportunity to organize the starving refugees under a "food-for-work" initiative, constructing the southern section of the Tongyuan Ward city wall. After succeeding to the office of Bishop, Pagnucci continued the construction to complete the northern section, giving rise to the famous Tongyuan Ward rampart of that era. Its primary purpose was to safeguard church property and facilitate missionary work. The wall eventually vanished over time due to years of neglect and lack of repair.`,
    },
    {
      code: '4.1.4',
      title: 'Peak Period',
      period: 'Late 19th Century–Early 20th Century',
      text: `"The Little Rome of the East" Integrated Institutional Complex: During the episcopate of Bishop Pasquale Pagnucci, the development of Tongyuan Ward reached its historical zenith, forming a highly integrated, self-contained "city within a city" that earned the moniker "The Little Rome of the East."`,
    },
    {
      code: '4.1.5',
      title: 'Institutional Continuity and Modernization Period',
      period: '1932–Early 1950s',
      text: `Property Rights Ownership Changes and Demolition of Landmarks. Entering the 20th century, although the diocesan administrative center shifted elsewhere, Tongyuan Ward retained substantial physical assets as an important religious house/convent. By 1932, during the episcopate of Bishop Pietro Silvestri, Tongyuan Ward comprised 3 major multi-story buildings, 342 rooms of various types, and 195 mu (approx. 13 hectares) of land, while continuing to operate institutions such as Guanghua School, the hospice/infirmary, the orphanage, and the home for the elderly. In 1952, against the backdrop of fundamental shifts in the political landscape, foreign clergy were expelled from the country, and the 'Preparatory Committee for the Three-Self Patriotic Movement' was established. Administrative authority over the church was fully transferred to native Chinese clergy, achieving localized self-governance of ecclesiastical affairs. In 1954, the three-story Episcopal Palace—a landmark during the church's zenith—was demolished due to structural instability. Meanwhile, the main cathedral was repurposed as a warehouse, with its main facade and six side chapels/annexes torn down; the minor seminary was converted into residential housing, and the convent and infant home (foundling hospital) were repurposed as school buildings. Today, the convent remains in a poor state of preservation, with a partially collapsed roof and severely damaged doors and windows. The infant home suffered two fires, in 1999 and 2004, leaving only remnant walls standing today.`,
    },
  ],
};
