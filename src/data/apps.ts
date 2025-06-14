export interface App {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  developer: string;
  version: string;
  size: string;
  downloads: string;
  rating: number;
  screenshots: string[];
  features: string[];
  similarApps: string[];
}


export const featuredApps: App[] = [
{
    id: '1',
    name: '高德地图',
    icon: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Amap%20navigation%20app%20icon%2C%20Flyme%20Auto%201.8%20style%2C%20flat%20design%2C%20rounded%20corners%2C%20white%20background&sign=0160a81d0a7519053417d95322ac98c4',
    description: '专业车载导航应用，提供实时路况和智能路线规划',
    category: '导航',
    developer: '高德软件',
    version: '12.0.0',
    size: '150 MB',
    downloads: '500M+',
    rating: 4.9,
    screenshots: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Amap%20navigation%20interface%20in%20car%2C%20modern%20design&sign=e9e2b7cd9d27d7d65010e478a143cccb',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Amap%20navigation%20route%20planning&sign=7ba31e95ce121ef74bd1e85c7c5ad42a'
    ],
    features: [
      '实时路况更新',
      '智能路线规划',
      '3D实景导航',
      '语音控制',
      '离线地图'
    ],
    similarApps: ['2'],

  },
{
    id: '2',
    name: '百度地图',
    icon: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Baidu%20Map%20app%20icon%2C%20Flyme%20Auto%201.8%20style%2C%20flat%20design%2C%20rounded%20corners%2C%20white%20background&sign=46b907d002e8586259d0ba891299431e',
    description: '智能导航系统，支持AR导航和语音交互',
    category: '导航',
    developer: '百度',
    version: '11.5.0',
    size: '145 MB',
    downloads: '450M+',
    rating: 4.8,
    screenshots: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Baidu%20Map%20AR%20navigation%20interface&sign=e35b341bea728c0f54c2f2faadf45d9a'
    ],
    features: [
      'AR实景导航',
      '智能语音助手',
      '停车场推荐',
      '组队出行',
      '电动车导航'
    ],
    similarApps: ['1']
  },
{
    id: '3',
    name: 'QQ音乐',
    icon: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=QQ%20Music%20app%20icon%2C%20Flyme%20Auto%201.8%20style%2C%20flat%20design%2C%20rounded%20corners%2C%20white%20background&sign=bbf1d92ce252f52bba0544061886dfab',
    description: '海量正版音乐，千万曲库随心听',
    category: '音乐电台',
    developer: '腾讯',
    version: '10.0.0',
    size: '120 MB',
    downloads: '600M+',
    rating: 4.7,
    screenshots: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=QQ%20Music%20car%20mode%20interface&sign=5ad71ab080b90cc82beed733ff6539dc'
    ],
    features: [
      '千万正版曲库',
      '智能推荐',
      '车载模式',
      '无损音质',
      '歌词同步'
    ],
    similarApps: ['4']
  },
{
    id: '4',
    name: '网易云音乐',
    icon: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Netease%20Music%20app%20icon%2C%20Flyme%20Auto%201.8%20style%2C%20flat%20design%2C%20rounded%20corners%2C%20white%20background&sign=ae9725b401e5858a9ad1514d02a788a9',
    description: '发现音乐，分享感动',
    category: '音乐电台',
    developer: '网易',
    version: '8.0.0',
    size: '110 MB',
    downloads: '550M+',
    rating: 4.8,
    screenshots: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Netease%20Music%20car%20mode%20interface&sign=1024e2bdaa6741a9517654c61229d625'
    ],
    features: [
      '个性化推荐',
      '高品质音乐',
      '车载模式',
      '音乐社区',
      '睡眠定时'
    ],
    similarApps: ['3']
  },
{
    id: '5',
    name: '占位应用1',
    icon: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Placeholder%20app%20icon%201%2C%20Flyme%20Auto%201.8%20style%2C%20flat%20design%2C%20rounded%20corners%2C%20white%20background&sign=a47d531fd23b4e9ea0625d87b0bbf67e',
    description: '这是一个占位应用，功能即将上线',
    category: '车载工具'
  },
{
    id: '6',
    name: '占位应用2',
    icon: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Placeholder%20app%20icon%202%2C%20Flyme%20Auto%201.8%20style%2C%20flat%20design%2C%20rounded%20corners%2C%20white%20background&sign=dd9cdd5fd6d3bbde184fec10e8505e03',
    description: '这是一个占位应用，功能即将上线',
    category: '车载工具'
  },
{
    id: '7',
    name: '占位应用3',
    icon: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Placeholder%20app%20icon%203%2C%20Flyme%20Auto%201.8%20style%2C%20flat%20design%2C%20rounded%20corners%2C%20white%20background&sign=048217d792c68bb5b6c46bb7b125fc77',
    description: '这是一个占位应用，功能即将上线',
    category: '车载工具'
  }
];

export const categories = ['全部', '导航', '音乐电台', '车载工具'];

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  cover: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
  externalUrl?: string; // 新增外部链接字段
  tags: string[];
  isFeatured: boolean;
}


export const tutorials: Tutorial[] = [
  {
    id: 'navigation-guide',
    title: '车载导航系统完全指南',
    description: '从基础到高级，全面掌握车载导航系统的使用技巧',
    cover: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=car%20navigation%20interface%2C%20modern%20design%2C%20blue%20theme&sign=48864d08fcfe1b34d8d730d36bcf4a83',
    category: '导航系统',
    author: '张技术',
    date: '2025-05-15',
    readTime: '15分钟',
    externalUrl: 'https://example.com/navigation-guide',
    tags: ['导航', '新手教程', '系统设置'],
    isFeatured: true
  },
  {
    id: 'entertainment-optimize',
    title: '车载娱乐系统优化指南',
    description: '提升您的车载音乐和视频体验的实用技巧',
    cover: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=car%20entertainment%20system%2C%20music%20player%20interface&sign=80d8e24eb9e849fa45c01089d90c01af',
    category: '娱乐系统',
    author: '李音效',
    date: '2025-05-20',
    readTime: '12分钟',
    externalUrl: 'https://example.com/entertainment-optimize',
    tags: ['音乐', '视频', '音效'],
    isFeatured: true
  },
  {
    id: 'vehicle-settings',
    title: '车辆个性化设置详解',
    description: '根据您的驾驶习惯优化车辆各项参数',
    cover: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=car%20settings%20interface%2C%20minimal%20design&sign=ff6c6e2b55f5b8cf25ad850cb89c4376',
    category: '系统设置',
    author: '王工程师',
    date: '2025-06-01',
    readTime: '18分钟',
    externalUrl: 'https://example.com/vehicle-settings',
    tags: ['个性化', '驾驶模式', '系统设置'],
    isFeatured: false
  },
  {
    id: 'wechat-article',
    title: '车机系统最新功能介绍',
    description: '了解车机系统的最新功能和使用技巧',
    cover: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=car%20infotainment%20system%20with%20new%20features%2C%20modern%20design&sign=ccffa155996b2bdbbedcfa63b098e13c',
    category: '系统更新',
    author: '微信官方',
    date: '2025-06-14',
    readTime: '10分钟',
    externalUrl: 'https://hblog.xbrooke.cn/p/22189.html',
    tags: ['新功能', '系统更新', '官方指南'],
    isFeatured: true
  }
];
