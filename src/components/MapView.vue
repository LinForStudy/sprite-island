<script setup lang="ts">
import IslandMapArt from './IslandMapArt.vue';
import SaveTools from './SaveTools.vue';
import { capturedCount, discoveredCount, exploreHabitat, habitatProgress, hasCapturedSpirits, openBattlePrep, showView, state } from '../stores/gameState';
import { habitatNames, spirits } from '../data/spirits';
</script>

<template>
  <section class="screen map-screen">
    <header class="game-header map-header">
      <div>
        <p class="eyebrow">原创萌灵 · 小岛探索</p>
        <h1>萌灵小岛</h1>
      </div>
      <div class="map-header-tools">
        <div class="stats">
          <span>发现 {{ discoveredCount }} / {{ spirits.length }}</span>
          <span>入住 {{ capturedCount }} / {{ spirits.length }}</span>
        </div>
        <SaveTools />
      </div>
    </header>

    <div class="map-layout">
      <div class="map-stage">
        <IslandMapArt :progress="habitatProgress" @explore="exploreHabitat" @home="showView('home', '欢迎回到萌灵小屋。')" />
      </div>

      <aside class="side-panel">
        <div class="message-card" aria-live="polite">
          <strong>今日小提示</strong>
          <p>{{ state.message }}</p>
        </div>

        <div class="habitat-progress-list" aria-label="各地点发现进度">
          <div v-for="habitat in habitatNames" :key="habitat" class="habitat-progress-row">
            <button class="habitat-progress-item" type="button" @click="exploreHabitat(habitat)">
              <span>{{ habitat }}</span>
              <strong>{{ habitatProgress[habitat]?.discovered ?? 0 }} / {{ habitatProgress[habitat]?.total ?? 0 }}</strong>
            </button>
            <button
              class="challenge-button"
              type="button"
              :disabled="!hasCapturedSpirits"
              :title="hasCapturedSpirits ? `${habitat}野外挑战` : '先邀请一只萌灵入住'"
              @click="openBattlePrep(habitat)"
            >
              挑战
            </button>
          </div>
        </div>

        <button class="primary-button" type="button" @click="showView('dex')">打开萌灵图鉴</button>
        <button class="soft-button" type="button" @click="showView('home')">进入萌灵小屋</button>
      </aside>
    </div>
  </section>
</template>