<script setup lang="ts">
import { computed, ref } from 'vue';
import { closeBattleResult, drawBattleCaptureBall, state, tryBattleCaptureAfterBattle, type CaptureResult } from '../stores/gameState';

const isWin = computed(() => state.battleResult.status === 'won');
const isDrawing = ref(false);
const isCapturing = ref(false);
const lastCaptureResult = ref<CaptureResult>('none');

const captureButtonText = computed(() => {
  if (isDrawing.value) return '抽取中';
  if (isCapturing.value) return '飞过去啦';
  if (state.battleResult.captureStatus === 'idle') return '抽收服球';
  if (state.battleResult.captureStatus === 'ready') return `抛出${state.battleResult.captureBallName}`;
  if (state.battleResult.captureStatus === 'captured') return '已经收服';
  if (state.battleResult.captureStatus === 'failed') return '本次已尝试';
  return '知道啦';
});

const canUseCaptureButton = computed(() => {
  const result = state.battleResult;
  if (!isWin.value || isDrawing.value || isCapturing.value) return false;
  if (result.captureAlreadyOwned || !result.captureEligible) return false;
  return result.captureStatus === 'idle' || result.captureStatus === 'ready';
});

function playTone(frequency: number, start: number, duration: number, type: OscillatorType, volume = 0.06) {
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

function playDrawSound() {
  playTone(420, 0, 0.08, 'triangle', 0.045);
  playTone(620, 0.09, 0.08, 'triangle', 0.05);
  playTone(880, 0.18, 0.12, 'sine', 0.06);
}

function playCaptureSound(result: CaptureResult | 'throw') {
  if (result === 'throw') {
    playTone(520, 0, 0.08, 'triangle', 0.06);
    playTone(760, 0.09, 0.12, 'triangle', 0.055);
    return;
  }
  if (result === 'captured' || result === 'already') {
    playTone(660, 0, 0.1, 'sine', 0.06);
    playTone(880, 0.1, 0.12, 'sine', 0.065);
    playTone(1180, 0.22, 0.16, 'sine', 0.06);
    return;
  }
  if (result === 'failed') {
    playTone(250, 0, 0.12, 'sawtooth', 0.035);
    playTone(190, 0.13, 0.16, 'sawtooth', 0.03);
  }
}

function handleCaptureAction() {
  const result = state.battleResult;
  if (!canUseCaptureButton.value) return;
  lastCaptureResult.value = 'none';

  if (result.captureStatus === 'idle') {
    isDrawing.value = true;
    playDrawSound();
    window.setTimeout(() => {
      drawBattleCaptureBall();
      isDrawing.value = false;
    }, 620);
    return;
  }

  if (result.captureStatus === 'ready') {
    isCapturing.value = true;
    playCaptureSound('throw');
    window.setTimeout(() => {
      const captureResult = tryBattleCaptureAfterBattle();
      lastCaptureResult.value = captureResult;
      playCaptureSound(captureResult);
    }, 720);
    window.setTimeout(() => {
      isCapturing.value = false;
    }, 1220);
  }
}
</script>

<template>
  <section class="screen battle-result-screen" :class="isWin ? 'battle-result-screen--won' : 'battle-result-screen--lost'">
    <article class="battle-result-card" :class="{ 'battle-result-card--capture': isWin }">
      <div class="result-burst" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="eyebrow">{{ isWin ? '野外挑战完成' : '需要休息一下' }}</p>
      <h1>{{ isWin ? '挑战胜利' : '挑战结束' }}</h1>

      <div class="result-summary">
        <div><span>我方</span><strong>{{ state.battleResult.playerName }} Lv.{{ state.battleResult.playerLevel }}</strong><small>生命 {{ state.battleResult.playerHp }} / {{ state.battleResult.playerMaxHp }}</small></div>
        <div><span>野外</span><strong>{{ state.battleResult.enemyName }} Lv.{{ state.battleResult.enemyLevel }}</strong><small>{{ isWin ? '野外萌灵无装备' : '回小屋恢复再来' }}</small></div>
      </div>

      <div class="result-reward" v-if="isWin">
        <strong>获得经验 {{ state.battleResult.expGained }}</strong>
        <p v-if="state.battleResult.equipmentDropName">获得装备：{{ state.battleResult.equipmentDropName }}（{{ state.battleResult.equipmentDropRarity }}），已放入小屋武器库。</p>
        <p v-else>这次没有装备掉落，继续挑战还有机会。</p>
        <p v-for="message in state.battleResult.levelMessages" :key="message">{{ message }}</p>
      </div>

      <div class="battle-capture-panel" v-if="isWin">
        <div class="capture-ball-stage" :class="[`capture-ball-stage--${state.battleResult.captureBallColor || 'empty'}`, { 'is-drawing': isDrawing, 'is-capturing': isCapturing, 'is-success': lastCaptureResult === 'captured', 'is-failed': lastCaptureResult === 'failed' }]" aria-hidden="true">
          <span class="capture-draw-ring"></span>
          <span class="capture-ball-orb"><i></i></span>
          <span class="capture-spark capture-spark--one"></span>
          <span class="capture-spark capture-spark--two"></span>
          <span class="capture-spark capture-spark--three"></span>
        </div>
        <div class="capture-copy">
          <strong v-if="state.battleResult.captureAlreadyOwned">已经收服过</strong>
          <strong v-else-if="state.battleResult.captureStatus === 'idle'">胜利收服机会</strong>
          <strong v-else-if="state.battleResult.captureBallName">{{ state.battleResult.captureBallName }} · {{ state.battleResult.captureBallTier }}</strong>
          <strong v-else>收服机会</strong>
          <p>{{ state.battleResult.captureMessage }}</p>
          <small v-if="state.battleResult.captureChance && state.battleResult.captureStatus !== 'idle'">当前成功率约 {{ Math.round(state.battleResult.captureChance * 100) }}%</small>
        </div>
        <button class="primary-button capture-action-button" type="button" :disabled="!canUseCaptureButton" @click="handleCaptureAction">{{ captureButtonText }}</button>
      </div>

      <div class="result-reward result-reward--soft" v-else><strong>回小屋恢复后还能再来</strong><p>{{ state.battleResult.message }}</p></div>
      <button class="soft-button result-close-button" type="button" @click="closeBattleResult">关闭</button>
    </article>
  </section>
</template>