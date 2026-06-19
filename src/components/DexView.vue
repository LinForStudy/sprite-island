<script setup lang="ts">
import SpiritArt from './SpiritArt.vue';
import { spirits } from '../data/spirits';
import { capturedCount, discoveredCount, showView, state } from '../stores/gameState';
</script>

<template>
  <section class="screen dex-screen">
    <header class="game-header">
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
        :class="{ locked: !state.save.discovered[spirit.spiritId] }"
      >
        <SpiritArt :spirit="spirit" :locked="!state.save.discovered[spirit.spiritId]" size="small" />
        <h2>{{ state.save.discovered[spirit.spiritId] ? spirit.name : '神秘萌灵' }}</h2>
        <p v-if="state.save.discovered[spirit.spiritId]">
          {{ spirit.element }}系 · {{ spirit.rarity }}
        </p>
        <p v-else>去小岛探索发现它</p>
        <span class="status-pill">{{ state.save.captured[spirit.spiritId] ? '已入住' : state.save.discovered[spirit.spiritId] ? '已发现' : '未发现' }}</span>
      </article>
    </div>
  </section>
</template>
