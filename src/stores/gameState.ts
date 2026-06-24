import { computed, reactive } from 'vue';
import { calculateSkillResult, elementMultiplier, expReward, expToNext, getStats, maxLevel } from '../data/battle';
import { equipmentById, emptyEquipmentSlots, equipmentPowerScore, rollEquipmentDrop, type Equipment, type EquipmentSlot, type EquipmentSlots } from '../data/equipment';
import { rarityWeights, spirits, type BattleStats, type ElementType, type Skill, type Spirit } from '../data/spirits';

type ViewName = 'map' | 'encounter' | 'dex' | 'home' | 'battlePrep' | 'battle' | 'battleResult' | 'spiritDetail';
export type CaptureResult = 'captured' | 'already' | 'failed' | 'none';
export type BattleStatus = 'idle' | 'active' | 'won' | 'lost';
export type BattleCaptureStatus = 'locked' | 'idle' | 'drawing' | 'ready' | 'capturing' | 'captured' | 'failed' | 'already';
type BattleCondition = '' | 'burn' | 'wet' | 'vine' | 'zap' | 'armor' | 'swift';
type EnemyTemperament = '莽撞型' | '胆小型' | '聪明型' | '治疗型' | '暴走型';

interface BattleCaptureBall {
  id: string;
  name: string;
  tier: string;
  color: string;
  multiplier: number;
  weight: number;
}

export interface PetState {
  affection: number;
  hunger: number;
  cleanliness: number;
  mood: string;
  level?: number;
  exp?: number;
  currentHp?: number;
  equipment?: EquipmentSlots;
}

export interface SaveData {
  version: number;
  lastSavedAt: string;
  playCount: number;
  discovered: Record<string, true>;
  captured: Record<string, PetState>;
  explorationStreak: Record<string, number>;
  inventory: {
    equipment: string[];
  };
}

export interface EquipmentInstance {
  instanceId: string;
  equipmentId: string;
  index: number;
  equipment: Equipment;
  equippedBy: string;
  equippedByName: string;
}

interface BattleState {
  status: BattleStatus;
  habitat: string;
  playerId: string;
  enemyId: string;
  enemyLevel: number;
  enemyHp: number;
  playerEnergy: number;
  combo: number;
  playerGuardTurns: number;
  enemyCondition: BattleCondition;
  enemyConditionTurns: number;
  enemyTemperament: EnemyTemperament;
  log: string[];
}

interface BattleResultState {
  status: BattleStatus;
  playerName: string;
  playerLevel: number;
  playerHp: number;
  playerMaxHp: number;
  enemyName: string;
  enemyLevel: number;
  enemySpiritId: string;
  expGained: number;
  levelMessages: string[];
  equipmentDropName: string;
  equipmentDropRarity: string;
  captureEligible: boolean;
  captureAlreadyOwned: boolean;
  captureStatus: BattleCaptureStatus;
  captureBallName: string;
  captureBallTier: string;
  captureBallColor: string;
  captureBallMultiplier: number;
  captureChance: number;
  captureAttempted: boolean;
  captureMessage: string;
  message: string;
  returnTarget: 'map';
}

const storageKey = 'sprite-island-save-v1';
const backupStorageKey = 'sprite-island-save-v1-backup';
const preResetBackupKey = 'sprite-island-save-v1-pre-reset-backup';
const saveVersion = 2;
const battleCaptureBalls: BattleCaptureBall[] = [
  { id: 'star', name: '星糖球', tier: '普通', color: 'star', multiplier: 1, weight: 48 },
  { id: 'pink', name: '粉晶球', tier: '精良', color: 'pink', multiplier: 1.25, weight: 30 },
  { id: 'gold', name: '金光球', tier: '稀有', color: 'gold', multiplier: 1.55, weight: 16 },
  { id: 'rainbow', name: '彩虹球', tier: '传说', color: 'rainbow', multiplier: 1.85, weight: 6 }
];
const pityThreshold = 12;
const undiscoveredBoost = 3;

const defaultSave = (): SaveData => ({
  version: saveVersion,
  lastSavedAt: new Date().toISOString(),
  playCount: 0,
  discovered: {},
  captured: {},
  explorationStreak: {},
  inventory: { equipment: [] }
});

const defaultBattleResult = (): BattleResultState => ({
  status: 'idle',
  playerName: '',
  playerLevel: 1,
  playerHp: 0,
  playerMaxHp: 0,
  enemyName: '',
  enemyLevel: 1,
  enemySpiritId: '',
  expGained: 0,
  levelMessages: [],
  equipmentDropName: '',
  equipmentDropRarity: '',
  captureEligible: false,
  captureAlreadyOwned: false,
  captureStatus: 'locked',
  captureBallName: '',
  captureBallTier: '',
  captureBallColor: '',
  captureBallMultiplier: 1,
  captureChance: 0,
  captureAttempted: false,
  captureMessage: '',
  message: '',
  returnTarget: 'map'
});

function normalizeSaveData(parsed: Partial<SaveData>): SaveData {
  return {
    version: saveVersion,
    lastSavedAt: parsed.lastSavedAt ?? new Date().toISOString(),
    playCount: Math.max(0, parsed.playCount ?? 0),
    discovered: parsed.discovered ?? {},
    captured: parsed.captured ?? {},
    explorationStreak: parsed.explorationStreak ?? {},
    inventory: { equipment: parsed.inventory?.equipment ?? [] }
  };
}

function hasSaveProgress(saveData: SaveData) {
  return Object.keys(saveData.discovered).length > 0 || Object.keys(saveData.captured).length > 0 || saveData.inventory.equipment.length > 0;
}

function parseStoredSave(raw: string | null) {
  if (!raw) return null;
  const parsed = JSON.parse(raw) as Partial<SaveData>;
  return normalizeSaveData(parsed);
}

