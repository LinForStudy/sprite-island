import { computed, reactive } from 'vue';
import { spirits, type Spirit } from '../data/spirits';

type ViewName = 'map' | 'encounter' | 'dex' | 'home';

interface PetState {
  affection: number;
  hunger: number;
  cleanliness: number;
  mood: string;
}

interface SaveData {
  discovered: Record<string, true>;
  captured: Record<string, PetState>;
}

const storageKey = 'sprite-island-save-v1';

const defaultSave = (): SaveData => ({
  discovered: {},
  captured: {}
});

function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return {
      discovered: parsed.discovered ?? {},
      captured: parsed.captured ?? {}
    };
  } catch {
    return defaultSave();
  }
}

export const state = reactive({
  view: 'map' as ViewName,
  message: '欢迎来到萌灵小岛。点一点小岛，看看今天会遇见谁。',
  encounter: null as Spirit | null,
  save: loadSave(),
  captureMotion: '' as '' | 'shake' | 'sparkle'
});

const save = () => {
  localStorage.setItem(storageKey, JSON.stringify(state.save));
};

export const discoveredCount = computed(() => Object.keys(state.save.discovered).length);
export const capturedCount = computed(() => Object.keys(state.save.captured).length);
export const capturedSpirits = computed(() => spirits.filter((spirit) => state.save.captured[spirit.spiritId]));

export function showView(view: ViewName, message?: string) {
  state.view = view;
  if (message) state.message = message;
}

export function exploreHabitat(habitat: string) {
  const candidates = spirits.filter((spirit) => spirit.habitat === habitat);
  const spirit = candidates[Math.floor(Math.random() * candidates.length)] ?? spirits[0];
  state.encounter = spirit;
  state.save.discovered[spirit.spiritId] = true;
  state.captureMotion = '';
  state.message = `${habitat}里传来轻轻的动静。`;
  save();
  showView('encounter');
}

export function tryCapture() {
  const spirit = state.encounter;
  if (!spirit) return;

  if (state.save.captured[spirit.spiritId]) {
    state.message = `${spirit.name}已经住在小屋里啦。`;
    state.captureMotion = 'sparkle';
    return;
  }

  const success = Math.random() <= spirit.catchRate;
  if (success) {
    state.save.captured[spirit.spiritId] = {
      affection: 35,
      hunger: 68,
      cleanliness: 72,
      mood: '开心'
    };
    state.captureMotion = 'sparkle';
    state.message = `成功啦！${spirit.name}加入了萌灵小屋。`;
    save();
    return;
  }

  state.captureMotion = 'shake';
  state.message = '差一点点，它还想再玩一会儿。';
}

export function careFor(spiritId: string, action: 'feed' | 'clean' | 'pet') {
  const pet = state.save.captured[spiritId];
  const spirit = spirits.find((item) => item.spiritId === spiritId);
  if (!pet || !spirit) return;

  if (action === 'feed') {
    pet.hunger = Math.min(100, pet.hunger + 18);
    pet.affection = Math.min(100, pet.affection + 5);
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

export function resetProgress() {
  state.save = defaultSave();
  state.encounter = null;
  state.message = '存档已经清空，可以重新开始探索。';
  state.view = 'map';
  save();
}
