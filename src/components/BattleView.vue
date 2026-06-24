<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import SpiritArt from './SpiritArt.vue';
import { expToNext, getStats } from '../data/battle';
import { battleEnemy, battlePlayer, battlePlayerPet, getEquippedItems, getPetBattleStats, showView, state, useBattleSkill } from '../stores/gameState';
import type { Skill } from '../data/spirits';

const isAnimating = ref(false);
const actionLocked = ref(false);
const playerAttack = ref(false);
const enemyAttack = ref(false);
const enemyHit = ref(false);
const playerHit = ref(false);
const effectKind = ref<'physical' | 'magic' | 'heal'>('physical');
const effectElement = ref('草');
const enemyDamageText = ref('');
const playerDamageText = ref('');
const healText = ref('');
const battleTip = ref('');
const ultimateBurst = ref(false);
const timers: number[] = [];

const playerStats = computed(() => {
  if (!battlePlayer.value || !battlePlayerPet.value) return null;
  return getPetBattleStats(battlePlayer.value.spiritId);
});

const enemyStats = computed(() => {
  if (!battleEnemy.value) return null;
  return getStats(battleEnemy.value, state.battle.enemyLevel);
});

const playerEquipmentCount = computed(() => {
  if (!battlePlayer.value) return 0;
  return Object.values(getEquippedItems(battlePlayer.value.spiritId)).filter(Boolean).length;
});

const playerHpText = computed(() => {
  if (!playerStats.value || !battlePlayerPet.value) return '0 / 0';
  return `${battlePlayerPet.value.currentHp ?? playerStats.value.hp} / ${playerStats.value.hp}`;
});

const enemyHpText = computed(() => {
  if (!enemyStats.value) return '0 / 0';
  return `${state.battle.enemyHp} / ${enemyStats.value.hp}`;
});

const playerHpPercent = computed(() => {
  if (!playerStats.value || !battlePlayerPet.value) return 0;
  return Math.max(0, Math.min(100, ((battlePlayerPet.value.currentHp ?? 0) / playerStats.value.hp) * 100));
});

const enemyHpPercent = computed(() => {
  if (!enemyStats.value) return 0;
  return Math.max(0, Math.min(100, (state.battle.enemyHp / enemyStats.value.hp) * 100));
});

const playerEnergyPercent = computed(() => Math.max(0, Math.min(100, state.battle.playerEnergy ?? 0)));
const enemyConditionText = computed(() => {
  const labels: Record<string, string> = { burn: '灼烧', wet: '湿润', vine: '缠绕', zap: '麻麻', armor: '护甲', swift: '迅捷' };
  return labels[state.battle.enemyCondition] ?? '';
});
const enemyTemperamentText = computed(() => state.battle.enemyTemperament || '莽撞型');

const expText = computed(() => {
  if (!battlePlayer.value || !battlePlayerPet.value) return '';
  const level = battlePlayerPet.value.level ?? 1;
  const need = expToNext(level, battlePlayer.value.rarity);
  if (need <= 0) return '满级';
  return `${battlePlayerPet.value.exp ?? 0} / ${need}`;
});

function skillLabel(skill: Skill) {
  const roleLabels: Record<string, string> = {
    basic: '普通攻击',
    element: '属性技能',
    guard: '守护',
    ultimate: '奥义'
  };
  return roleLabels[skill.role] ?? (skill.type === 'heal' ? '恢复' : skill.type === 'physical' ? '力量' : '魔法');
}

function skillButtonClass(skill: Skill) {
  return [`skill-button--${skill.role}`, { 'skill-button--ready': skill.role === 'ultimate' && playerEnergyPercent.value >= 100 }];
}

function isSkillDisabled(skill: Skill) {
  return actionLocked.value || isAnimating.value || state.battle.status !== 'active' || (skill.role === 'ultimate' && playerEnergyPercent.value < 100);
}

function schedule(callback: () => void, delay: number) {
  const id = window.setTimeout(() => {
    const index = timers.indexOf(id);
    if (index >= 0) timers.splice(index, 1);
    callback();
  }, delay);
  timers.push(id);
  return id;
}

function clearBattleTimers() {
  while (timers.length) window.clearTimeout(timers.pop());
}

