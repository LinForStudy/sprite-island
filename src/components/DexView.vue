<script setup lang="ts">
import SpiritArt from './SpiritArt.vue';
import { spirits, type Rarity } from '../data/spirits';
import { capturedCount, discoveredCount, openPetHome, showView, state } from '../stores/gameState';

function rarityClass(rarity: Rarity) {
  return `rarity-${rarity}`;
}
</script>

<template>
  <section class="screen dex-screen">
    <header class="game-header dex-header">
      <div>
        <p class="eyebrow">收集记录</p>
        <h1>萌灵图鉴</h1>
      </div>
      <div class="stats">
        <span>发现 {{ discoveredCount }} / {{ spirits.length }}</span>
        <span>入住 {{ capturedCount }} / {{ spirits.length }}</span>
      </div>
      <button class="soft-button compact" type="button" @click="showView('map')">回小岛</button>
    </header>

    <div class="dex-grid">
      <article
        v-for="spirit in spirits"
        :key="spirit.spiritId"
        class="dex-card"
        :class="[{ locked: !state.save.discovered[spirit.spiritId] }, rarityClass(spirit.rarity)]"
      >
        <SpiritArt :spirit="spirit" :locked="!state.save.discovered[spirit.spiritId]" size="small" />
        <h2>{{ state.save.discovered[spirit.spiritId] ? spirit.name : '神秘萌灵' }}</h2>
        <p v-if="state.save.discovered[spirit.spiritId]">
          {{ spirit.element }}系 · <span class="rarity-text">{{ spirit.rarity }}</span>
        </p>
        <p v-else>去小岛探索发现它</p>
        <div class="dex-card-actions">
          <span class="status-pill">{{ state.save.captured[spirit.spiritId] ? '已入住' : state.save.discovered[spirit.spiritId] ? '已发现' : '未发现' }}</span>
          <button v-if="state.save.captured[spirit.spiritId]" class="dex-equip-button" type="button" @click="openPetHome(spirit.spiritId)">去装备</button>
        </div>
      </article>
    </div>
  </section>
</template>