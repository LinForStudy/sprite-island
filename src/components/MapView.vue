<script setup lang="ts">
import IslandMapArt from './IslandMapArt.vue';
import { capturedCount, discoveredCount, exploreHabitat, showView, state } from '../stores/gameState';
import { spirits } from '../data/spirits';
</script>

<template>
  <section class="screen map-screen">
    <header class="game-header">
      <div>
        <p class="eyebrow">原创萌灵 · 小岛探索</p>
        <h1>萌灵小岛</h1>
      </div>
      <div class="stats">
        <span>发现 {{ discoveredCount }} / {{ spirits.length }}</span>
        <span>入住 {{ capturedCount }} / {{ spirits.length }}</span>
      </div>
    </header>

    <div class="map-layout">
      <div class="map-stage">
        <IslandMapArt @explore="exploreHabitat" @home="showView('home', '欢迎回到萌灵小屋。')" />
      </div>

      <aside class="side-panel">
        <div class="message-card" aria-live="polite">
          <strong>今日小提示</strong>
          <p>{{ state.message }}</p>
        </div>
        <button class="primary-button" type="button" @click="showView('dex')">打开萌灵图鉴</button>
        <button class="soft-button" type="button" @click="showView('home')">进入萌灵小屋</button>
      </aside>
    </div>
  </section>
</template>
