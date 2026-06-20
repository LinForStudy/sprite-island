<script setup lang="ts">
defineProps<{
  progress?: Record<string, { discovered: number; total: number; remaining: number; streak: number }>;
}>();

const emit = defineEmits<{
  explore: [habitat: string];
  home: [];
}>();

const locations = [
  { habitat: '花林', label: '花林', x: 250, y: 128, color: '#93d47b' },
  { habitat: '池塘', label: '池塘', x: 450, y: 115, color: '#78c9ef' },
  { habitat: '珊瑚湾', label: '珊瑚湾', x: 650, y: 145, color: '#83d4ea' },
  { habitat: '草丛', label: '草丛', x: 180, y: 260, color: '#7ed982' },
  { habitat: '暖石', label: '暖石', x: 715, y: 285, color: '#ffb36d' },
  { habitat: '熔灯台', label: '熔灯台', x: 540, y: 270, color: '#ff8f6d' },
  { habitat: '化石坡', label: '化石坡', x: 305, y: 360, color: '#d2b78e' },
  { habitat: '山洞', label: '山洞', x: 440, y: 438, color: '#bba58c' },
  { habitat: '风车', label: '风车', x: 625, y: 430, color: '#ffe66d' },
  { habitat: '星磁塔', label: '星磁塔', x: 765, y: 430, color: '#88d8f2' },
  { habitat: '云台', label: '云台', x: 155, y: 430, color: '#bde9e5' },
  { habitat: '彩云桥', label: '彩云桥', x: 285, y: 505, color: '#a6ddd6' }
];
</script>