function readStoredSave(key: string) {
  try {
    return parseStoredSave(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function writeStoredSave(key: string, saveData: SaveData) {
  localStorage.setItem(key, JSON.stringify(saveData));
}
function saveSnapshot(saveData: SaveData): SaveData {
  return {
    ...saveData,
    version: saveVersion,
    lastSavedAt: new Date().toISOString(),
    inventory: { equipment: [...(saveData.inventory?.equipment ?? [])] }
  };
}

function backupCurrentPrimary() {
  const current = readStoredSave(storageKey);
  if (current && hasSaveProgress(current)) writeStoredSave(backupStorageKey, current);
}

function isImportCandidate(value: unknown): value is Partial<SaveData> {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<SaveData>;
  return Boolean(candidate.discovered || candidate.captured || candidate.inventory || candidate.explorationStreak);
}

function recoverSaveData(saveData: SaveData, message: string) {
  state.save = normalizeSaveData(saveData);
  normalizeAllPets();
  state.encounter = null;
  state.battle.status = 'idle';
  state.battlePrep.habitat = '';
  state.battlePrep.selectedId = '';
  state.battleResult = defaultBattleResult();
  state.message = message;
  state.view = 'map';
  save();
}

function loadSaveWithRecovery() {
  const primary = readStoredSave(storageKey);
  if (primary) {
    if (hasSaveProgress(primary)) primary.playCount += 1;
    return { save: primary, message: hasSaveProgress(primary) ? '欢迎回来，已经读取到上次的存档。' : '欢迎来到萌灵小岛。点一点小岛，看看今天会遇见谁。' };
  }

  const backup = readStoredSave(backupStorageKey) ?? readStoredSave(preResetBackupKey);
  if (backup && hasSaveProgress(backup)) {
    backup.playCount += 1;
    writeStoredSave(storageKey, backup);
    return { save: backup, message: '发现备份存档，已经帮你恢复回来。' };
  }

  return { save: defaultSave(), message: '没有读到旧存档。如果换过网址或浏览器，可以用“导入存档”恢复。' };
}

function habitatSpirits(habitat: string) {
  return spirits.filter((spirit) => spirit.habitat === habitat);
}

function undiscoveredInHabitat(habitat: string) {
  return habitatSpirits(habitat).filter((spirit) => !state.save.discovered[spirit.spiritId]);
}

function pickWeightedSpirit(candidates: Spirit[]): Spirit {
  const weighted = candidates.map((spirit) => {
    const isUndiscovered = !state.save.discovered[spirit.spiritId];
    return {
      spirit,
      weight: rarityWeights[spirit.rarity] * (isUndiscovered ? undiscoveredBoost : 1)
    };
  });

  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.spirit;
  }

  return candidates[0] ?? spirits[0];
}

function spiritById(spiritId: string) {
  return spirits.find((spirit) => spirit.spiritId === spiritId) ?? spirits[0];
}

function clampLevel(level: number) {
  return Math.min(maxLevel, Math.max(1, Math.floor(level)));
}

function addStats(base: BattleStats, bonus: Partial<BattleStats>): BattleStats {
  return {
    hp: base.hp + (bonus.hp ?? 0),
    power: base.power + (bonus.power ?? 0),
    defense: base.defense + (bonus.defense ?? 0),
    magic: base.magic + (bonus.magic ?? 0)
  };
}

function equipmentIdFromInstance(instanceId: string) {
  const at = instanceId.lastIndexOf('@');
  return at >= 0 ? instanceId.slice(0, at) : instanceId;
}

function equipmentIndexFromInstance(instanceId: string) {
  const at = instanceId.lastIndexOf('@');
  if (at < 0) return -1;
  const index = Number(instanceId.slice(at + 1));
  return Number.isFinite(index) ? index : -1;
}

function makeEquipmentInstanceId(equipmentId: string, index: number) {
  return `${equipmentId}@${index}`;
}

function equipmentByInstanceId(instanceId: string) {
  return equipmentById(equipmentIdFromInstance(instanceId));
}

function equipmentForPet(spiritId: string) {
  const pet = state.save.captured[spiritId];
  if (!pet) return [];
  const slots = pet.equipment ?? emptyEquipmentSlots();
  return Object.values(slots).map((instanceId) => equipmentByInstanceId(instanceId)).filter((item): item is Equipment => Boolean(item));
}

function equipmentInstancesInternal(): EquipmentInstance[] {
  const equippedMap = new Map<string, string>();
  for (const [spiritId, pet] of Object.entries(state.save.captured)) {
    const slots = pet.equipment ?? emptyEquipmentSlots();
    for (const instanceId of Object.values(slots)) if (instanceId) equippedMap.set(instanceId, spiritId);
  }
  return (state.save.inventory?.equipment ?? []).map((equipmentId, index) => {
    const equipment = equipmentById(equipmentId);
    if (!equipment) return null;
    const instanceId = makeEquipmentInstanceId(equipmentId, index);
    const equippedBy = equippedMap.get(instanceId) ?? '';
    return { instanceId, equipmentId, index, equipment, equippedBy, equippedByName: equippedBy ? spiritById(equippedBy).name : '' };
  }).filter((item): item is EquipmentInstance => Boolean(item));
}

function firstAvailableInstanceId(equipmentId: string, preferredSpiritId = '') {
  const used = new Set<string>();
  for (const [spiritId, pet] of Object.entries(state.save.captured)) {
    if (spiritId === preferredSpiritId) continue;
    for (const instanceId of Object.values(pet.equipment ?? emptyEquipmentSlots())) if (instanceId) used.add(instanceId);
  }
  const instances = equipmentInstancesInternal().filter((instance) => instance.equipmentId === equipmentId);
  return instances.find((instance) => !used.has(instance.instanceId))?.instanceId ?? '';
}

function equipmentStatBonus(spiritId: string): BattleStats {
  return equipmentForPet(spiritId).reduce<BattleStats>((total, equipment) => addStats(total, equipment.statBonus), { hp: 0, power: 0, defense: 0, magic: 0 });
}

function equipmentDamageBonus(spiritId: string, skill: Skill) {
  const element = skill.element ?? spiritById(spiritId).element;
  return equipmentForPet(spiritId).reduce((sum, equipment) => {
    if (equipment.effect !== 'element_damage') return sum;
    if (equipment.element && equipment.element !== element) return sum;
    return sum + (equipment.effectValue ?? 0);
  }, 0);
}

function equipmentHealBonus(spiritId: string) {
  return equipmentForPet(spiritId).reduce((sum, equipment) => equipment.effect === 'heal_boost' ? sum + (equipment.effectValue ?? 0) : sum, 0);
}

function equipmentExpBonus(spiritId: string) {
  return equipmentForPet(spiritId).reduce((sum, equipment) => equipment.effect === 'exp_boost' ? sum + (equipment.effectValue ?? 0) : sum, 0);
}

function getPetBattleStatsInternal(spiritId: string): BattleStats {
  const spirit = spiritById(spiritId);
  const pet = state.save.captured[spiritId];
  const level = pet?.level ?? 1;
  return addStats(getStats(spirit, level), equipmentStatBonus(spiritId));
}

function normalizePet(spiritId: string): PetState {
  const pet = state.save.captured[spiritId];
  const level = clampLevel(pet.level ?? 1);
  pet.level = level;
  pet.exp = Math.max(0, pet.exp ?? 0);
  pet.equipment = { ...emptyEquipmentSlots(), ...(pet.equipment ?? {}) };
  const maxHp = getPetBattleStatsInternal(spiritId).hp;
  pet.currentHp = Math.min(maxHp, Math.max(0, pet.currentHp ?? maxHp));
  return pet;
}

function normalizeEquipmentAssignments() {
  let changed = false;
  const used = new Set<string>();
  for (const spiritId of Object.keys(state.save.captured)) {
    const pet = state.save.captured[spiritId];
    pet.equipment = { ...emptyEquipmentSlots(), ...(pet.equipment ?? {}) };
    for (const slot of Object.keys(pet.equipment) as EquipmentSlot[]) {
      const raw = pet.equipment[slot];
      if (!raw) continue;
      let instanceId = raw.includes('@') ? raw : firstAvailableInstanceId(raw, spiritId);
      if (!instanceId || used.has(instanceId) || !equipmentByInstanceId(instanceId)) {
        pet.equipment[slot] = '';
        changed = true;
        continue;
      }
      if (instanceId !== raw) changed = true;
      pet.equipment[slot] = instanceId;
      used.add(instanceId);
    }
  }
  if (changed && state.message) state.message = '已整理重复穿戴装备，同一件装备只能给一只萌灵穿。';
  return changed;
}

function normalizeAllPets() {
  state.save.inventory = { equipment: state.save.inventory?.equipment ?? [] };
  normalizeEquipmentAssignments();
  for (const spiritId of Object.keys(state.save.captured)) normalizePet(spiritId);
}

function bestAvailableFighterId() {
  normalizeAllPets();
  return Object.keys(state.save.captured)
    .filter((spiritId) => (state.save.captured[spiritId].currentHp ?? 0) > 0)
    .sort((a, b) => {
      const petA = state.save.captured[a];
      const petB = state.save.captured[b];
      return (petB.level ?? 1) - (petA.level ?? 1) || getPetBattleStatsInternal(b).hp - getPetBattleStatsInternal(a).hp;
    })[0] ?? '';
}

function pickNumber(values: number[]) {
  return values[Math.floor(Math.random() * values.length)] ?? 0;
}

function equipmentScoreFor(spiritId: string) {
  return equipmentForPet(spiritId).reduce((sum, equipment) => sum + equipmentPowerScore(equipment), 0);
}

function enemyLevelFor(playerLevel: number, playerId: string) {
  const score = equipmentScoreFor(playerId);
  if (score >= 95) return clampLevel(playerLevel + pickNumber([2, 2, 3]));
  if (score >= 70) return clampLevel(playerLevel + pickNumber([1, 1, 2]));
  if (score >= 40) return clampLevel(playerLevel + pickNumber([0, 1]));
  if (score >= 18) return clampLevel(playerLevel + pickNumber([-1, 0, 1]));
  return clampLevel(playerLevel + pickNumber([-1, 0]));
}

function levelUpIfNeeded(spiritId: string) {
  const spirit = spiritById(spiritId);
  const pet = normalizePet(spiritId);
  const messages: string[] = [];

  while ((pet.level ?? 1) < maxLevel) {
    const need = expToNext(pet.level ?? 1, spirit.rarity);
    if ((pet.exp ?? 0) < need) break;
    pet.exp = (pet.exp ?? 0) - need;
    pet.level = (pet.level ?? 1) + 1;
    pet.currentHp = getPetBattleStatsInternal(spiritId).hp;
    messages.push(`${spirit.name}升到 ${pet.level} 级！`);
  }

  return messages;
}

function rollBattleCaptureBall() {
  const total = battleCaptureBalls.reduce((sum, ball) => sum + ball.weight, 0);
  let roll = Math.random() * total;
  for (const ball of battleCaptureBalls) {
    roll -= ball.weight;
    if (roll <= 0) return ball;
  }
  return battleCaptureBalls[0];
}

function battleCaptureChance(enemy: Spirit, ball: BattleCaptureBall) {
  const levelGap = Math.max(0, state.battle.enemyLevel - (state.battleResult.playerLevel || 1));
  const winBonus = 0.18;
  const challengeBonus = Math.min(0.1, levelGap * 0.035);
  const chance = enemy.catchRate * ball.multiplier + winBonus + challengeBonus;
  return Math.max(0.12, Math.min(0.92, Number(chance.toFixed(2))));
}

function capturePetFromBattle(enemy: Spirit) {
  state.save.discovered[enemy.spiritId] = true;
  state.save.captured[enemy.spiritId] = {
    affection: 32,
    hunger: 72,
    cleanliness: 70,
    mood: '信任',
    level: 1,
    exp: 0,
    currentHp: getStats(enemy, 1).hp,
    equipment: emptyEquipmentSlots()
  };
}
function setBattleResult(status: BattleStatus, player: Spirit, enemy: Spirit, expGained: number, levelMessages: string[], equipmentDrop: Equipment | null) {
  const pet = normalizePet(player.spiritId);
  const stats = getPetBattleStatsInternal(player.spiritId);
  const alreadyOwned = Boolean(state.save.captured[enemy.spiritId]);
  const canCapture = status === 'won' && !alreadyOwned;
  state.battleResult = {
    status,
    playerName: player.name,
    playerLevel: pet.level ?? 1,
    playerHp: pet.currentHp ?? 0,
    playerMaxHp: stats.hp,
    enemyName: enemy.name,
    enemyLevel: state.battle.enemyLevel,
    enemySpiritId: enemy.spiritId,
    expGained,
    levelMessages,
    equipmentDropName: equipmentDrop?.name ?? '',
    equipmentDropRarity: equipmentDrop?.rarity ?? '',
    captureEligible: canCapture,
    captureAlreadyOwned: status === 'won' && alreadyOwned,
    captureStatus: status !== 'won' ? 'locked' : alreadyOwned ? 'already' : 'idle',
    captureBallName: '',
    captureBallTier: '',
    captureBallColor: '',
    captureBallMultiplier: 1,
    captureChance: 0,
    captureAttempted: false,
    captureMessage: status !== 'won'
      ? '这次没有收服机会，回小屋恢复后还能再来。'
      : alreadyOwned
        ? `${enemy.name}已经住在小屋里啦，这次不会重复收服。`
        : `打赢了${enemy.name}，可以抽一次收服球试着邀请它入住。`,
    message: status === 'won' ? `${player.name}赢下了野外挑战。` : '回小屋恢复后还能再来。',
    returnTarget: 'map'
  };
}

const initialLoad = loadSaveWithRecovery();

export const state = reactive({
  view: 'map' as ViewName,
  message: initialLoad.message,
  encounter: null as Spirit | null,
  save: initialLoad.save,
  captureMotion: '' as '' | 'shake' | 'sparkle',
  battlePrep: { habitat: '', selectedId: '' },
  battle: { status: 'idle', habitat: '', playerId: '', enemyId: '', enemyLevel: 1, enemyHp: 0, playerEnergy: 0, combo: 0, playerGuardTurns: 0, enemyCondition: '', enemyConditionTurns: 0, enemyTemperament: '莽撞型', log: [] } as BattleState,
  battleResult: defaultBattleResult(),
  homeSelectedId: '',
  detailSpiritId: '',
  detailReturnView: 'dex' as ViewName,
  storageRevision: 0
});
normalizeAllPets();
state.save = saveSnapshot(state.save);
writeStoredSave(storageKey, state.save);

const save = () => {
  backupCurrentPrimary();
  state.save = saveSnapshot(state.save);
  writeStoredSave(storageKey, state.save);
  state.storageRevision += 1;
};

export const discoveredCount = computed(() => Object.keys(state.save.discovered).length);
export const capturedCount = computed(() => Object.keys(state.save.captured).length);
export const capturedSpirits = computed(() => spirits.filter((spirit) => state.save.captured[spirit.spiritId]));
export const hasCapturedSpirits = computed(() => capturedCount.value > 0);
export const saveSafetyStatus = computed(() => {
  state.storageRevision;
  const backup = readStoredSave(backupStorageKey);
  const preResetBackup = readStoredSave(preResetBackupKey);
  const backupCount = backup ? Object.keys(backup.captured).length : 0;
  const preResetCount = preResetBackup ? Object.keys(preResetBackup.captured).length : 0;
  return {
    storageKey,
    backupStorageKey,
    preResetBackupKey,
    hasBackup: Boolean(backup && hasSaveProgress(backup)),
    hasPreResetBackup: Boolean(preResetBackup && hasSaveProgress(preResetBackup)),
    backupLabel: backup ? `${backupCount} 只萌灵 · ${new Date(backup.lastSavedAt).toLocaleString()}` : '暂无备份',
    preResetLabel: preResetBackup ? `${preResetCount} 只萌灵 · ${new Date(preResetBackup.lastSavedAt).toLocaleString()}` : '暂无清空前备份'
  };
});
export const equipmentInstances = computed(() => {
  state.storageRevision;
  return equipmentInstancesInternal();
});
export const inventoryEquipment = computed(() => equipmentInstances.value.map((instance) => instance.equipment));
export const availableBattleSpirits = computed(() => {
  normalizeAllPets();
  return capturedSpirits.value.filter((spirit) => (state.save.captured[spirit.spiritId].currentHp ?? 0) > 0);
});

export const habitatProgress = computed(() => {
  const progress: Record<string, { discovered: number; total: number; remaining: number; streak: number }> = {};
  for (const spirit of spirits) {
    if (!progress[spirit.habitat]) progress[spirit.habitat] = { discovered: 0, total: 0, remaining: 0, streak: state.save.explorationStreak[spirit.habitat] ?? 0 };
    progress[spirit.habitat].total += 1;
    if (state.save.discovered[spirit.spiritId]) progress[spirit.habitat].discovered += 1;
  }
  for (const habitat of Object.keys(progress)) {
    progress[habitat].remaining = progress[habitat].total - progress[habitat].discovered;
    progress[habitat].streak = state.save.explorationStreak[habitat] ?? 0;
  }
  return progress;
});

export const battlePlayer = computed(() => state.battle.playerId ? spiritById(state.battle.playerId) : null);
export const battleEnemy = computed(() => state.battle.enemyId ? spiritById(state.battle.enemyId) : null);
export const battlePlayerPet = computed(() => state.battle.playerId ? normalizePet(state.battle.playerId) : null);

export function getPetState(spiritId: string) {
  return state.save.captured[spiritId] ? normalizePet(spiritId) : null;
}

export function getPetStats(spiritId: string) {
  const pet = getPetState(spiritId);
  if (!pet) return null;
  return getPetBattleStatsInternal(spiritId);
}

export function getPetBattleStats(spiritId: string) {
  return getPetStats(spiritId);
}

export function getEquippedItems(spiritId: string) {
  normalizePet(spiritId);
  const pet = state.save.captured[spiritId];
  return Object.entries(pet.equipment ?? emptyEquipmentSlots()).reduce<Record<EquipmentSlot, Equipment | null>>((result, [slot, instanceId]) => {
    result[slot as EquipmentSlot] = equipmentByInstanceId(instanceId);
    return result;
  }, { weapon: null, armor: null, charm: null, boots: null });
}

export function equipmentInstancesForSlot(slot: EquipmentSlot) {
  return equipmentInstances.value.filter((instance) => instance.equipment.slot === slot);
}

export function equipmentForSlot(slot: EquipmentSlot) {
  return equipmentInstancesForSlot(slot).map((instance) => instance.equipment);
}

export function equipItem(spiritId: string, instanceId: string) {
  const pet = getPetState(spiritId);
  const instance = equipmentInstances.value.find((item) => item.instanceId === instanceId);
  if (!pet || !instance) return;
  if (instance.equippedBy && instance.equippedBy !== spiritId) {
    state.message = `${instance.equipment.name}已经被${instance.equippedByName}穿着。`;
    return;
  }
  const beforeHp = getPetBattleStatsInternal(spiritId).hp;
  pet.equipment = { ...emptyEquipmentSlots(), ...(pet.equipment ?? {}), [instance.equipment.slot]: instance.instanceId };
  const afterHp = getPetBattleStatsInternal(spiritId).hp;
  pet.currentHp = Math.min(afterHp, (pet.currentHp ?? afterHp) + Math.max(0, afterHp - beforeHp));
  state.message = `${spiritById(spiritId).name}装备了${instance.equipment.name}。`;
  save();
}

export function unequipSlot(spiritId: string, slot: EquipmentSlot) {
  const pet = getPetState(spiritId);
  if (!pet) return;
  pet.equipment = { ...emptyEquipmentSlots(), ...(pet.equipment ?? {}), [slot]: '' };
  pet.currentHp = Math.min(getPetBattleStatsInternal(spiritId).hp, pet.currentHp ?? 0);
  state.message = `${spiritById(spiritId).name}卸下了装备。`;
  save();
}

export function showView(view: ViewName, message?: string) {
  state.view = view;
  if (message) state.message = message;
}

export function openSpiritDetail(spiritId: string, returnView: ViewName = state.view) {
  const spirit = spirits.find((item) => item.spiritId === spiritId);
  if (!spirit) return;
  state.detailSpiritId = spiritId;
  state.detailReturnView = returnView;
  showView('spiritDetail');
}

export function closeSpiritDetail() {
  const target = state.detailReturnView === 'spiritDetail' ? 'dex' : state.detailReturnView;
  showView(target);
}
export function openPetHome(spiritId?: string) {
  if (spiritId && state.save.captured[spiritId]) state.homeSelectedId = spiritId;
  showView('home', spiritId && state.save.captured[spiritId] ? `${spiritById(spiritId).name}的装备也可以给其他萌灵穿同款。` : '欢迎回到萌灵小屋。');
}

export function closeBattleResult() {
  state.battle.status = 'idle';
  state.message = '回到小岛，可以继续探索或去小屋整理装备。';
  showView('map');
}

export function exploreHabitat(habitat: string) {
  const candidates = habitatSpirits(habitat);
  const undiscovered = undiscoveredInHabitat(habitat);
  const currentStreak = state.save.explorationStreak[habitat] ?? 0;
  const usePity = undiscovered.length > 0 && currentStreak >= pityThreshold;
  const spirit = usePity ? pickWeightedSpirit(undiscovered) : pickWeightedSpirit(candidates.length ? candidates : spirits);
  const alreadyCaptured = Boolean(state.save.captured[spirit.spiritId]);
  const alreadyDiscovered = Boolean(state.save.discovered[spirit.spiritId]);

  state.encounter = spirit;
  state.save.discovered[spirit.spiritId] = true;
  state.captureMotion = '';

  if (!alreadyDiscovered) state.save.explorationStreak[habitat] = 0;
  else if (undiscovered.length > 0) state.save.explorationStreak[habitat] = currentStreak + 1;
  else state.save.explorationStreak[habitat] = 0;

  const progress = habitatProgress.value[habitat];
  const remainingAfter = Math.max(0, (progress?.total ?? candidates.length) - (progress?.discovered ?? 0));
  if (alreadyCaptured) state.message = `又遇见${spirit.name}啦。它已经住在小屋里。这里还剩 ${remainingAfter} 只没发现。`;
  else if (alreadyDiscovered) state.message = `又遇见${spirit.name}了，上次还没邀请成功。这里还剩 ${remainingAfter} 只没发现。`;
  else if (remainingAfter > 0) state.message = `发现新萌灵！${habitat}还剩 ${remainingAfter} 只没发现。`;
  else state.message = `发现新萌灵！${habitat}的萌灵已经都见过啦。`;

  save();
  showView('encounter');
}

export function tryCapture(): CaptureResult {
  const spirit = state.encounter;
  if (!spirit) return 'none';
  if (state.save.captured[spirit.spiritId]) {
    state.message = `${spirit.name}已经住在小屋里啦。`;
    state.captureMotion = 'sparkle';
    return 'already';
  }
  const success = Math.random() <= spirit.catchRate;
  if (success) {
    state.save.captured[spirit.spiritId] = { affection: 35, hunger: 68, cleanliness: 72, mood: '开心', level: 1, exp: 0, currentHp: getStats(spirit, 1).hp, equipment: emptyEquipmentSlots() };
    state.captureMotion = 'sparkle';
    state.message = `成功啦！${spirit.name}加入了萌灵小屋。`;
    save();
    return 'captured';
  }
  state.captureMotion = 'shake';
  state.message = '差一点点，它还想再玩一会儿。';
  return 'failed';
}

export function openBattlePrep(habitat: string) {
  normalizeAllPets();
  if (!capturedCount.value) {
    state.message = '先邀请一只萌灵入住，再来野外挑战。';
    return;
  }
  const selectedId = bestAvailableFighterId();
  state.battlePrep.habitat = habitat;
  state.battlePrep.selectedId = selectedId;
  state.message = selectedId ? `选择一只萌灵，去${habitat}挑战吧。` : '萌灵都累了，先回小屋恢复一下吧。';
  showView('battlePrep');
}

export function selectBattleSpirit(spiritId: string) {
  const pet = getPetState(spiritId);
  if (!pet || (pet.currentHp ?? 0) <= 0) {
    state.message = '这只萌灵已经累了，先回小屋恢复一下吧。';
    return;
  }
  state.battlePrep.selectedId = spiritId;
  state.message = `${spiritById(spiritId).name}准备好了。`;
}


function clampEnergy(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function rollEnemyTemperament(): EnemyTemperament {
  const temperaments: EnemyTemperament[] = ['莽撞型', '胆小型', '聪明型', '治疗型', '暴走型'];
  return temperaments[Math.floor(Math.random() * temperaments.length)] ?? '莽撞型';
}

function temperamentOpening(temperament: EnemyTemperament) {
  const copy: Record<EnemyTemperament, string> = {
    莽撞型: '这只萌灵看起来很暴躁，可能会一直猛攻！',
    胆小型: '这只萌灵有点胆小，血少时会先保护自己。',
    聪明型: '这只萌灵正在观察你，可能会找克制机会。',
    治疗型: '这只萌灵很会照顾自己，受伤后可能恢复。',
    暴走型: '这只萌灵越紧张越用力，血越少越危险。'
  };
  return copy[temperament];
}

function conditionForElement(element: ElementType): BattleCondition {
  return ({ 草: 'vine', 水: 'wet', 火: 'burn', 电: 'zap', 土: 'armor', 风: 'swift' } as Record<ElementType, BattleCondition>)[element];
}


function conditionMessage(condition: BattleCondition, targetName: string) {
  const copy: Record<BattleCondition, string> = {
    '': '',
    burn: `${targetName}被小火星烫到了！`,
    wet: `${targetName}身上挂满了泡泡！`,
    vine: `${targetName}被藤蔓缠住了！`,
    zap: `${targetName}被电得麻麻的！`,
    armor: `${targetName}被岩石光保护住了！`,
    swift: `${targetName}身边刮起了轻快的风！`
  };
  return copy[condition];
}

function pickEnemySkill(enemy: Spirit, player: Spirit, enemyHp: number, enemyMaxHp: number, temperament: EnemyTemperament) {
  const attackSkills = enemy.skills.filter((skill) => skill.type !== 'heal' && skill.role !== 'ultimate');
  const guardSkill = enemy.skills.find((skill) => skill.role === 'guard' || skill.type === 'heal');
  if ((temperament === '治疗型' || temperament === '胆小型') && guardSkill && enemyHp / enemyMaxHp < 0.45 && Math.random() < 0.72) return guardSkill;
  if (temperament === '聪明型') {
    const smart = attackSkills.find((skill) => elementMultiplier(skill.element ?? enemy.element, player.element) > 1);
    if (smart) return smart;
  }
  if (temperament === '莽撞型' && attackSkills.length) return attackSkills[Math.floor(Math.random() * attackSkills.length)] ?? attackSkills[0];
  return enemy.skills.filter((skill) => skill.role !== 'ultimate')[Math.floor(Math.random() * Math.max(1, enemy.skills.length - 1))] ?? enemy.skills[0];
}
export function startWildBattle(habitat: string, playerId: string) {
  normalizeAllPets();
  const pet = state.save.captured[playerId];
  if (!pet) {
    state.message = '先选择一只已经入住的萌灵。';
    return;
  }
  if ((pet.currentHp ?? 0) <= 0) {
    state.message = `${spiritById(playerId).name}已经累了，先回小屋恢复一下吧。`;
    return;
  }
  const enemies = habitatSpirits(habitat);
  const enemy = pickWeightedSpirit(enemies.length ? enemies : spirits);
  const playerLevel = pet.level ?? 1;
  const enemyLevel = enemyLevelFor(playerLevel, playerId);

  state.battleResult = defaultBattleResult();
  const enemyTemperament = rollEnemyTemperament();
  state.battle = {
    status: 'active',
    habitat,
    playerId,
    enemyId: enemy.spiritId,
    enemyLevel,
    enemyHp: getStats(enemy, enemyLevel).hp,
    playerEnergy: 0,
    combo: 0,
    playerGuardTurns: 0,
    enemyCondition: '',
    enemyConditionTurns: 0,
    enemyTemperament,
    log: [temperamentOpening(enemyTemperament), `${spiritById(playerId).name}出战！野外的${enemy.name}出现了。`]
  };
  state.message = `${habitat}的野外挑战开始了。`;
  showView('battle');
  save();
}

export function useBattleSkill(skill: Skill) {
  if (state.battle.status !== 'active') return;
  const player = battlePlayer.value;
  const enemy = battleEnemy.value;
  const pet = battlePlayerPet.value;
  if (!player || !enemy || !pet) return;
  if (skill.role === 'ultimate' && state.battle.playerEnergy < 100) {
    state.battle.log.unshift('奥义能量还没满，先用其他招式攒能量吧。');
    return;
  }

  const playerLevel = pet.level ?? 1;
  const enemyLevel = state.battle.enemyLevel;
  const playerStats = getPetBattleStatsInternal(player.spiritId);
  const enemyStats = getStats(enemy, enemyLevel);
  const playerHp = pet.currentHp ?? playerStats.hp;
  const skillElement = skill.element ?? player.element;
  const isUltimate = skill.role === 'ultimate';
  const wetBonus = state.battle.enemyCondition === 'wet' && skillElement === '电' ? 0.25 : 0;
  const ultimateBonus = isUltimate ? 0.35 : 0;

  const playerResult = calculateSkillResult({
    attacker: player,
    attackerLevel: playerLevel,
    defender: enemy,
    defenderLevel: enemyLevel,
    defenderHp: state.battle.enemyHp,
    attackerHp: playerHp,
    skill,
    attackerStats: playerStats,
    defenderStats: enemyStats,
    damageBonusRate: equipmentDamageBonus(player.spiritId, skill) + wetBonus + ultimateBonus,
    healBonusRate: equipmentHealBonus(player.spiritId)
  });

  pet.currentHp = playerResult.nextAttackerHp;
  state.battle.enemyHp = playerResult.nextDefenderHp;

  if (isUltimate) state.battle.playerEnergy = 0;
  else {
    const advantageEnergy = playerResult.multiplier > 1 ? 20 : 0;
    state.battle.playerEnergy = clampEnergy(state.battle.playerEnergy + 22 + advantageEnergy);
  }

  if (skill.role === 'guard') {
    state.battle.playerGuardTurns = 1;
    state.battle.log.unshift(`${player.name}撑起了守护光，下一次受到的伤害会减少。`);
  }

  if (skill.type !== 'heal' && playerResult.damage > 0) {
    if (playerResult.multiplier > 1) {
      state.battle.combo += 1;
      state.battle.log.unshift(`效果拔群！能量提升，克制连击 ${state.battle.combo}。`);
      if (state.battle.combo >= 2) {
        const comboDamage = Math.max(2, Math.round(playerResult.damage * 0.22));
        state.battle.enemyHp = Math.max(0, state.battle.enemyHp - comboDamage);
        state.battle.log.unshift(`连续克制！追加一击造成 ${comboDamage} 点伤害。`);
      }
    } else {
      state.battle.combo = 0;
    }

    const condition = conditionForElement(skillElement);
    if (condition === 'armor') {
      state.battle.playerGuardTurns = 1;
      state.battle.log.unshift(`${player.name}被岩石光保护住了！`);
    } else if (condition === 'swift') {
      state.battle.playerEnergy = clampEnergy(state.battle.playerEnergy + 10);
      state.battle.log.unshift(`${player.name}身边刮起了轻快的风！`);
    } else {
      state.battle.enemyCondition = condition;
      state.battle.enemyConditionTurns = 2;
      const message = conditionMessage(condition, enemy.name);
      if (message) state.battle.log.unshift(message);
    }
  }

  const multiplierText = playerResult.multiplier > 1 ? '效果很好！' : playerResult.multiplier < 1 ? '效果一般。' : '';
  if (skill.type === 'heal') state.battle.log.unshift(`${player.name}使用${skill.name}，恢复 ${playerResult.heal} 点生命。`);
  else state.battle.log.unshift(`${player.name}使用${skill.name}，造成 ${playerResult.damage} 点伤害。${multiplierText}`);

  if (state.battle.enemyHp <= 0) {
    const baseReward = expReward(enemyLevel, enemy.rarity);
    const reward = Math.round(baseReward * (1 + equipmentExpBonus(player.spiritId)));
    const equipmentDrop = rollEquipmentDrop(enemyLevel, enemy.rarity);
    pet.exp = (pet.exp ?? 0) + reward;
    if (equipmentDrop) state.save.inventory.equipment.push(equipmentDrop.id);
    const levelMessages = levelUpIfNeeded(player.spiritId);
    state.battle.status = 'won';
    state.battle.log.unshift(`胜利！获得 ${reward} 点经验。`);
    if (equipmentDrop) state.battle.log.unshift(`获得装备：${equipmentDrop.name}。`);
    state.battle.log.unshift(...levelMessages.reverse());
    state.message = equipmentDrop ? `胜利！还找到了${equipmentDrop.name}。` : `${player.name}赢下了野外挑战。`;
    setBattleResult('won', player, enemy, reward, levelMessages, equipmentDrop);
    save();
    return;
  }

  if (state.battle.enemyCondition === 'burn') {
    const burnDamage = Math.max(2, Math.floor(enemyStats.hp * 0.06));
    state.battle.enemyHp = Math.max(0, state.battle.enemyHp - burnDamage);
    state.battle.log.unshift(`${enemy.name}被灼烧，掉了 ${burnDamage} 点生命。`);
  }
  if (state.battle.enemyConditionTurns > 0) state.battle.enemyConditionTurns -= 1;
  if (state.battle.enemyConditionTurns <= 0) state.battle.enemyCondition = '';

  if (state.battle.enemyHp <= 0) {
    const reward = Math.round(expReward(enemyLevel, enemy.rarity) * (1 + equipmentExpBonus(player.spiritId)));
    const equipmentDrop = rollEquipmentDrop(enemyLevel, enemy.rarity);
    pet.exp = (pet.exp ?? 0) + reward;
    if (equipmentDrop) state.save.inventory.equipment.push(equipmentDrop.id);
    const levelMessages = levelUpIfNeeded(player.spiritId);
    state.battle.status = 'won';
    state.battle.log.unshift(`胜利！获得 ${reward} 点经验。`);
    setBattleResult('won', player, enemy, reward, levelMessages, equipmentDrop);
    save();
    return;
  }

  const enemySkill = pickEnemySkill(enemy, player, state.battle.enemyHp, enemyStats.hp, state.battle.enemyTemperament);
  const enemyLowHpBonus = state.battle.enemyTemperament === '暴走型' ? Math.max(0, 1 - state.battle.enemyHp / enemyStats.hp) * 0.28 : 0;
  const enemyResult = calculateSkillResult({ attacker: enemy, attackerLevel: enemyLevel, defender: player, defenderLevel: playerLevel, defenderHp: pet.currentHp ?? playerStats.hp, attackerHp: state.battle.enemyHp, skill: enemySkill, defenderStats: playerStats, damageBonusRate: enemyLowHpBonus });

  if (enemySkill.type === 'heal') {
    state.battle.enemyHp = enemyResult.nextAttackerHp;
    state.battle.log.unshift(`野外的${enemy.name}使用${enemySkill.name}，恢复 ${enemyResult.heal} 点生命。`);
  } else {
    let enemyDamage = enemyResult.damage;
    if (state.battle.playerGuardTurns > 0) enemyDamage = Math.max(1, Math.ceil(enemyDamage * 0.55));
    if (state.battle.enemyCondition === 'vine') enemyDamage = Math.max(1, Math.ceil(enemyDamage * 0.75));
    if (state.battle.enemyCondition === 'zap' && Math.random() < 0.28) {
      enemyDamage = 0;
      state.battle.log.unshift(`${enemy.name}麻麻的，动作慢了一拍！`);
    }
    pet.currentHp = Math.max(0, (pet.currentHp ?? playerStats.hp) - enemyDamage);
    if (state.battle.playerGuardTurns > 0) state.battle.playerGuardTurns = 0;
    state.battle.playerEnergy = clampEnergy(state.battle.playerEnergy + (enemyDamage > 0 ? 12 : 6));
    const enemyMultiplierText = enemyResult.multiplier > 1 ? '效果很好！' : enemyResult.multiplier < 1 ? '效果一般。' : '';
    state.battle.log.unshift(`野外的${enemy.name}使用${enemySkill.name}，造成 ${enemyDamage} 点伤害。${enemyMultiplierText}`);
  }

  if ((pet.currentHp ?? 0) <= 0) {
    pet.currentHp = 0;
    state.battle.status = 'lost';
    state.battle.log.unshift(`${player.name}累倒了，回小屋休息一下吧。`);
    state.message = '挑战失败，去小屋恢复后还能再来。';
    setBattleResult('lost', player, enemy, 0, [], null);
  }
  save();
}
export function drawBattleCaptureBall() {
  const result = state.battleResult;
  if (result.status !== 'won') {
    result.captureMessage = '只有挑战胜利后才可以收服。';
    return;
  }
  if (result.captureAlreadyOwned || state.save.captured[result.enemySpiritId]) {
    result.captureEligible = false;
    result.captureAlreadyOwned = true;
    result.captureStatus = 'already';
    result.captureMessage = `${result.enemyName}已经住在小屋里啦，这次不会重复收服。`;
    return;
  }
  if (result.captureAttempted) {
    result.captureMessage = '这场战斗已经试过一次啦，下次再挑战还有机会。';
    return;
  }
  const enemy = spiritById(result.enemySpiritId);
  const ball = rollBattleCaptureBall();
  result.captureStatus = 'ready';
  result.captureBallName = ball.name;
  result.captureBallTier = ball.tier;
  result.captureBallColor = ball.color;
  result.captureBallMultiplier = ball.multiplier;
  result.captureChance = battleCaptureChance(enemy, ball);
  result.captureMessage = `抽到了${ball.name}！这次收服机会约 ${Math.round(result.captureChance * 100)}%。`;
  state.message = result.captureMessage;
}

export function tryBattleCaptureAfterBattle(): CaptureResult {
  const result = state.battleResult;
  if (result.status !== 'won' || !result.captureEligible) return 'none';
  if (result.captureAlreadyOwned || state.save.captured[result.enemySpiritId]) {
    result.captureStatus = 'already';
    result.captureAlreadyOwned = true;
    result.captureEligible = false;
    result.captureMessage = `${result.enemyName}已经住在小屋里啦，这次不会重复收服。`;
    return 'already';
  }
  if (result.captureAttempted) {
    result.captureMessage = '这场战斗已经试过一次啦，下次再挑战还有机会。';
    return 'failed';
  }
  if (!result.captureBallName) drawBattleCaptureBall();

  const enemy = spiritById(result.enemySpiritId);
  result.captureAttempted = true;
  const success = Math.random() <= result.captureChance;
  if (success) {
    capturePetFromBattle(enemy);
    result.captureStatus = 'captured';
    result.captureEligible = false;
    result.captureMessage = `成功收服！${enemy.name}加入了萌灵小屋。`;
    state.message = result.captureMessage;
    save();
    return 'captured';
  }

  result.captureStatus = 'failed';
  result.captureMessage = `差一点点，${enemy.name}还想再练一会儿。下次打赢还可以再试。`;
  state.message = result.captureMessage;
  save();
  return 'failed';
}
export function restoreAllPets() {
  normalizeAllPets();
  for (const spiritId of Object.keys(state.save.captured)) {
    const pet = state.save.captured[spiritId];
    pet.currentHp = getPetBattleStatsInternal(spiritId).hp;
    pet.mood = '精神';
  }
  state.message = '所有入住萌灵都恢复精神啦。';
  save();
}

export function careFor(spiritId: string, action: 'feed' | 'clean' | 'pet') {
  const pet = state.save.captured[spiritId];
  const spirit = spirits.find((item) => item.spiritId === spiritId);
  if (!pet || !spirit) return;
  normalizePet(spiritId);
  if (action === 'feed') {
    pet.hunger = Math.min(100, pet.hunger + 18);
    pet.affection = Math.min(100, pet.affection + 5);
    pet.currentHp = Math.min(getPetBattleStatsInternal(spiritId).hp, (pet.currentHp ?? 0) + 5);
    pet.mood = '满足';
    state.message = `${spirit.name}吃到了${spirit.favoriteFood}，眼睛亮起来了。`;
  }
  if (action === 'clean') {
    pet.cleanliness = Math.min(100, pet.cleanliness + 22);
    pet.affection = Math.min(100, pet.affection + 4);
    pet.mood = '清爽';
    state.message = `${spirit.name}变得干干净净，轻轻转了一圈。`;
  }
  if (action === 'pet') {
    pet.affection = Math.min(100, pet.affection + 12);
    pet.mood = '亲近';
    state.message = `${spirit.name}靠近了一点，好像更信任你了。`;
  }
  save();
}

export function exportSave() {
  normalizeAllPets();
  save();
  const blob = new Blob([JSON.stringify(state.save, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `萌灵小岛存档-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  state.message = '存档已经导出，建议放到一个不容易误删的文件夹。';
}

export async function importSaveFile(file: File) {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text) as unknown;
    if (!isImportCandidate(parsed)) throw new Error('invalid-save');
    const imported = normalizeSaveData(parsed);
    if (!hasSaveProgress(imported)) throw new Error('empty-save');
    backupCurrentPrimary();
    recoverSaveData(imported, '导入成功，已经恢复到导入的存档。');
  } catch {
    state.message = '这个文件不是萌灵小岛存档，导入没有生效。';
  }
}

export function recoverBackup(kind: 'latest' | 'preReset' = 'latest') {
  const recovered = kind === 'preReset'
    ? readStoredSave(preResetBackupKey)
    : readStoredSave(backupStorageKey) ?? readStoredSave(preResetBackupKey);
  if (!recovered || !hasSaveProgress(recovered)) {
    state.message = '没有找到可恢复的备份存档。';
    return;
  }
  recoverSaveData(recovered, '已经从备份恢复存档。');
}

export function clearProgressWithBackup() {
  normalizeAllPets();
  if (hasSaveProgress(state.save)) writeStoredSave(preResetBackupKey, saveSnapshot(state.save));
  state.save = defaultSave();
  state.encounter = null;
  state.battle.status = 'idle';
  state.battlePrep.habitat = '';
  state.battlePrep.selectedId = '';
  state.battleResult = defaultBattleResult();
  state.message = '存档已经清空。刚才的进度已放入清空前备份，可以恢复。';
  state.view = 'map';
  save();
}
export function resetProgress() {
  clearProgressWithBackup();
}
