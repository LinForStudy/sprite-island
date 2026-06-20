<script setup lang="ts">
import { computed, ref } from 'vue';
import CandyJarArt from './CandyJarArt.vue';
import SpiritArt from './SpiritArt.vue';
import { type Rarity } from '../data/spirits';
import { habitatProgress, showView, state, tryCapture, type CaptureResult } from '../stores/gameState';

const isThrowing = ref(false);

const isCaptured = computed(() => Boolean(state.encounter && state.save.captured[state.encounter.spiritId]));
const isDiscovered = computed(() => Boolean(state.encounter && state.save.discovered[state.encounter.spiritId]));

const encounterStatusText = computed(() => {
  if (isCaptured.value) return '已入住小屋';
  if (isDiscovered.value) return '图鉴已发现';
  return '新朋友';
});

const habitatProgressText = computed(() => {
  if (!state.encounter) return '';
  const progress = habitatProgress.value[state.encounter.habitat];
  if (!progress) return '';
  return progress.remaining > 0 ? `这里还剩 ${progress.remaining} 只没发现` : '这里的萌灵都见过啦';
});

const actionText = computed(() => {
  if (isThrowing.value) return '飞过去啦';
  if (isCaptured.value) return '打个招呼';
  return '抛出星糖球';
});

function rarityClass(rarity: Rarity) {
  return `rarity-${rarity}`;
}

function habitatClass(habitat: string) {
  const map: Record<string, string> = {
    草丛: 'grass',
    池塘: 'pond',
    暖石: 'warm-rock',
    风车: 'windmill',
    山洞: 'cave',
    云台: 'cloud'
  };
  return map[habitat] ?? 'grass';
}

function playTone(frequency: number, start: number, duration: number, type: OscillatorType, volume = 0.08) {
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

function playCaptureSound(kind: 'throw' | CaptureResult) {
  if (kind === 'throw') {
    playTone(520, 0, 0.08, 'triangle', 0.07);
    playTone(760, 0.09, 0.12, 'triangle', 0.06);
    return;
  }

  if (kind === 'captured' || kind === 'already') {
    playTone(660, 0, 0.1, 'sine', 0.07);
    playTone(880, 0.1, 0.12, 'sine', 0.08);
    playTone(1180, 0.22, 0.16, 'sine', 0.07);
    return;
  }

  if (kind === 'failed') {
    playTone(260, 0, 0.12, 'sawtooth', 0.045);
    playTone(190, 0.13, 0.16, 'sawtooth', 0.04);
  }
}

function throwCandyBall() {
  if (isThrowing.value) return;
  state.captureMotion = '';
  isThrowing.value = true;
  playCaptureSound('throw');

  window.setTimeout(() => {
    const result = tryCapture();
    playCaptureSound(result);
  }, 620);

  window.setTimeout(() => {
    isThrowing.value = false;
  }, 1120);
}
</script>

<template>
  <section
    class="screen encounter-screen"
    :class="state.encounter ? `encounter-screen--${habitatClass(state.encounter.habitat)}` : ''"
    v-if="state.encounter"
  >
    <header class="game-header">
      <div>
        <p class="eyebrow">{{ state.encounter.habitat }}里发现了新朋友</p>
        <h1>遇见 {{ state.encounter.name }}</h1>
      </div>
      <button class="soft-button compact" type="button" @click="showView('map', '小岛上还有很多地方可以看看。')">回小岛</button>
    </header>

    <div class="encounter-layout">
      <article class="spirit-card big-card" :class="[state.captureMotion === 'sparkle' ? 'success-pop' : '', rarityClass(state.encounter.rarity)]">
        <div class="scene-bg" :class="`scene-bg--${habitatClass(state.encounter.habitat)}`" aria-hidden="true">
          <span class="scene-mark scene-mark--one"></span>
          <span class="scene-mark scene-mark--two"></span>
          <span class="scene-mark scene-mark--three"></span>
        </div>
        <div class="encounter-status" :class="{ captured: isCaptured }">{{ encounterStatusText }}</div>
        <div v-if="isThrowing" class="throw-lane" aria-hidden="true">
          <div class="candy-orb">
            <span></span>
          </div>
        </div>
        <SpiritArt :spirit="state.encounter" size="large" />
        <h2>{{ state.encounter.name }}</h2>
        <p class="tag-line">
          {{ state.encounter.element }}系 · <span class="rarity-text">{{ state.encounter.rarity }}</span> · 最爱{{ state.encounter.favoriteFood }}
        </p>
        <p>{{ state.encounter.description }}</p>
      </article>

      <aside class="capture-panel">
        <CandyJarArt :motion="state.captureMotion" />
        <div class="message-card" aria-live="polite">
          <strong>{{ isCaptured ? '重复遇见' : '星糖罐' }}</strong>
          <p>{{ state.message }}</p>
          <small class="habitat-hint">{{ habitatProgressText }}</small>
        </div>
        <button class="primary-button" type="button" :disabled="isThrowing" @click="throwCandyBall">
          {{ actionText }}
        </button>
        <button class="soft-button" type="button" @click="showView('home', '去小屋看看新朋友吧。')">去小屋</button>
      </aside>
    </div>
  </section>
</template>