function playTone(frequency: number, start: number, duration: number, type: OscillatorType, volume = 0.05) {
  const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  const context = new AudioContextCtor();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const beginsAt = context.currentTime + start;
  const endsAt = beginsAt + duration;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, beginsAt);
  gain.gain.setValueAtTime(0.001, beginsAt);
  gain.gain.exponentialRampToValueAtTime(volume, beginsAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, endsAt);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(beginsAt);
  oscillator.stop(endsAt + 0.03);
  window.setTimeout(() => context.close(), (start + duration + 0.1) * 1000);
}

function playBattleSound(skill: Skill) {
  if (skill.type === 'heal') {
    playTone(520, 0, 0.08, 'sine', 0.045);
    playTone(760, 0.08, 0.14, 'sine', 0.05);
    return;
  }
  if (skill.type === 'magic') {
    playTone(660, 0, 0.08, 'triangle', 0.045);
    playTone(920, 0.07, 0.12, 'triangle', 0.05);
    return;
  }
  playTone(240, 0, 0.07, 'square', 0.035);
  playTone(150, 0.08, 0.1, 'sawtooth', 0.03);
}

function clearEffects() {
  playerAttack.value = false;
  enemyAttack.value = false;
  enemyHit.value = false;
  playerHit.value = false;
  ultimateBurst.value = false;
  enemyDamageText.value = '';
  playerDamageText.value = '';
  healText.value = '';
  battleTip.value = '';
}

function unlockAction() {
  clearEffects();
  isAnimating.value = false;
  actionLocked.value = false;
}

function maybeShowResult() {
  if (state.view === 'battle' && state.battle.status !== 'active') showView('battleResult');
}

watch(() => state.battle.status, (status) => {
  if (state.view !== 'battle') return;
  if (status !== 'active') schedule(maybeShowResult, 260);
});

onBeforeUnmount(() => {
  clearBattleTimers();
  actionLocked.value = false;
});

function leaveBattle(view: 'map' | 'home', message: string) {
  clearBattleTimers();
  unlockAction();
  showView(view, message);
}

function useSkillWithEffects(skill: Skill) {
  if (actionLocked.value || isAnimating.value || state.battle.status !== 'active' || !playerStats.value || !battlePlayerPet.value) return;

  const beforeEnemyHp = state.battle.enemyHp;
  const beforePlayerHp = battlePlayerPet.value.currentHp ?? playerStats.value.hp;
  clearBattleTimers();
  clearEffects();
  actionLocked.value = true;
  isAnimating.value = true;
  playerAttack.value = true;
  effectKind.value = skill.type;
  effectElement.value = skill.element ?? battlePlayer.value?.element ?? '草';
  ultimateBurst.value = skill.role === 'ultimate';
  battleTip.value = skill.role === 'ultimate' ? '奥义释放！' : skill.role === 'guard' ? '守护展开！' : '';
  playBattleSound(skill);

  schedule(() => {
    if (state.view !== 'battle' || state.battle.status !== 'active') return;
    useBattleSkill(skill);
    const afterEnemyHp = state.battle.enemyHp;
    const afterPlayerHp = battlePlayerPet.value?.currentHp ?? beforePlayerHp;
    const enemyDamage = Math.max(0, beforeEnemyHp - afterEnemyHp);
    const playerDamage = Math.max(0, beforePlayerHp - afterPlayerHp);
    const playerHeal = Math.max(0, afterPlayerHp - beforePlayerHp);
    playerAttack.value = false;
    if (skill.type === 'heal' && playerHeal > 0) healText.value = `+${playerHeal}`;
    if (enemyDamage > 0) {
      enemyHit.value = true;
      enemyDamageText.value = `-${enemyDamage}`;
    }
    if (playerDamage > 0) {
      schedule(() => { enemyAttack.value = true; }, 180);
      schedule(() => {
        enemyAttack.value = false;
        playerHit.value = true;
        playerDamageText.value = `-${playerDamage}`;
      }, 420);
    }
  }, 260);

  schedule(() => {
    unlockAction();
    maybeShowResult();
  }, 1100);
}
</script>

