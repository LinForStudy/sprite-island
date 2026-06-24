<script setup lang="ts">
import { computed } from 'vue';
import SpiritArt from './SpiritArt.vue';
import { spirits } from '../data/spirits';
import { closeSpiritDetail, state } from '../stores/gameState';


const spirit = computed(() => spirits.find((item) => item.spiritId === state.detailSpiritId) ?? spirits[0]);
const profile = computed(() => spirit.value.visualProfile);
</script>

<template>
  <section class="screen spirit-detail-screen" :class="`spirit-detail-screen--${spirit.element}`">
    <div class="detail-bg" aria-hidden="true"></div>

    <header class="game-header spirit-detail-header">
      <div>
        <p class="eyebrow">萌灵设定档案</p>
        <h1>{{ spirit.name }}</h1>
      </div>
      <button class="soft-button compact" type="button" @click="closeSpiritDetail">返回</button>
    </header>

    <div class="spirit-detail-layout">
      <article class="detail-hero-panel">
        <div class="detail-art-fallback">
          <SpiritArt :spirit="spirit" size="large" />
        </div>
        <div class="detail-image-glow" aria-hidden="true"></div>
      </article>

      <aside class="detail-info-panel">
        <div class="detail-title-block">
          <span class="detail-roman">MENG LING XIAO DAO</span>
          <h2>{{ spirit.name }}</h2>
          <p>{{ profile.epithet }}</p>
        </div>

        <div class="detail-badges">
          <span>{{ spirit.element }}系</span>
          <span>{{ profile.speciesType }}</span>
          <span>{{ spirit.rarity }}</span>
        </div>

        <div class="detail-copy">
          <strong>简介</strong>
          <p>{{ spirit.description }}</p>
          <small>最爱 {{ spirit.favoriteFood }} · 栖息地 {{ spirit.habitat }}</small>
        </div>

        <div class="detail-section-title"><span></span><strong>设计细节</strong><span></span></div>
        <div class="detail-design-grid">
          <article v-for="item in profile.designDetails" :key="item.title" class="detail-design-item">
            <i></i>
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </aside>

      <section class="detail-pose-strip">
        <article v-for="pose in profile.poses" :key="pose.title" class="detail-pose-card">
          <div class="pose-mini-art">
            <SpiritArt :spirit="spirit" size="small" />
          </div>
          <strong>{{ pose.title }}</strong>
          <p>{{ pose.description }}</p>
        </article>
      </section>
    </div>
  </section>
</template>