<template>
  <svg class="island-map island-map--wide" viewBox="0 0 960 620" role="img" aria-label="萌灵小岛地图">
    <defs>
      <filter id="mapShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#31575a" flood-opacity=".18" />
      </filter>
      <linearGradient id="islandGreen" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#b9ea8b" />
        <stop offset="1" stop-color="#8fd176" />
      </linearGradient>
    </defs>
    <rect width="960" height="620" rx="34" fill="#bde9f5" />
    <path d="M0 410c98-48 168-38 250 7 105 58 185 51 275 8 116-55 226-42 435 35v160H0Z" fill="#8dd7e8" opacity=".75" />
    <path d="M105 315c8-143 129-241 310-251 211-12 391 81 418 234 26 149-117 238-361 238-224 0-377-76-367-221Z" fill="url(#islandGreen)" stroke="#31575a" stroke-width="7" filter="url(#mapShadow)" />
    <path d="M177 315c42-93 151-154 292-160 151-6 275 59 322 169-61 64-163 100-312 104-139 4-239-34-302-113Z" fill="#c8eb91" opacity=".72" />
    <path d="M98 486c48 35 112 48 190 40 40 35 91 53 154 53 109 0 183-49 216-118" fill="none" stroke="#78c9ef" stroke-width="17" opacity=".32" stroke-linecap="round" />

    <g class="home-button" tabindex="0" role="button" aria-label="进入萌灵小屋" @click="emit('home')" @keydown.enter="emit('home')">
      <path d="M820 333h96v78h-96Z" fill="#ffdca3" stroke="#31575a" stroke-width="6" />
      <path d="m810 338 58-54 58 54Z" fill="#ff9f7c" stroke="#31575a" stroke-width="6" stroke-linejoin="round" />
      <rect x="855" y="371" width="25" height="40" rx="8" fill="#8f6c55" />
      <circle cx="876" cy="391" r="3" fill="#fff6c6" />
      <text x="868" y="432" text-anchor="middle" class="map-text">小屋</text>
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
      <circle :cx="item.x" :cy="item.y" r="42" :fill="item.color" stroke="#31575a" stroke-width="5" />

      <g v-if="item.habitat === '草丛'">
        <path d="M155 274c-12-32 2-49 23-18 6-30 26-30 30 2 24-20 36-3 20 20" fill="#5fbc62" stroke="#31575a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <g v-else-if="item.habitat === '花林'">
        <path d="M230 142c5-35 45-37 50-1" fill="#5fbc62" stroke="#31575a" stroke-width="4" />
        <circle cx="238" cy="121" r="12" fill="#ffd5e2" stroke="#31575a" stroke-width="4" />
        <circle cx="263" cy="114" r="11" fill="#fff1a8" stroke="#31575a" stroke-width="4" />
      </g>
      <g v-else-if="item.habitat === '池塘'">
        <ellipse cx="450" cy="118" rx="30" ry="18" fill="#d6fbff" stroke="#31575a" stroke-width="4" />
        <circle cx="434" cy="103" r="5" fill="#d6fbff" stroke="#31575a" stroke-width="3" />
        <circle cx="470" cy="100" r="7" fill="#d6fbff" stroke="#31575a" stroke-width="3" />
      </g>
      <g v-else-if="item.habitat === '珊瑚湾'">
        <path d="M632 160c-8-28 10-35 18-11 4-30 23-29 23 1 16-19 31-8 19 13" fill="#ffb8be" stroke="#31575a" stroke-width="4" stroke-linecap="round" />
        <circle cx="652" cy="132" r="8" fill="#dff9ff" stroke="#31575a" stroke-width="3" />
      </g>
      <g v-else-if="item.habitat === '暖石'">
        <path d="M690 301c-9-28 9-48 33-44 28 4 39 28 20 48-15 16-44 16-53-4Z" fill="#d8b085" stroke="#31575a" stroke-width="4" />
        <path d="M713 252c7-18 18-21 25-5" stroke="#fff4a8" stroke-width="5" stroke-linecap="round" />
      </g>
      <g v-else-if="item.habitat === '熔灯台'">
        <path d="M540 292v-48" stroke="#31575a" stroke-width="6" stroke-linecap="round" />
        <path d="M521 250c5-30 33-39 42-5 3 13-6 25-21 27-14-3-23-11-21-22Z" fill="#ffdf7c" stroke="#31575a" stroke-width="4" />
      </g>
      <g v-else-if="item.habitat === '风车'">
        <path d="M625 438v-45" stroke="#31575a" stroke-width="6" stroke-linecap="round" />
        <circle cx="625" cy="390" r="7" fill="#fff6c6" stroke="#31575a" stroke-width="4" />
        <path d="M625 388l-31-14 27 22-11 31 19-27 32 9-27-19 7-32Z" fill="#fff6c6" stroke="#31575a" stroke-width="4" stroke-linejoin="round" />
      </g>
      <g v-else-if="item.habitat === '星磁塔'">
        <path d="M747 455h37l-8-56h-21Z" fill="#dff7ff" stroke="#31575a" stroke-width="4" />
        <path d="m766 392 12-18-1 18 16-3-14 12 3 17-15-10-13 10 5-17-14-11Z" fill="#ffe66d" stroke="#31575a" stroke-width="3" />
      </g>
      <g v-else-if="item.habitat === '山洞'">
        <path d="M407 456c5-43 65-58 77-1Z" fill="#8f765d" stroke="#31575a" stroke-width="5" />
        <path d="M432 456c4-22 28-30 34 0Z" fill="#405154" />
      </g>
      <g v-else-if="item.habitat === '化石坡'">
        <path d="M276 378c19-28 67-24 78 3-20 18-57 18-78-3Z" fill="#e5d2ad" stroke="#31575a" stroke-width="4" />
        <path d="M300 353c14 15 28 16 44 0" fill="none" stroke="#8f765d" stroke-width="4" stroke-linecap="round" />
      </g>
      <g v-else-if="item.habitat === '云台'">
        <circle cx="135" cy="432" r="18" fill="#efffff" stroke="#31575a" stroke-width="4" />
        <circle cx="158" cy="419" r="23" fill="#efffff" stroke="#31575a" stroke-width="4" />
        <circle cx="181" cy="433" r="18" fill="#efffff" stroke="#31575a" stroke-width="4" />
      </g>
      <g v-else>
        <path d="M246 507c38-23 72-23 110 0" fill="none" stroke="#ffd5e2" stroke-width="10" stroke-linecap="round" />
        <path d="M250 519c35-17 68-17 102 0" fill="none" stroke="#ffe66d" stroke-width="9" stroke-linecap="round" />
        <circle cx="286" cy="497" r="11" fill="#efffff" stroke="#31575a" stroke-width="4" />
      </g>

      <text :x="item.x" :y="item.y + 58" text-anchor="middle" class="map-text">{{ item.label }}</text>
      <rect :x="item.x - 34" :y="item.y - 62" width="68" height="28" rx="14" fill="#fffaf0" stroke="#31575a" stroke-width="4" />
      <text :x="item.x" :y="item.y - 42" text-anchor="middle" class="map-progress-text">
        {{ progress?.[item.habitat]?.discovered ?? 0 }}/{{ progress?.[item.habitat]?.total ?? 0 }}
      </text>
    </g>
  </svg>
</template>