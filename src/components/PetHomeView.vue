<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import SpiritArt from './SpiritArt.vue';
import { expToNext } from '../data/battle';
import { equipmentSlots, slotLabels, type EquipmentSlot } from '../data/equipment';
import { careFor, capturedSpirits, equipItem, equipmentInstances, equipmentInstancesForSlot, getEquippedItems, getPetStats, restoreAllPets, showView, state, unequipSlot } from '../stores/gameState';

type EquipmentFilter = EquipmentSlot | 'all';

const selectedId = ref('');
const activeSlot = ref<EquipmentFilter>('all');

watchEffect(() => {
  if (state.homeSelectedId && state.save.captured[state.homeSelectedId] && selectedId.value !== state.homeSelectedId) selectedId.value = state.homeSelectedId;
  if (!selectedId.value && capturedSpirits.value.length) selectedId.value = capturedSpirits.value[0].spiritId;
  if (selectedId.value && !state.save.captured[selectedId.value]) selectedId.value = capturedSpirits.value[0]?.spiritId ?? '';
});

const selectedSpirit = computed(() => capturedSpirits.value.find((spirit) => spirit.spiritId === selectedId.value));
const selectedPet = computed(() => (selectedSpirit.value ? state.save.captured[selectedSpirit.value.spiritId] : null));
const selectedStats = computed(() => (selectedSpirit.value ? getPetStats(selectedSpirit.value.spiritId) : null));
const equippedItems = computed(() => (selectedSpirit.value ? getEquippedItems(selectedSpirit.value.spiritId) : null));
const slotItems = computed(() => activeSlot.value === 'all' ? equipmentInstances.value : equipmentInstancesForSlot(activeSlot.value));

const selectedExpText = computed(() => {
  if (!selectedSpirit.value || !selectedPet.value) return '';
  const level = selectedPet.value.level ?? 1;
  const need = expToNext(level, selectedSpirit.value.rarity);
  if (need <= 0) return '满级';
  return `${selectedPet.value.exp ?? 0} / ${need}`;
});

function chooseSpirit(spiritId: string) {
  selectedId.value = spiritId;
  state.homeSelectedId = spiritId;
}

function chooseSlot(slot: EquipmentFilter) {
  activeSlot.value = slot;
}

function slotCount(slot: EquipmentSlot) {
  return equipmentInstancesForSlot(slot).length;
}

function isUnavailable(instance: { equippedBy: string }) {
  return Boolean(selectedSpirit.value && instance.equippedBy && instance.equippedBy !== selectedSpirit.value.spiritId);
}

function equipSelected(instanceId: string) {
  if (!selectedSpirit.value) return;
  equipItem(selectedSpirit.value.spiritId, instanceId);
}

function unequipSelected(slot: EquipmentSlot) {
  if (!selectedSpirit.value) return;
  unequipSlot(selectedSpirit.value.spiritId, slot);
}
</script>

