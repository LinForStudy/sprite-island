export type ElementType = '草' | '水' | '火' | '电' | '土' | '风';
export type Rarity = '常见' | '稀有';

export interface Spirit {
  spiritId: string;
  name: string;
  element: ElementType;
  rarity: Rarity;
  habitat: string;
  catchRate: number;
  description: string;
  favoriteFood: string;
  primaryColor: string;
  accentColor: string;
  shape: string;
}

export const spirits: Spirit[] = [
  {
    spiritId: 'leafbun',
    name: '叶团团',
    element: '草',
    rarity: '常见',
    habitat: '草丛',
    catchRate: 0.82,
    description: '喜欢把嫩叶当小被子，睡醒会轻轻摇尾巴。',
    favoriteFood: '露珠饼',
    primaryColor: '#7ed982',
    accentColor: '#fff1a8',
    shape: 'leaf-bun'
  },
  {
    spiritId: 'sproutdeer',
    name: '芽角鹿',
    element: '草',
    rarity: '稀有',
    habitat: '草丛',
    catchRate: 0.55,
    description: '头上的小芽会跟着心情开合，开心时像一朵小花。',
    favoriteFood: '青草糖',
    primaryColor: '#9bd98b',
    accentColor: '#ffd7a8',
    shape: 'sprout-deer'
  },
  {
    spiritId: 'bubblepup',
    name: '泡泡汪',
    element: '水',
    rarity: '常见',
    habitat: '池塘',
    catchRate: 0.78,
    description: '会把泡泡吹成小帽子，送给刚认识的朋友。',
    favoriteFood: '蓝莓冻',
    primaryColor: '#78c9ef',
    accentColor: '#c8f6ff',
    shape: 'bubble-pup'
  },
  {
    spiritId: 'moonfish',
    name: '月鳍鱼',
    element: '水',
    rarity: '稀有',
    habitat: '池塘',
    catchRate: 0.5,
    description: '夜里游动时鳍边会发光，像水里的小月亮。',
    favoriteFood: '星星藻',
    primaryColor: '#83a7f2',
    accentColor: '#f8ed9b',
    shape: 'moon-fish'
  },
  {
    spiritId: 'emberfox',
    name: '暖尾狐',
    element: '火',
    rarity: '常见',
    habitat: '暖石',
    catchRate: 0.72,
    description: '尾巴像一盏小暖灯，冬天最爱围着朋友坐。',
    favoriteFood: '烤果子',
    primaryColor: '#ffb36d',
    accentColor: '#ffdf7c',
    shape: 'ember-fox'
  },
  {
    spiritId: 'lanterncub',
    name: '灯绒熊',
    element: '火',
    rarity: '稀有',
    habitat: '暖石',
    catchRate: 0.48,
    description: '肚皮会发出柔柔的光，给迷路的人照路。',
    favoriteFood: '蜜糖栗',
    primaryColor: '#d6a06c',
    accentColor: '#ffe082',
    shape: 'lantern-cub'
  },
  {
    spiritId: 'sparkmouse',
    name: '闪豆鼠',
    element: '电',
    rarity: '常见',
    habitat: '风车',
    catchRate: 0.75,
    description: '跑起来像一颗跳跳豆，耳朵会闪小亮点。',
    favoriteFood: '脆米球',
    primaryColor: '#78d6c6',
    accentColor: '#ffe66d',
    shape: 'spark-mouse'
  },
  {
    spiritId: 'bellvolt',
    name: '铃电猫',
    element: '电',
    rarity: '稀有',
    habitat: '风车',
    catchRate: 0.46,
    description: '走路会叮铃响，开心时能点亮一串小灯。',
    favoriteFood: '柠檬糖',
    primaryColor: '#9d9af2',
    accentColor: '#f4df62',
    shape: 'bell-volt'
  },
  {
    spiritId: 'pebbletot',
    name: '圆石仔',
    element: '土',
    rarity: '常见',
    habitat: '山洞',
    catchRate: 0.8,
    description: '看起来像小石头，其实很爱听故事。',
    favoriteFood: '芝麻饼',
    primaryColor: '#bba58c',
    accentColor: '#86c78a',
    shape: 'pebble-tot'
  },
  {
    spiritId: 'mudturtle',
    name: '泥壳龟',
    element: '土',
    rarity: '稀有',
    habitat: '山洞',
    catchRate: 0.52,
    description: '背上会长出小蘑菇，慢慢走也从不着急。',
    favoriteFood: '蘑菇包',
    primaryColor: '#8fb083',
    accentColor: '#d5b28d',
    shape: 'mud-turtle'
  },
  {
    spiritId: 'cloudchick',
    name: '云团啾',
    element: '风',
    rarity: '常见',
    habitat: '云台',
    catchRate: 0.77,
    description: '会把云朵揉成软软的坐垫，飞累了就躺上去。',
    favoriteFood: '棉花糖',
    primaryColor: '#bde9e5',
    accentColor: '#fff6c6',
    shape: 'cloud-chick'
  },
  {
    spiritId: 'kitehare',
    name: '风筝兔',
    element: '风',
    rarity: '稀有',
    habitat: '云台',
    catchRate: 0.44,
    description: '耳朵像小风筝，顺风时会轻轻飘起来。',
    favoriteFood: '苹果片',
    primaryColor: '#95d8cf',
    accentColor: '#ffb8be',
    shape: 'kite-hare'
  }
];

export const habitatNames = ['草丛', '池塘', '暖石', '风车', '山洞', '云台'] as const;
