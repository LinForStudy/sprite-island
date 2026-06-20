import type { ElementType, Rarity, Spirit, BattleStats, Skill } from './spirits';

export const maxLevel = 20;

const advantage: Record<ElementType, ElementType> = {
  草: '土',
  土: '电',
  电: '水',
  水: '火',
  火: '风',
  风: '草'
};

export const rarityExpBonus: Record<Rarity, number> = {
  常见: 4,
  稀有: 10,
  传奇: 18,
  神话: 28
};

export const rarityExpNeedMultiplier: Record<Rarity, number> = {
  常见: 1,
  稀有: 1.12,
  传奇: 1.28,
  神话: 1.45
};

export function elementMultiplier(attacker: ElementType, defender: ElementType): number {
  if (attacker === defender) return 1;
  if (advantage[attacker] === defender) return 1.5;
  if (advantage[defender] === attacker) return 0.75;
  return 1;
}

export function getStats(spirit: Spirit, level: number): BattleStats {
  const extraLevels = Math.max(0, level - 1);
  return {
    hp: spirit.baseStats.hp + spirit.growth.hp * extraLevels,
    power: spirit.baseStats.power + spirit.growth.power * extraLevels,
    defense: spirit.baseStats.defense + spirit.growth.defense * extraLevels,
    magic: spirit.baseStats.magic + spirit.growth.magic * extraLevels
  };
}

export function expToNext(level: number, rarity: Rarity): number {
  if (level >= maxLevel) return 0;
  return Math.round(level * 30 * rarityExpNeedMultiplier[rarity]);
}

export function expReward(enemyLevel: number, enemyRarity: Rarity): number {
  return enemyLevel * 12 + rarityExpBonus[enemyRarity];
}

export function calculateSkillResult(params: {
  attacker: Spirit;
  attackerLevel: number;
  defender: Spirit;
  defenderLevel: number;
  defenderHp: number;
  attackerHp: number;
  skill: Skill;
  attackerStats?: BattleStats;
  defenderStats?: BattleStats;
  damageBonusRate?: number;
  healBonusRate?: number;
}): { damage: number; heal: number; multiplier: number; nextDefenderHp: number; nextAttackerHp: number } {
  const attackerStats = params.attackerStats ?? getStats(params.attacker, params.attackerLevel);
  const defenderStats = params.defenderStats ?? getStats(params.defender, params.defenderLevel);
  const attackerMaxHp = attackerStats.hp;

  if (params.skill.type === 'heal') {
    const baseHeal = params.skill.power + Math.floor(attackerStats.magic * 0.55);
    const boostedHeal = Math.round(baseHeal * (1 + (params.healBonusRate ?? 0)));
    const heal = Math.min(attackerMaxHp - params.attackerHp, boostedHeal);
    return {
      damage: 0,
      heal,
      multiplier: 1,
      nextDefenderHp: params.defenderHp,
      nextAttackerHp: Math.min(attackerMaxHp, params.attackerHp + heal)
    };
  }

  const rawDamage = params.skill.type === 'physical'
    ? Math.max(1, attackerStats.power + params.skill.power - defenderStats.defense)
    : Math.max(1, attackerStats.magic + params.skill.power - Math.floor(defenderStats.defense * 0.6));
  const multiplier = elementMultiplier(params.skill.element ?? params.attacker.element, params.defender.element);
  const damage = Math.max(1, Math.round(rawDamage * multiplier * (1 + (params.damageBonusRate ?? 0))));

  return {
    damage,
    heal: 0,
    multiplier,
    nextDefenderHp: Math.max(0, params.defenderHp - damage),
    nextAttackerHp: params.attackerHp
  };
}