<template>
  <section class="screen home-screen">
    <header class="game-header home-header">
      <div>
        <p class="eyebrow">喂食 · 装备 · 恢复</p>
        <h1>萌灵小屋</h1>
      </div>
      <button class="soft-button compact" type="button" @click="restoreAllPets" :disabled="!capturedSpirits.length">恢复全部</button>
      <button class="soft-button compact" type="button" @click="showView('map', '整理好萌灵，再去小岛看看吧。')">回小岛</button>
      <button class="soft-button compact" type="button" @click="showView('dex')">看图鉴</button>
    </header>

    <div class="home-layout home-layout--equipment home-layout--armory-center">
      <aside class="pet-list">
        <h2>已入住</h2>
        <p v-if="!capturedSpirits.length">小屋还空着，先去小岛探索吧。</p>
        <button
          v-for="spirit in capturedSpirits"
          :key="spirit.spiritId"
          class="pet-tab"
          :class="{ active: selectedId === spirit.spiritId }"
          type="button"
          @click="chooseSpirit(spirit.spiritId)"
        >
          {{ spirit.name }}
        </button>
      </aside>

      <aside class="equipment-panel" v-if="selectedSpirit && equippedItems">
        <div class="message-card home-message" aria-live="polite">
          <strong>武器库</strong>
          <p>同一件装备只能给一只萌灵穿；有多件同款时可以分别穿。</p>
        </div>

        <div class="equipment-slots equipment-slots--with-all">
          <button class="equipment-slot-button" :class="{ active: activeSlot === 'all' }" type="button" @click="chooseSlot('all')">
            <span>全部</span>
            <strong>{{ equipmentInstances.length }} 件装备</strong>
          </button>
          <button
            v-for="slot in equipmentSlots"
            :key="slot"
            class="equipment-slot-button"
            :class="{ active: activeSlot === slot }"
            type="button"
            @click="chooseSlot(slot)"
          >
            <span>{{ slotLabels[slot] }} · {{ slotCount(slot) }} 件</span>
            <strong>{{ equippedItems[slot]?.name ?? '未装备' }}</strong>
          </button>
        </div>

        <div class="equipment-list">
          <div class="equipment-list-header">
            <strong>{{ activeSlot === 'all' ? '全部装备' : slotLabels[activeSlot] }}</strong>
            <button v-if="activeSlot !== 'all'" class="mini-button" type="button" @click="unequipSelected(activeSlot)" :disabled="!equippedItems[activeSlot]">卸下</button>
          </div>

          <div class="equipment-items">
            <p v-if="!equipmentInstances.length" class="equipment-empty">打赢野外挑战，有机会获得装备。</p>
            <p v-else-if="!slotItems.length" class="equipment-empty">这个槽位还没有装备，可以点“全部”看看其他装备。</p>

            <button
              v-for="item in slotItems"
              :key="item.instanceId"
              class="equipment-item-button"
              :class="{ unavailable: isUnavailable(item) }"
              type="button"
              :disabled="isUnavailable(item)"
              @click="equipSelected(item.instanceId)"
            >
              <strong>{{ item.equipment.name }}</strong>
              <span>{{ slotLabels[item.equipment.slot] }} · {{ item.equipment.rarity }} · {{ item.equipment.description }}</span>
              <em v-if="item.equippedBy && item.equippedBy !== selectedSpirit.spiritId">已被{{ item.equippedByName }}穿戴</em>
              <em v-else-if="item.equippedBy === selectedSpirit.spiritId">当前正在穿戴</em>
              <small>
                <template v-if="item.equipment.statBonus.hp">生命 +{{ item.equipment.statBonus.hp }} </template>
                <template v-if="item.equipment.statBonus.power">力量 +{{ item.equipment.statBonus.power }} </template>
                <template v-if="item.equipment.statBonus.defense">防御 +{{ item.equipment.statBonus.defense }} </template>
                <template v-if="item.equipment.statBonus.magic">魔法 +{{ item.equipment.statBonus.magic }}</template>
              </small>
            </button>
          </div>
        </div>
      </aside>

      <article class="home-card home-card--detail">
        <template v-if="selectedSpirit && selectedPet && selectedStats">
          <SpiritArt :spirit="selectedSpirit" size="large" />
          <div class="pet-info">
            <h2>{{ selectedSpirit.name }} Lv.{{ selectedPet.level ?? 1 }}</h2>
            <p>{{ selectedSpirit.element }}系 · {{ selectedSpirit.rarity }} · 最爱{{ selectedSpirit.favoriteFood }} · {{ selectedPet.mood }}</p>
          </div>

          <div class="pet-battle-summary">
            <span>生命 {{ selectedPet.currentHp ?? selectedStats.hp }} / {{ selectedStats.hp }}</span>
            <span>经验 {{ selectedExpText }}</span>
            <span>力量 {{ selectedStats.power }}</span>
            <span>防御 {{ selectedStats.defense }}</span>
            <span>魔法 {{ selectedStats.magic }}</span>
          </div>

          <div class="meters">
            <label>亲密度 {{ selectedPet.affection }}<progress max="100" :value="selectedPet.affection"></progress></label>
            <label>饱腹度 {{ selectedPet.hunger }}<progress max="100" :value="selectedPet.hunger"></progress></label>
            <label>清洁度 {{ selectedPet.cleanliness }}<progress max="100" :value="selectedPet.cleanliness"></progress></label>
          </div>

          <div class="care-actions">
            <button class="primary-button" type="button" @click="careFor(selectedSpirit.spiritId, 'feed')">喂食</button>
            <button class="soft-button" type="button" @click="careFor(selectedSpirit.spiritId, 'clean')">清洁</button>
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
    </div>
  </section>
</template>