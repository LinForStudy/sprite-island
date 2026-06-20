<script setup lang="ts">
defineProps<{
  progress?: Record<string, { discovered: number; total: number; remaining: number; streak: number }>;
}>();

const emit = defineEmits<{
  explore: [habitat: string];
  home: [];
}>();

const locations = [
  { habitat: '草丛', label: '草丛', x: 225, y: 250, color: '#7ed982' },
  { habitat: '池塘', label: '池塘', x: 430, y: 168, color: '#78c9ef' },
  { habitat: '暖石', label: '暖石', x: 650, y: 250, color: '#ffb36d' },
  { habitat: '风车', label: '风车', x: 585, y: 445, color: '#ffe66d' },
  { habitat: '山洞', label: '山洞', x: 332, y: 445, color: '#bba58c' },
  { habitat: '云台', label: '云台', x: 190, y: 420, color: '#bde9e5' }
];
</script>

<template>
  <svg class="island-map" viewBox="0 0 900 600" role="img" aria-label="萌灵小岛地图">
    <defs>
      <filter id="mapShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#31575a" flood-opacity=".18" />
      </filter>
    </defs>
    <rect width="900" height="600" rx="34" fill="#bde9f5" />
    <path d="M0 410c97-48 168-38 250 7 105 58 185 51 275 8 96-46 192-43 375 33v142H0Z" fill="#8dd7e8" opacity=".75" />
    <path d="M123 317c11-137 136-230 304-230 186 0 339 99 345 238 5 117-124 191-324 191-196 0-334-72-325-199Z" fill="#a8de7c" stroke="#31575a" stroke-width="7" filter="url(#mapShadow)" />
    <path d="M183 334c37-87 140-144 265-144 131 0 234 63 265 153-52 57-143 86-274 86-122 0-209-32-256-95Z" fill="#c8eb91" opacity=".75" />

    <g class="home-button" tabindex="0" role="button" aria-label="进入萌灵小屋" @click="emit('home')" @keydown.enter="emit('home')">
      <path d="M710 390h104v83H710Z" fill="#ffdca3" stroke="#31575a" stroke-width="6" />
      <path d="m700 396 62-58 63 58Z" fill="#ff9f7c" stroke="#31575a" stroke-width="6" stroke-linejoin="round" />
      <rect x="748" y="430" width="28" height="43" rx="8" fill="#8f6c55" />
      <circle cx="770" cy="451" r="3" fill="#fff6c6" />
      <text x="762" y="494" text-anchor="middle" class="map-text">小屋</text>
    </g>

    <g
      v-for="item in locations"
      :key="item.habitat"
      class="map-location"
      tabindex="0"
      role="button"
      :aria-label="`探索${item.label}`"
      @click="emit('explore', item.habitat)"
      @keydown.enter="emit('explore', item.habitat)"
    >
      <circle :cx="item.x" :cy="item.y" r="58" :fill="item.color" stroke="#31575a" stroke-width="6" />

      <g v-if="item.habitat === '草丛'">
        <path d="M200 265c-16-40 3-62 29-23 7-38 33-38 38 3 30-25 46-4 26 25" fill="#5fbc62" stroke="#31575a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <g v-else-if="item.habitat === '池塘'">
        <ellipse cx="430" cy="171" rx="38" ry="24" fill="#d6fbff" stroke="#31575a" stroke-width="5" />
        <circle cx="410" cy="151" r="6" fill="#d6fbff" stroke="#31575a" stroke-width="4" />
        <circle cx="457" cy="146" r="8" fill="#d6fbff" stroke="#31575a" stroke-width="4" />
      </g>
      <g v-else-if="item.habitat === '暖石'">
        <path d="M617 274c-12-35 12-61 43-56 36 5 50 35 26 60-19 20-57 20-69-4Z" fill="#d8b085" stroke="#31575a" stroke-width="5" />
        <path d="M646 214c8-23 23-27 31-7" stroke="#fff4a8" stroke-width="6" stroke-linecap="round" />
      </g>
      <g v-else-if="item.habitat === '风车'">
        <path d="M585 450v-57" stroke="#31575a" stroke-width="7" stroke-linecap="round" />
        <circle cx="585" cy="391" r="9" fill="#fff6c6" stroke="#31575a" stroke-width="5" />
        <path d="M585 388l-39-18 35 28-14 40 24-35 41 12-35-24 8-41Z" fill="#fff6c6" stroke="#31575a" stroke-width="5" stroke-linejoin="round" />
      </g>
      <g v-else-if="item.habitat === '山洞'">
        <path d="M285 465c6-57 86-76 101-1Z" fill="#8f765d" stroke="#31575a" stroke-width="6" />
        <path d="M318 465c5-29 37-40 45 0Z" fill="#405154" />
      </g>
      <g v-else>
        <circle cx="165" cy="420" r="24" fill="#efffff" stroke="#31575a" stroke-width="5" />
        <circle cx="195" cy="404" r="31" fill="#efffff" stroke="#31575a" stroke-width="5" />
        <circle cx="224" cy="423" r="25" fill="#efffff" stroke="#31575a" stroke-width="5" />
      </g>

      <text :x="item.x" :y="item.y + 72" text-anchor="middle" class="map-text">{{ item.label }}</text>
      <rect :x="item.x - 38" :y="item.y - 78" width="76" height="32" rx="16" fill="#fffaf0" stroke="#31575a" stroke-width="4" />
      <text :x="item.x" :y="item.y - 55" text-anchor="middle" class="map-progress-text">
        {{ progress?.[item.habitat]?.discovered ?? 0 }}/{{ progress?.[item.habitat]?.total ?? 0 }}
      </text>
    </g>
  </svg>
</template>

