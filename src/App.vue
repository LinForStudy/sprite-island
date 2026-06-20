<script setup lang="ts">
import BattlePrepView from './components/BattlePrepView.vue';
import BattleResultView from './components/BattleResultView.vue';
import BattleView from './components/BattleView.vue';
import DexView from './components/DexView.vue';
import EncounterView from './components/EncounterView.vue';
import MapView from './components/MapView.vue';
import PetHomeView from './components/PetHomeView.vue';
import { state } from './stores/gameState';
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
      <BattlePrepView v-if="state.view === 'battlePrep'" />
      <BattleView v-if="state.view === 'battle'" />
      <BattleResultView v-if="state.view === 'battleResult'" />
    </div>
  </main>
</template>