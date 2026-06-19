<script setup lang="ts">
import DexView from './components/DexView.vue';
import EncounterView from './components/EncounterView.vue';
import MapView from './components/MapView.vue';
import PetHomeView from './components/PetHomeView.vue';
import { resetProgress, state } from './stores/gameState';
</script>

<template>
  <main class="app-shell">
    <div class="portrait-guard">
      <strong>请横屏游玩</strong>
      <p>把手机或平板横过来，小岛会变得更宽更好点。</p>
    </div>

    <div class="game-frame">
      <MapView v-if="state.view === 'map'" />
      <EncounterView v-if="state.view === 'encounter'" />
      <DexView v-if="state.view === 'dex'" />
      <PetHomeView v-if="state.view === 'home'" />

      <button class="reset-button" type="button" @click="resetProgress">重新开始</button>
    </div>
  </main>
</template>