<template>
  <section class="screen battle-screen" v-if="battlePlayer && battleEnemy && battlePlayerPet && playerStats && enemyStats">
    <header class="game-header">
      <div>
        <p class="eyebrow">{{ state.battle.habitat }} · 野外挑战</p>
        <h1>萌灵对战</h1>
      </div>
      <button class="soft-button compact" type="button" :disabled="actionLocked" @click="leaveBattle('map', '回到小岛，换个地方也可以挑战。')">回小岛</button>
      <button class="soft-button compact" type="button" :disabled="actionLocked" @click="leaveBattle('home', '回小屋休息一下，恢复生命再出发。')">去小屋</button>
    </header>

    <div class="battle-layout" :class="{ 'battle-layout--animating': isAnimating }">
      <article class="fighter-card player-fighter" :class="{ 'fighter-card--attack': playerAttack, 'fighter-card--hit': playerHit }">
        <span v-if="playerDamageText" class="damage-pop player-damage">{{ playerDamageText }}</span>
        <span v-if="healText" class="damage-pop heal-pop">{{ healText }}</span>
        <div class="fighter-meta"><span>我方 · 已装备 {{ playerEquipmentCount }}/4</span><strong>{{ battlePlayer.name }} Lv.{{ battlePlayerPet.level ?? 1 }}</strong></div>
        <SpiritArt :spirit="battlePlayer" size="large" />
        <div class="fighter-tags"><span>{{ battlePlayer.element }}系</span><span>{{ battlePlayer.rarity }}</span><span>经验 {{ expText }}</span></div>
        <div class="hp-panel"><div class="hp-label"><strong>生命</strong><span>{{ playerHpText }}</span></div><div class="hp-bar"><span class="hp-fill player-hp" :style="{ width: `${playerHpPercent}%` }"></span></div></div>
        <div class="energy-panel"><div class="hp-label"><strong>能量</strong><span>{{ playerEnergyPercent }} / 100</span></div><div class="energy-bar"><span class="energy-fill" :style="{ width: `${playerEnergyPercent}%` }"></span></div></div>
        <div class="battle-stats"><span>力量 {{ playerStats.power }}</span><span>防御 {{ playerStats.defense }}</span><span>魔法 {{ playerStats.magic }}</span></div>
      </article>

      <div class="battle-center">
        <div v-if="ultimateBurst" class="ultimate-burst"><i></i><i></i><i></i></div>
        <div v-if="battleTip" class="battle-callout">{{ battleTip }}</div>
        <div v-if="playerAttack" class="battle-projectile" :class="[`battle-projectile--${effectKind}`, `battle-projectile--${effectElement}`, { 'battle-projectile--ultimate': ultimateBurst }]"><span></span></div>
        <div v-if="enemyAttack" class="enemy-projectile"><span></span></div>
        <strong>VS</strong>
        <p v-if="state.battle.status === 'active'">{{ isAnimating ? '出招中' : '选择一个技能' }}</p>
        <p v-else-if="state.battle.status === 'won'">挑战胜利</p>
        <p v-else>挑战结束</p>
      </div>

      <article class="fighter-card enemy-fighter" :class="{ 'fighter-card--enemy-attack': enemyAttack, 'fighter-card--hit': enemyHit }">
        <span v-if="enemyDamageText" class="damage-pop enemy-damage">{{ enemyDamageText }}</span>
        <div class="fighter-meta"><span>野外 · 无装备</span><strong>{{ battleEnemy.name }} Lv.{{ state.battle.enemyLevel }}</strong></div>
        <SpiritArt :spirit="battleEnemy" size="large" />
        <div class="fighter-tags"><span>{{ battleEnemy.element }}系</span><span>{{ battleEnemy.rarity }}</span><span>{{ enemyTemperamentText }}</span></div>
        <div v-if="enemyConditionText" class="condition-chip">{{ enemyConditionText }}</div>
        <div class="hp-panel"><div class="hp-label"><strong>生命</strong><span>{{ enemyHpText }}</span></div><div class="hp-bar"><span class="hp-fill enemy-hp" :style="{ width: `${enemyHpPercent}%` }"></span></div></div>
        <div class="battle-stats"><span>力量 {{ enemyStats.power }}</span><span>防御 {{ enemyStats.defense }}</span><span>魔法 {{ enemyStats.magic }}</span></div>
      </article>

      <aside class="battle-command-panel">
        <div class="skill-grid" v-if="state.battle.status === 'active'">
          <button
            v-for="skill in battlePlayer.skills"
            :key="skill.id"
            class="skill-button"
            :class="skillButtonClass(skill)"
            type="button"
            :disabled="isSkillDisabled(skill)"
            @pointerdown.prevent
            @click.prevent="useSkillWithEffects(skill)"
          >
            <strong>{{ skill.name }}</strong><span>{{ skillLabel(skill) }} · {{ skill.description }}</span>
          </button>
        </div>
        <div class="battle-log battle-log--full" aria-live="polite"><strong>对战记录</strong><p v-for="line in state.battle.log.slice(0, 5)" :key="line">{{ line }}</p></div>
      </aside>
    </div>
  </section>
</template>