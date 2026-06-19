<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import SpiritArt from './SpiritArt.vue';
import { careFor, capturedSpirits, showView, state } from '../stores/gameState';

const selectedId = ref('');

watchEffect(() => {
  if (!selectedId.value && capturedSpirits.value.length) {
    selectedId.value = capturedSpirits.value[0].spiritId;
  }
});

const selectedSpirit = computed(() => capturedSpirits.value.find((spirit) => spirit.spiritId === selectedId.value));
const selectedPet = computed(() => (selectedSpirit.value ? state.save.captured[selectedSpirit.value.spiritId] : null));
</script>

<template>
  <section class="screen home-screen">
    <header class="game-header">
      <div>
        <p class="eyebrow">喂食 · 洗澡 · 摸摸</p>
        <h1>萌灵小屋</h1>
      </div>
      <button class="soft-button compact" type="button" @click="showView('map', '照顾完萌灵，再去小岛看看吧。')">回小岛</button>
      <button class="soft-button compact" type="button" @click="showView('dex')">看图鉴</button>
    </header>

    <div class="home-layout">
      <aside class="pet-list">
        <h2>已入住</h2>
        <p v-if="!capturedSpirits.length">小屋还空着，先去小岛探索吧。</p>
        <button
          v-for="spirit in capturedSpirits"
          :key="spirit.spiritId"
          class="pet-tab"
          :class="{ active: selectedId === spirit.spiritId }"
          type="button"
          @click="selectedId = spirit.spiritId"
        >
          {{ spirit.name }}
        </button>
      </aside>

      <article class="home-card">
        <template v-if="selectedSpirit && selectedPet">
          <SpiritArt :spirit="selectedSpirit" size="large" />
          <div class="pet-info">
            <h2>{{ selectedSpirit.name }}</h2>
            <p>{{ selectedSpirit.element }}系 · 最爱{{ selectedSpirit.favoriteFood }} · {{ selectedPet.mood }}</p>
          </div>

          <div class="meters">
            <label>
              亲密度 {{ selectedPet.affection }}
              <progress max="100" :value="selectedPet.affection"></progress>
            </label>
            <label>
              饱腹度 {{ selectedPet.hunger }}
              <progress max="100" :value="selectedPet.hunger"></progress>
            </label>
            <label>
              清洁度 {{ selectedPet.cleanliness }}
              <progress max="100" :value="selectedPet.cleanliness"></progress>
            </label>
          </div>

          <div class="care-actions">
            <button class="primary-button" type="button" @click="careFor(selectedSpirit.spiritId, 'feed')">喂食</button>
            <button class="soft-button" type="button" @click="careFor(selectedSpirit.spiritId, 'clean')">洗澡</button>
            <button class="soft-button" type="button" @click="careFor(selectedSpirit.spiritId, 'pet')">摸摸</button>
          </div>
        </template>

        <template v-else>
          <div class="empty-home">
            <h2>小屋还空着</h2>
            <p>去小岛探索，邀请第一只萌灵入住吧。</p>
            <button class="primary-button" type="button" @click="showView('map')">去探索</button>
          </div>
        </template>
      </article>

      <aside class="message-card home-message" aria-live="polite">
        <strong>小屋消息</strong>
        <p>{{ state.message }}</p>
      </aside>
    </div>
  </section>
</template>
