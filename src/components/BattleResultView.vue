<script setup lang="ts">
import { closeBattleResult, state } from '../stores/gameState';

const isWin = () => state.battleResult.status === 'won';
</script>

<template>
  <section class="screen battle-result-screen" :class="isWin() ? 'battle-result-screen--won' : 'battle-result-screen--lost'">
    <article class="battle-result-card">
      <div class="result-burst" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="eyebrow">{{ isWin() ? '野外挑战完成' : '需要休息一下' }}</p>
      <h1>{{ isWin() ? '挑战胜利' : '挑战结束' }}</h1>

      <div class="result-summary">
        <div><span>我方</span><strong>{{ state.battleResult.playerName }} Lv.{{ state.battleResult.playerLevel }}</strong><small>生命 {{ state.battleResult.playerHp }} / {{ state.battleResult.playerMaxHp }}</small></div>
        <div><span>野外</span><strong>{{ state.battleResult.enemyName }} Lv.{{ state.battleResult.enemyLevel }}</strong><small>{{ isWin() ? '野外萌灵无装备' : '回小屋恢复再来' }}</small></div>
      </div>

      <div class="result-reward" v-if="isWin()">
        <strong>获得经验 {{ state.battleResult.expGained }}</strong>
        <p v-if="state.battleResult.equipmentDropName">获得装备：{{ state.battleResult.equipmentDropName }}（{{ state.battleResult.equipmentDropRarity }}），已放入小屋武器库。</p>
        <p v-else>这次没有装备掉落，继续挑战还有机会。</p>
        <p v-for="message in state.battleResult.levelMessages" :key="message">{{ message }}</p>
      </div>

      <div class="result-reward result-reward--soft" v-else><strong>回小屋恢复后还能再来</strong><p>{{ state.battleResult.message }}</p></div>
      <button class="primary-button result-close-button" type="button" @click="closeBattleResult">关闭</button>
    </article>
  </section>
</template>
