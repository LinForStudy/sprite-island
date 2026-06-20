export type ElementType = '草' | '水' | '火' | '电' | '土' | '风';
export type Rarity = '常见' | '稀有' | '传奇' | '神话';
export type SkillType = 'physical' | 'magic' | 'heal';

export interface BattleStats {
  hp: number;
  power: number;
  defense: number;
  magic: number;
}

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  power: number;
  element?: ElementType;
  description: string;
}

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
  baseStats: BattleStats;
  growth: BattleStats;
  skills: Skill[];
}

export const rarityWeights: Record<Rarity, number> = {
  常见: 50,
  稀有: 30,
  传奇: 14,
  神话: 6
};

export const rarityLabels: Rarity[] = ['常见', '稀有', '传奇', '神话'];

const baseByRarity: Record<Rarity, BattleStats> = {
  常见: { hp: 34, power: 9, defense: 7, magic: 8 },
  稀有: { hp: 39, power: 11, defense: 9, magic: 10 },
  传奇: { hp: 45, power: 14, defense: 11, magic: 13 },
  神话: { hp: 52, power: 17, defense: 14, magic: 16 }
};

const growthByRarity: Record<Rarity, BattleStats> = {
  常见: { hp: 5, power: 2, defense: 1, magic: 2 },
  稀有: { hp: 6, power: 2, defense: 2, magic: 2 },
  传奇: { hp: 7, power: 3, defense: 2, magic: 3 },
  神话: { hp: 8, power: 3, defense: 3, magic: 3 }
};

const elementStatBias: Record<ElementType, Partial<BattleStats>> = {
  草: { hp: 4, defense: 1 },
  水: { hp: 2, magic: 2 },
  火: { power: 3, magic: 1 },
  电: { power: 2, magic: 2 },
  土: { hp: 3, defense: 3 },
  风: { power: 1, magic: 3 }
};

const elementSkill: Record<ElementType, { name: string; type: SkillType; power: number; description: string }> = {
  草: { name: '叶旋风', type: 'magic', power: 8, description: '卷起叶子攻击对手。' },
  水: { name: '泡泡冲', type: 'magic', power: 8, description: '用泡泡水流冲一下。' },
  火: { name: '暖光撞', type: 'physical', power: 9, description: '带着暖光向前撞击。' },
  电: { name: '小雷跳', type: 'magic', power: 9, description: '跳起一点点电光。' },
  土: { name: '圆石顶', type: 'physical', power: 8, description: '用结实的小身体顶过去。' },
  风: { name: '轻风刃', type: 'magic', power: 8, description: '甩出一道轻轻的风。' }
};

const normalSkillNames: Record<ElementType, string> = {
  草: '叶子拍',
  水: '水花拍',
  火: '暖爪拍',
  电: '闪闪拍',
  土: '石头拍',
  风: '羽毛拍'
};

const healerIds = new Set(['leafbun', 'bubblepup', 'lanterncub', 'cloudchick', 'bloomwhale', 'starjelly']);

function addStats(base: BattleStats, bias: Partial<BattleStats>): BattleStats {
  return {
    hp: base.hp + (bias.hp ?? 0),
    power: base.power + (bias.power ?? 0),
    defense: base.defense + (bias.defense ?? 0),
    magic: base.magic + (bias.magic ?? 0)
  };
}

function makeSkills(id: string, element: ElementType): Skill[] {
  const skills: Skill[] = [
    {
      id: `${id}-tap`,
      name: normalSkillNames[element],
      type: 'physical',
      power: 6,
      description: '最基础也最稳的一下。'
    }
  ];

  if (healerIds.has(id)) {
    skills.push({
      id: `${id}-heal`,
      name: element === '水' ? '清水抱抱' : '小小恢复',
      type: 'heal',
      power: 12,
      description: '恢复一点生命。'
    });
  } else {
    const skill = elementSkill[element];
    skills.push({
      id: `${id}-element`,
      name: skill.name,
      type: skill.type,
      power: skill.power,
      element,
      description: skill.description
    });
  }

  return skills;
}

function spirit(data: Omit<Spirit, 'baseStats' | 'growth' | 'skills'>): Spirit {
  return {
    ...data,
    baseStats: addStats(baseByRarity[data.rarity], elementStatBias[data.element]),
    growth: addStats(growthByRarity[data.rarity], elementStatBias[data.element]),
    skills: makeSkills(data.spiritId, data.element)
  };
}

