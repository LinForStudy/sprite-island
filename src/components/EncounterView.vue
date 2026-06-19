<script setup lang="ts">
import { ref } from 'vue';
import CandyJarArt from './CandyJarArt.vue';
import SpiritArt from './SpiritArt.vue';
import { showView, state, tryCapture } from '../stores/gameState';

const isThrowing = ref(false);

function throwCandyBall() {
  if (isThrowing.value) return;
  state.captureMotion = '';
  isThrowing.value = true;

  window.setTimeout(() => {
    tryCapture();
  }, 620);

  window.setTimeout(() => {
    isThrowing.value = false;
  }, 1120);
}
</script>

<template>
  <section class="screen encounter-screen" v-if="state.encounter">
    <header class="game-header">
      <div>
        <p class="eyebrow">{{ state.encounter.habitat }}里发现了新朋友</p>
        <h1>遇见 {{ state.encounter.name }}</h1>
      </div>
      <button class="soft-button compact" type="button" @click="showView('map', '小岛上还有很多地方可以看看。')">回小岛</button>
    </header>

    <div class="encounter-layout">
      <article class="spirit-card big-card" :class="state.captureMotion === 'sparkle' ? 'success-pop' : ''">
        <div v-if="isThrowing" class="throw-lane" aria-hidden="true">
          <div class="candy-orb">
            <span></span>
          </div>
        </div>
        <SpiritArt :spirit="state.encounter" size="large" />
        <h2>{{ state.encounter.name }}</h2>
        <p class="tag-line">{{ state.encounter.element }}系 · {{ state.encounter.rarity }} · 最爱{{ state.encounter.favoriteFood }}</p>
        <p>{{ state.encounter.description }}</p>
      </article>

      <aside class="capture-panel">
        <CandyJarArt :motion="state.captureMotion" />
        <div class="message-card" aria-live="polite">
          <strong>星糖罐</strong>
          <p>{{ state.message }}</p>
        </div>
        <button class="primary-button" type="button" :disabled="isThrowing" @click="throwCandyBall">
          {{ isThrowing ? '飞过去啦' : '抛出星糖球' }}
        </button>
        <button class="soft-button" type="button" @click="showView('home', '去小屋看看新朋友吧。')">去小屋</button>
      </aside>
    </div>
  </section>
</template>
