<script setup lang="ts">
import { computed } from 'vue';
import SpiritArt from './SpiritArt.vue';
import { expToNext } from '../data/battle';
import { capturedSpirits, getEquippedItems, getPetState, getPetStats, selectBattleSpirit, showView, startWildBattle, state } from '../stores/gameState';

const selectedSpirit = computed(() => capturedSpirits.value.find((spirit) => spirit.spiritId === state.battlePrep.selectedId) ?? null);

function hpText(spiritId: string) {
  const pet = getPetState(spiritId);
  const stats = getPetStats(spiritId);
  if (!pet || !stats) return '0 / 0';
  return `${pet.currentHp ?? stats.hp} / ${stats.hp}`;
}

function expText(spiritId: string) {
  const spirit = capturedSpirits.value.find((item) => item.spiritId === spiritId);
  const pet = getPetState(spiritId);
  if (!spirit || !pet) return '';
  const need = expToNext(pet.level ?? 1, spirit.rarity);
  return need <= 0 ? '满级' : `${pet.exp ?? 0}/${need}`;
}

function equipmentCount(spiritId: string) {
  const equipped = getEquippedItems(spiritId);
  return Object.values(equipped).filter(Boolean).length;
}

function isTired(spiritId: string) {
  const pet = getPetState(spiritId);
  return !pet || (pet.currentHp ?? 0) <= 0;
}

function beginBattle() {
  if (!state.battlePrep.selectedId) return;
  startWildBattle(state.battlePrep.habitat, state.battlePrep.selectedId);
}
</script>

<template>
  <section class="screen battle-prep-screen">
    <header class="game-header">
      <div>
        <p class="eyebrow">{{ state.battlePrep.habitat }} · 野外挑战</p>
        <h1>选择出战萌灵</h1>
      </div>
      <button class="soft-button compact" type="button" @click="showView('map', '换个地方也可以挑战。')">回小岛</button>
      <button class="soft-button compact" type="button" @click="showView('home', '累了就回小屋恢复和整理装备。')">去小屋</button>
    </header>

    <div class="battle-prep-layout">
      <div class="fighter-select-grid" aria-label="选择出战萌灵">
        <button
          v-for="spirit in capturedSpirits"
          :key="spirit.spiritId"
          class="fighter-select-card"
          :class="{ active: state.battlePrep.selectedId === spirit.spiritId, tired: isTired(spirit.spiritId) }"
          type="button"
          :disabled="isTired(spirit.spiritId)"
          @click="selectBattleSpirit(spirit.spiritId)"
        >
          <SpiritArt :spirit="spirit" size="small" />
          <strong>{{ spirit.name }} Lv.{{ getPetState(spirit.spiritId)?.level ?? 1 }}</strong>
          <span>{{ spirit.element }}系 · {{ spirit.rarity }}</span>
          <span>生命 {{ hpText(spirit.spiritId) }}</span>
          <em>{{ isTired(spirit.spiritId) ? '先恢复' : `装备 ${equipmentCount(spirit.spiritId)}/4 · 经验 ${expText(spirit.spiritId)}` }}</em>
        </button>
      </div>

      <aside class="battle-prep-panel">
        <div class="message-card" aria-live="polite">
          <strong>出战准备</strong>
          <p>{{ state.message }}</p>
        </div>

        <article class="chosen-fighter" v-if="selectedSpirit">
          <SpiritArt :spirit="selectedSpirit" size="large" />
          <h2>{{ selectedSpirit.name }}</h2>
          <p>{{ selectedSpirit.element }}系 · {{ selectedSpirit.rarity }} · 生命 {{ hpText(selectedSpirit.spiritId) }}</p>
          <p class="difficulty-note">玩家萌灵会带着装备出战，野外萌灵没有装备。</p>
        </article>

        <article class="chosen-fighter empty" v-else>
          <h2>没有可出战萌灵</h2>
          <p>回小屋点“恢复全部”，它们就能继续挑战。</p>
        </article>

        <button class="primary-button battle-start-button" type="button" :disabled="!state.battlePrep.selectedId" @click="beginBattle">开始挑战</button>
      </aside>
    </div>
  </section>
</template>