export const spirits: Spirit[] = [
  spirit({ spiritId: 'leafbun', name: '叶团团', element: '草', rarity: '常见', habitat: '草丛', catchRate: 0.82, description: '喜欢把嫩叶当小被子，睡醒会轻轻摇尾巴。', favoriteFood: '露珠饼', primaryColor: '#7ed982', accentColor: '#fff1a8', shape: 'leaf-bun' }),
  spirit({ spiritId: 'sproutdeer', name: '芽角鹿', element: '草', rarity: '稀有', habitat: '草丛', catchRate: 0.55, description: '头上的小芽会跟着心情开合，开心时像一朵小花。', favoriteFood: '青草糖', primaryColor: '#9bd98b', accentColor: '#ffd7a8', shape: 'sprout-deer' }),
  spirit({ spiritId: 'vinerabbit', name: '藤耳兔', element: '草', rarity: '传奇', habitat: '草丛', catchRate: 0.28, description: '耳朵像两条会跳舞的藤蔓，能听见种子发芽的声音。', favoriteFood: '花蜜松饼', primaryColor: '#5fca72', accentColor: '#ffcf9d', shape: 'kite-hare' }),
  spirit({ spiritId: 'bloomwhale', name: '花眠鲸', element: '草', rarity: '神话', habitat: '草丛', catchRate: 0.16, description: '传说它睡着时，整片草地都会开出很小很小的花。', favoriteFood: '月光花蜜', primaryColor: '#8fe08a', accentColor: '#f9b4d2', shape: 'cloud-chick' }),
  spirit({ spiritId: 'bubblepup', name: '泡泡汪', element: '水', rarity: '常见', habitat: '池塘', catchRate: 0.78, description: '会把泡泡吹成小帽子，送给刚认识的朋友。', favoriteFood: '蓝莓冻', primaryColor: '#78c9ef', accentColor: '#c8f6ff', shape: 'bubble-pup' }),
  spirit({ spiritId: 'moonfish', name: '月鳍鱼', element: '水', rarity: '稀有', habitat: '池塘', catchRate: 0.5, description: '夜里游动时鳍边会发光，像水里的小月亮。', favoriteFood: '星星藻', primaryColor: '#83a7f2', accentColor: '#f8ed9b', shape: 'moon-fish' }),
  spirit({ spiritId: 'rainseal', name: '雨铃海豹', element: '水', rarity: '传奇', habitat: '池塘', catchRate: 0.26, description: '尾巴轻轻拍水时，会发出像小铃铛一样的雨声。', favoriteFood: '珍珠果冻', primaryColor: '#64bde8', accentColor: '#d7f7ff', shape: 'lantern-cub' }),
  spirit({ spiritId: 'starjelly', name: '星眠水母', element: '水', rarity: '神话', habitat: '池塘', catchRate: 0.14, description: '只在最安静的水面出现，身体里像藏着一小片星空。', favoriteFood: '银河冰沙', primaryColor: '#8ca5ff', accentColor: '#fff0a6', shape: 'moon-fish' }),
  spirit({ spiritId: 'emberfox', name: '暖尾狐', element: '火', rarity: '常见', habitat: '暖石', catchRate: 0.72, description: '尾巴像一盏小暖灯，冬天最爱围着朋友坐。', favoriteFood: '烤果子', primaryColor: '#ffb36d', accentColor: '#ffdf7c', shape: 'ember-fox' }),
  spirit({ spiritId: 'lanterncub', name: '灯绒熊', element: '火', rarity: '稀有', habitat: '暖石', catchRate: 0.48, description: '肚皮会发出柔柔的光，给迷路的人照路。', favoriteFood: '蜜糖栗', primaryColor: '#d6a06c', accentColor: '#ffe082', shape: 'lantern-cub' }),
  spirit({ spiritId: 'candlemoth', name: '烛翅蛾', element: '火', rarity: '传奇', habitat: '暖石', catchRate: 0.24, description: '翅膀像两片小火光，飞过的地方会留下暖暖的亮点。', favoriteFood: '焦糖麦片', primaryColor: '#ff8e6e', accentColor: '#ffe4a6', shape: 'cloud-chick' }),
  spirit({ spiritId: 'sunlion', name: '日冕狮', element: '火', rarity: '神话', habitat: '暖石', catchRate: 0.12, description: '据说它只在清晨第一束阳光照到暖石时醒来。', favoriteFood: '太阳莓', primaryColor: '#ff9d45', accentColor: '#fff08a', shape: 'sprout-deer' }),
  spirit({ spiritId: 'sparkmouse', name: '闪豆鼠', element: '电', rarity: '常见', habitat: '风车', catchRate: 0.75, description: '跑起来像一颗跳跳豆，耳朵会闪小亮点。', favoriteFood: '脆米球', primaryColor: '#78d6c6', accentColor: '#ffe66d', shape: 'spark-mouse' }),
  spirit({ spiritId: 'bellvolt', name: '铃电猫', element: '电', rarity: '稀有', habitat: '风车', catchRate: 0.46, description: '走路会叮铃响，开心时能点亮一串小灯。', favoriteFood: '柠檬糖', primaryColor: '#9d9af2', accentColor: '#f4df62', shape: 'bell-volt' }),
  spirit({ spiritId: 'coilowl', name: '线圈咕', element: '电', rarity: '传奇', habitat: '风车', catchRate: 0.23, description: '头顶的小线圈会跟着风车转动，发出很轻的嗡嗡声。', favoriteFood: '蜂蜜薄片', primaryColor: '#72c8d8', accentColor: '#fff06b', shape: 'cloud-chick' }),
  spirit({ spiritId: 'stormalpaca', name: '雷绒驼', element: '电', rarity: '神话', habitat: '风车', catchRate: 0.12, description: '身上的绒毛会储存微小的雷光，夜里像会移动的星云。', favoriteFood: '电气棉花糖', primaryColor: '#7fb6ff', accentColor: '#ffe85c', shape: 'lantern-cub' }),
  spirit({ spiritId: 'pebbletot', name: '圆石仔', element: '土', rarity: '常见', habitat: '山洞', catchRate: 0.8, description: '看起来像小石头，其实很爱听故事。', favoriteFood: '芝麻饼', primaryColor: '#bba58c', accentColor: '#86c78a', shape: 'pebble-tot' }),
  spirit({ spiritId: 'mudturtle', name: '泥壳龟', element: '土', rarity: '稀有', habitat: '山洞', catchRate: 0.52, description: '背上会长出小蘑菇，慢慢走也从不着急。', favoriteFood: '蘑菇包', primaryColor: '#8fb083', accentColor: '#d5b28d', shape: 'mud-turtle' }),
  spirit({ spiritId: 'crystalbadger', name: '晶鼻獾', element: '土', rarity: '传奇', habitat: '山洞', catchRate: 0.25, description: '鼻尖有一粒小晶石，能在黑黑的山洞里找到回家的路。', favoriteFood: '岩盐饼干', primaryColor: '#9d9a8f', accentColor: '#9fe5d7', shape: 'pebble-tot' }),
  spirit({ spiritId: 'mountainseed', name: '山心种', element: '土', rarity: '神话', habitat: '山洞', catchRate: 0.13, description: '传说它是一座小山做的梦，醒来时会长出新的石阶。', favoriteFood: '古树坚果', primaryColor: '#a78f72', accentColor: '#7ed982', shape: 'leaf-bun' }),
  spirit({ spiritId: 'cloudchick', name: '云团啾', element: '风', rarity: '常见', habitat: '云台', catchRate: 0.77, description: '会把云朵揉成软软的坐垫，飞累了就躺上去。', favoriteFood: '棉花糖', primaryColor: '#bde9e5', accentColor: '#fff6c6', shape: 'cloud-chick' }),
  spirit({ spiritId: 'kitehare', name: '风筝兔', element: '风', rarity: '稀有', habitat: '云台', catchRate: 0.44, description: '耳朵像小风筝，顺风时会轻轻飘起来。', favoriteFood: '苹果片', primaryColor: '#95d8cf', accentColor: '#ffb8be', shape: 'kite-hare' }),
  spirit({ spiritId: 'whistlecrane', name: '哨羽鹤', element: '风', rarity: '传奇', habitat: '云台', catchRate: 0.22, description: '羽毛会吹出短短的旋律，云台上的风都愿意跟着它转弯。', favoriteFood: '薄荷云糕', primaryColor: '#a7ddd9', accentColor: '#f8f0b2', shape: 'moon-fish' }),
  spirit({ spiritId: 'auroradrake', name: '极光小龙', element: '风', rarity: '神话', habitat: '云台', catchRate: 0.1, description: '尾巴扫过天空时，会留下一道很淡很淡的彩色风。', favoriteFood: '彩虹糖霜', primaryColor: '#86d8ff', accentColor: '#ffb7df', shape: 'ember-fox' }),
  spirit({ spiritId: 'mosscap', name: '苔帽菇', element: '草', rarity: '常见', habitat: '花林', catchRate: 0.8, description: '帽子像一小片湿润的苔藓，走路时会轻轻抖落花粉。', favoriteFood: '苔莓饼', primaryColor: '#77c978', accentColor: '#f3d58b', shape: 'moss-mushroom' }),
  spirit({ spiritId: 'bellleafdeer', name: '铃叶鹿', element: '草', rarity: '稀有', habitat: '花林', catchRate: 0.52, description: '叶铃角会随风轻响，能把迷路的朋友带回花林小路。', favoriteFood: '铃兰糖', primaryColor: '#93d47b', accentColor: '#ffe19a', shape: 'bell-leaf-deer' }),
  spirit({ spiritId: 'vinelampsnake', name: '藤灯蛇', element: '草', rarity: '传奇', habitat: '花林', catchRate: 0.25, description: '身体像柔软的藤环，尾端的小灯会在夜里慢慢发亮。', favoriteFood: '萤光花蜜', primaryColor: '#5fbf80', accentColor: '#fff08a', shape: 'vine-lantern-snake' }),
  spirit({ spiritId: 'forestkirin', name: '森梦麒麟', element: '草', rarity: '神话', habitat: '花林', catchRate: 0.12, description: '传说它从花林的梦里醒来，蹄印会长出细小嫩芽。', favoriteFood: '梦露果', primaryColor: '#7fd6a0', accentColor: '#ffc3d6', shape: 'forest-kirin' }),
  spirit({ spiritId: 'shelldoze', name: '贝壳悠', element: '水', rarity: '常见', habitat: '珊瑚湾', catchRate: 0.78, description: '喜欢躲在圆贝壳里打盹，只露出一双好奇的眼睛。', favoriteFood: '海盐奶冻', primaryColor: '#83d4ea', accentColor: '#f5d6b3', shape: 'shell-doze' }),
  spirit({ spiritId: 'waveporpoise', name: '浪尾豚', element: '水', rarity: '稀有', habitat: '珊瑚湾', catchRate: 0.5, description: '尾巴像一朵小浪花，开心时会在水面画圈圈。', favoriteFood: '泡泡西瓜', primaryColor: '#6fc6e9', accentColor: '#dff9ff', shape: 'wave-porpoise' }),
  spirit({ spiritId: 'pearlheron', name: '珍珠鹭', element: '水', rarity: '传奇', habitat: '珊瑚湾', catchRate: 0.24, description: '羽冠上挂着柔亮珍珠，低头时像月光落进浅湾。', favoriteFood: '珍珠米糕', primaryColor: '#a8e6ef', accentColor: '#fff1bf', shape: 'pearl-heron' }),
  spirit({ spiritId: 'tidewhale', name: '潮眠鲸', element: '水', rarity: '神话', habitat: '珊瑚湾', catchRate: 0.12, description: '睡着时会轻轻呼出潮声，整片海湾都跟着安静下来。', favoriteFood: '月潮冰沙', primaryColor: '#83bdf2', accentColor: '#d8fff5', shape: 'tide-whale' }),
  spirit({ spiritId: 'coalsprite', name: '炭团仔', element: '火', rarity: '常见', habitat: '熔灯台', catchRate: 0.74, description: '圆圆的小炭团总是暖乎乎的，脚边会跳出小火星。', favoriteFood: '烤棉糖', primaryColor: '#6b5b55', accentColor: '#ffb36d', shape: 'coal-sprite' }),
  spirit({ spiritId: 'warmhornsheep', name: '暖角羊', element: '火', rarity: '稀有', habitat: '熔灯台', catchRate: 0.48, description: '卷卷角像两盏小暖灯，靠近就像晒到午后的太阳。', favoriteFood: '蜂蜜烤梨', primaryColor: '#e0a56f', accentColor: '#ffe08b', shape: 'warm-horn-sheep' }),
  spirit({ spiritId: 'embersparrow', name: '火绒雀', element: '火', rarity: '传奇', habitat: '熔灯台', catchRate: 0.23, description: '翅膀边缘像柔软火绒，飞过时会落下橘色光点。', favoriteFood: '焦糖米花', primaryColor: '#ff8f6d', accentColor: '#ffe59c', shape: 'ember-sparrow' }),
  spirit({ spiritId: 'redcloudkirin', name: '赤霞麒', element: '火', rarity: '神话', habitat: '熔灯台', catchRate: 0.11, description: '鬃毛像清晨赤霞，奔跑时会把石阶照得暖亮。', favoriteFood: '霞光莓', primaryColor: '#ff9a68', accentColor: '#fff18a', shape: 'red-cloud-kirin' }),
  spirit({ spiritId: 'magnetbean', name: '磁豆仔', element: '电', rarity: '常见', habitat: '星磁塔', catchRate: 0.76, description: '小小豆身会被磁石吸来吸去，转圈时还会笑。', favoriteFood: '脆星豆', primaryColor: '#6ed2cc', accentColor: '#ffe66d', shape: 'magnet-bean' }),
  spirit({ spiritId: 'bluevoltfox', name: '蓝电狐', element: '电', rarity: '稀有', habitat: '星磁塔', catchRate: 0.47, description: '耳尖闪着蓝紫电花，喜欢沿着塔影轻快奔跑。', favoriteFood: '蓝莓雷糖', primaryColor: '#6da8ff', accentColor: '#bfa7ff', shape: 'blue-volt-fox' }),
  spirit({ spiritId: 'starwirecrane', name: '星线鹤', element: '电', rarity: '传奇', habitat: '星磁塔', catchRate: 0.22, description: '细长星线绕着羽毛转动，像把夜空缝成温柔的图案。', favoriteFood: '星砂薄饼', primaryColor: '#88d8f2', accentColor: '#fff06b', shape: 'starwire-crane' }),
  spirit({ spiritId: 'aurorathunderdeer', name: '极光雷鹿', element: '电', rarity: '神话', habitat: '星磁塔', catchRate: 0.1, description: '角上流动着淡淡极光，只有星磁塔最安静时才出现。', favoriteFood: '极光棉糖', primaryColor: '#88b7ff', accentColor: '#ffb7df', shape: 'aurora-thunder-deer' }),
  spirit({ spiritId: 'sandcookie', name: '沙饼兽', element: '土', rarity: '常见', habitat: '化石坡', catchRate: 0.8, description: '身体像一块圆沙饼，晒太阳时会散发香香的麦味。', favoriteFood: '芝麻沙饼', primaryColor: '#d2b78e', accentColor: '#f3dfb1', shape: 'sand-cookie' }),
  spirit({ spiritId: 'shellbackrhino', name: '壳背犀', element: '土', rarity: '稀有', habitat: '化石坡', catchRate: 0.5, description: '背壳像小山坡，跑得不快但一步一步特别可靠。', favoriteFood: '岩麦包', primaryColor: '#b7a084', accentColor: '#86c78a', shape: 'shellback-rhino' }),
  spirit({ spiritId: 'amberlizard', name: '琥珀蜥', element: '土', rarity: '传奇', habitat: '化石坡', catchRate: 0.24, description: '尾尖藏着一滴琥珀光，趴在石头上像旧故事发亮。', favoriteFood: '蜂蜜岩糖', primaryColor: '#c49a63', accentColor: '#ffcc6e', shape: 'amber-lizard' }),
  spirit({ spiritId: 'ancientrockwhale', name: '古岩鲸', element: '土', rarity: '神话', habitat: '化石坡', catchRate: 0.11, description: '它慢慢翻身时，身上的岩纹像古老地图一样展开。', favoriteFood: '古盐坚果', primaryColor: '#9f8f78', accentColor: '#cfe6b2', shape: 'ancient-rock-whale' }),
  spirit({ spiritId: 'cloudfluffrabbit', name: '绒云兔', element: '风', rarity: '常见', habitat: '彩云桥', catchRate: 0.77, description: '耳朵软得像云朵，跳起来会留下短短的白色尾迹。', favoriteFood: '云朵饼干', primaryColor: '#bfe9e5', accentColor: '#fff6c6', shape: 'cloudfluff-rabbit' }),
  spirit({ spiritId: 'ribbonsparrow', name: '飘带雀', element: '风', rarity: '稀有', habitat: '彩云桥', catchRate: 0.46, description: '尾羽像两条小飘带，飞过彩云桥时会打漂亮的结。', favoriteFood: '薄荷果片', primaryColor: '#9fded8', accentColor: '#ffb8be', shape: 'ribbon-sparrow' }),
  spirit({ spiritId: 'windbelldeer', name: '风铃鹿', element: '风', rarity: '传奇', habitat: '彩云桥', catchRate: 0.22, description: '角上挂着透明风铃，走一步就响起清清亮亮的风声。', favoriteFood: '清风梨冻', primaryColor: '#a6ddd6', accentColor: '#f8f0b2', shape: 'windbell-deer' }),
  spirit({ spiritId: 'rainbowwingdrake', name: '虹翼龙', element: '风', rarity: '神话', habitat: '彩云桥', catchRate: 0.1, description: '彩色小翼会在云边展开，像把一段彩虹轻轻托住。', favoriteFood: '虹糖霜', primaryColor: '#86d8ff', accentColor: '#ffb7df', shape: 'rainbow-wing-drake' })
];

export const habitatNames = ['草丛', '池塘', '暖石', '风车', '山洞', '云台', '花林', '珊瑚湾', '熔灯台', '星磁塔', '化石坡', '彩云桥'] as const;
