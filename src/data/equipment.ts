import type { ElementType, BattleStats } from './spirits';

export type EquipmentSlot = 'weapon' | 'armor' | 'charm' | 'boots';
export type EquipmentRarity = '普通' | '精良' | '稀有' | '传说';
export type EquipmentEffect = 'element_damage' | 'heal_boost' | 'exp_boost';

export interface Equipment {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: EquipmentRarity;
  element?: ElementType;
  statBonus: Partial<BattleStats>;
  effect?: EquipmentEffect;
  effectValue?: number;
  description: string;
}

export type EquipmentSlots = Record<EquipmentSlot, string>;

export const equipmentSlots: EquipmentSlot[] = ['weapon', 'armor', 'charm', 'boots'];

export const slotLabels: Record<EquipmentSlot, string> = {
  weapon: '武器',
  armor: '护甲',
  charm: '护符',
  boots: '鞋子'
};

export const equipmentRarityWeights: Record<EquipmentRarity, number> = {
  普通: 58,
  精良: 28,
  稀有: 11,
  传说: 3
};

const rarityBonus = {
  普通: 1,
  精良: 2,
  稀有: 3,
  传说: 4
} satisfies Record<EquipmentRarity, number>;

export function emptyEquipmentSlots(): EquipmentSlots {
  return {
    weapon: '',
    armor: '',
    charm: '',
    boots: ''
  };
}

function makeEquipment(data: Omit<Equipment, 'id'>): Equipment {
  const elementKey = data.element ? `-${data.element}` : '';
  return {
    ...data,
    id: `${data.slot}-${data.rarity}-${data.name}${elementKey}`
  };
}

export const equipmentCatalog: Equipment[] = [
  makeEquipment({ name: '嫩枝短杖', slot: 'weapon', rarity: '普通', element: '草', statBonus: { magic: 4 }, effect: 'element_damage', effectValue: 0.06, description: '让草系招式更有精神。' }),
  makeEquipment({ name: '水纹小叉', slot: 'weapon', rarity: '普通', element: '水', statBonus: { magic: 4 }, effect: 'element_damage', effectValue: 0.06, description: '带着小小水纹的武器。' }),
  makeEquipment({ name: '暖光木剑', slot: 'weapon', rarity: '普通', element: '火', statBonus: { power: 4 }, effect: 'element_damage', effectValue: 0.06, description: '挥起来有暖暖亮光。' }),
  makeEquipment({ name: '闪星短杖', slot: 'weapon', rarity: '精良', element: '电', statBonus: { magic: 7, power: 2 }, effect: 'element_damage', effectValue: 0.1, description: '让电光跳得更远。' }),
  makeEquipment({ name: '圆石手锤', slot: 'weapon', rarity: '精良', element: '土', statBonus: { power: 7, defense: 1 }, effect: 'element_damage', effectValue: 0.1, description: '沉甸甸但很好握。' }),
  makeEquipment({ name: '轻风铃杖', slot: 'weapon', rarity: '稀有', element: '风', statBonus: { magic: 10, power: 3 }, effect: 'element_damage', effectValue: 0.14, description: '风会顺着铃声跑出去。' }),
  makeEquipment({ name: '星糖勇者剑', slot: 'weapon', rarity: '传说', statBonus: { power: 12, magic: 12 }, effect: 'element_damage', effectValue: 0.18, description: '适合任何萌灵的闪亮武器。' }),

  makeEquipment({ name: '软叶背心', slot: 'armor', rarity: '普通', statBonus: { hp: 16, defense: 3 }, description: '轻轻软软的护甲。' }),
  makeEquipment({ name: '泡泡外套', slot: 'armor', rarity: '精良', statBonus: { hp: 24, defense: 5, magic: 1 }, description: '像泡泡一样缓冲攻击。' }),
  makeEquipment({ name: '暖石铠衣', slot: 'armor', rarity: '稀有', statBonus: { hp: 34, defense: 8 }, description: '穿上以后特别稳。' }),
  makeEquipment({ name: '星云披风', slot: 'armor', rarity: '传说', statBonus: { hp: 48, defense: 11, magic: 3 }, description: '像夜空一样保护萌灵。' }),

  makeEquipment({ name: '小芽护符', slot: 'charm', rarity: '普通', element: '草', statBonus: { hp: 8, magic: 2 }, effect: 'heal_boost', effectValue: 0.08, description: '恢复技能会更温柔。' }),
  makeEquipment({ name: '清水护符', slot: 'charm', rarity: '精良', element: '水', statBonus: { hp: 10, magic: 4 }, effect: 'heal_boost', effectValue: 0.12, description: '适合会照顾伙伴的萌灵。' }),
  makeEquipment({ name: '雷光护符', slot: 'charm', rarity: '稀有', element: '电', statBonus: { power: 3, magic: 6 }, effect: 'element_damage', effectValue: 0.14, description: '属性招式更容易打出亮点。' }),
  makeEquipment({ name: '成长星章', slot: 'charm', rarity: '传说', statBonus: { hp: 12, power: 5, magic: 5 }, effect: 'exp_boost', effectValue: 0.15, description: '胜利后获得更多经验。' }),

  makeEquipment({ name: '棉云鞋', slot: 'boots', rarity: '普通', statBonus: { hp: 8, defense: 2 }, description: '走起来轻飘飘。' }),
  makeEquipment({ name: '踏浪鞋', slot: 'boots', rarity: '精良', element: '水', statBonus: { hp: 12, magic: 3 }, description: '像踩在小水花上。' }),
  makeEquipment({ name: '暖风靴', slot: 'boots', rarity: '稀有', element: '风', statBonus: { hp: 16, defense: 3, magic: 4 }, description: '动作更轻快。' }),
  makeEquipment({ name: '星尘长靴', slot: 'boots', rarity: '传说', statBonus: { hp: 24, defense: 5, power: 4, magic: 4 }, description: '留下闪闪的脚印。' })
];

export function equipmentById(equipmentId: string) {
  return equipmentCatalog.find((item) => item.id === equipmentId) ?? null;
}

function pickWeighted<T>(items: Array<{ item: T; weight: number }>) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const entry of items) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return items[0].item;
}

export function rollEquipmentRarity(enemyLevel: number): EquipmentRarity {
  const levelBonus = enemyLevel >= 15 ? 1.5 : enemyLevel >= 8 ? 1.2 : 1;
  return pickWeighted(Object.entries(equipmentRarityWeights).map(([rarity, weight]) => ({
    item: rarity as EquipmentRarity,
    weight: rarity === '稀有' || rarity === '传说' ? weight * levelBonus : weight
  })));
}

export function rollEquipmentDrop(enemyLevel: number, enemyRarity: string): Equipment | null {
  const rarityDropBonus: Record<string, number> = {
    常见: 0,
    稀有: 0.1,
    传奇: 0.18,
    神话: 0.25
  };
  const dropRate = Math.min(0.85, 0.35 + (rarityDropBonus[enemyRarity] ?? 0));
  if (Math.random() > dropRate) return null;

  const rarity = rollEquipmentRarity(enemyLevel);
  const candidates = equipmentCatalog.filter((item) => item.rarity === rarity);
  return candidates[Math.floor(Math.random() * candidates.length)] ?? equipmentCatalog[0];
}

export function equipmentPowerScore(equipment: Equipment) {
  const stats = equipment.statBonus;
  const statScore = (stats.hp ?? 0) * 0.35 + (stats.power ?? 0) * 2 + (stats.defense ?? 0) * 1.5 + (stats.magic ?? 0) * 2;
  return Math.round(statScore + rarityBonus[equipment.rarity] * 4);
}
