<script setup lang="ts">
import type { Spirit } from '../data/spirits';

const props = defineProps<{
  spirit?: Spirit;
  locked?: boolean;
  size?: 'small' | 'medium' | 'large';
}>();

const dark = '#263c40';
</script>

<template>
  <svg
    class="spirit-art"
    :class="[`spirit-art--${props.size ?? 'medium'}`, { 'spirit-art--locked': props.locked }]"
    viewBox="0 0 220 190"
    role="img"
    :aria-label="props.locked ? '未发现的萌灵剪影' : `${props.spirit?.name ?? '萌灵'}插画`"
  >
    <defs>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#31575a" flood-opacity="0.18" />
      </filter>
    </defs>

    <g v-if="props.locked || !props.spirit" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="60" ry="10" fill="#94a8a8" opacity=".25" />
      <path d="M73 82c6-33 68-35 78-1 20 7 30 24 27 45-4 31-28 47-67 47-42 0-68-17-70-48-1-21 10-36 32-43Z" fill="#cbd8d6" stroke="#5f7373" stroke-width="6" />
      <circle cx="94" cy="116" r="7" fill="#5f7373" />
      <circle cx="126" cy="116" r="7" fill="#5f7373" />
      <circle cx="110" cy="139" r="5" fill="#5f7373" />
    </g>

    <g v-else-if="props.spirit.shape === 'leaf-bun'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="62" ry="10" fill="#31575a" opacity=".14" />
      <path d="M84 54c-16-26-3-39 25-20 4 10-7 28-25 20Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="5" />
      <path d="M127 54c18-25 35-12 21 19-12 4-29-5-21-19Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="5" />
      <ellipse cx="110" cy="111" rx="64" ry="57" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="88" cy="105" r="7" :fill="dark" />
      <circle cx="132" cy="105" r="7" :fill="dark" />
      <path d="M94 129c9 9 24 9 33 0" fill="none" :stroke="dark" stroke-width="6" stroke-linecap="round" />
      <circle cx="68" cy="118" r="10" :fill="props.spirit.accentColor" opacity=".7" />
      <circle cx="152" cy="118" r="10" :fill="props.spirit.accentColor" opacity=".7" />
    </g>

    <g v-else-if="props.spirit.shape === 'sprout-deer'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="56" ry="10" fill="#31575a" opacity=".14" />
      <path d="M75 83c-16-18-12-31 8-38 18 10 20 26 4 40Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M145 83c16-18 12-31-8-38-18 10-20 26-4 40Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M88 55c-8-18 0-31 18-34 9 15 4 29-18 34Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="5" />
      <path d="M132 55c8-18 0-31-18-34-9 15-4 29 18 34Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="5" />
      <path d="M66 105c0-38 26-60 46-60s45 22 45 60c0 42-24 65-46 65s-45-23-45-65Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="92" cy="108" r="7" :fill="dark" />
      <circle cx="128" cy="108" r="7" :fill="dark" />
      <path d="M101 132c6 6 14 6 20 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'bubble-pup'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="62" ry="10" fill="#31575a" opacity=".14" />
      <circle cx="57" cy="71" r="13" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="4" opacity=".85" />
      <circle cx="165" cy="52" r="10" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="4" opacity=".85" />
      <path d="M70 83c-19-19-9-40 17-43 17 16 9 38-17 43Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M150 83c19-19 9-40-17-43-17 16-9 38 17 43Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <ellipse cx="110" cy="115" rx="62" ry="53" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="90" cy="108" r="7" :fill="dark" />
      <circle cx="130" cy="108" r="7" :fill="dark" />
      <path d="M101 127c8 7 18 7 26 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'moon-fish'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="66" ry="10" fill="#31575a" opacity=".14" />
      <path d="M55 111c-19-21-14-39 12-49 17 17 14 39-12 49Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" opacity=".9" />
      <path d="M165 111c22-21 17-41-12-50-18 18-15 41 12 50Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" opacity=".9" />
      <path d="M78 67c39-26 84 2 84 48s-45 75-84 49c20-17 30-33 30-49s-10-31-30-48Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="124" cy="104" r="8" :fill="dark" />
      <path d="M132 128c7 5 15 5 22-1" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
      <circle cx="151" cy="76" r="7" :fill="props.spirit.accentColor" />
    </g>

    <g v-else-if="props.spirit.shape === 'ember-fox'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="65" ry="10" fill="#31575a" opacity=".14" />
      <path d="M154 129c45-15 42-61 10-70 8 22-8 30-1 47 3 8 0 16-9 23Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M80 76 68 38l32 24Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="5" />
      <path d="m140 76 12-38-32 24Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="5" />
      <ellipse cx="110" cy="114" rx="59" ry="54" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path d="M92 117h36l-18 18Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" stroke-linejoin="round" />
      <circle cx="91" cy="103" r="7" :fill="dark" />
      <circle cx="129" cy="103" r="7" :fill="dark" />
    </g>

    <g v-else-if="props.spirit.shape === 'lantern-cub'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="62" ry="10" fill="#31575a" opacity=".14" />
      <circle cx="74" cy="66" r="24" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="146" cy="66" r="24" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <ellipse cx="110" cy="115" rx="64" ry="58" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <ellipse cx="110" cy="130" rx="30" ry="26" :fill="props.spirit.accentColor" opacity=".92" :stroke="dark" stroke-width="5" />
      <circle cx="90" cy="103" r="7" :fill="dark" />
      <circle cx="130" cy="103" r="7" :fill="dark" />
      <path d="M101 119c6 5 12 5 18 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'spark-mouse'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="58" ry="10" fill="#31575a" opacity=".14" />
      <path d="m79 67 11-39 21 38Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" stroke-linejoin="round" />
      <path d="m141 67-11-39-21 38Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" stroke-linejoin="round" />
      <path d="M76 112c0-43 21-66 45-61 29 6 39 34 27 75-9 32-35 47-58 34-12-7-14-26-14-48Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="94" cy="105" r="7" :fill="dark" />
      <circle cx="130" cy="105" r="7" :fill="dark" />
      <path d="M101 128c8 7 18 7 26 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
      <path d="m154 62 12-18-1 19 15-2-15 14 2 17-14-14-13 9 6-18-14-8Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="4" stroke-linejoin="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'bell-volt'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="61" ry="10" fill="#31575a" opacity=".14" />
      <path d="M76 78 68 42l31 24Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="5" />
      <path d="m144 78 8-36-31 24Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="5" />
      <path d="M58 139c-18 12-32 1-24-18 18-4 29 3 24 18Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M72 113c0-37 20-59 38-59s38 22 38 59c0 38-17 58-38 58s-38-20-38-58Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="94" cy="105" r="7" :fill="dark" />
      <circle cx="126" cy="105" r="7" :fill="dark" />
      <path d="M100 128c7 6 13 6 20 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
      <circle cx="158" cy="88" r="8" :fill="props.spirit.accentColor" />
    </g>

    <g v-else-if="props.spirit.shape === 'pebble-tot'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="62" ry="10" fill="#31575a" opacity=".14" />
      <path d="M86 61c7-19 33-18 44-4-11 16-32 18-44 4Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M57 117c0-36 30-63 65-59 34 4 55 33 44 70-9 31-39 45-72 39-25-5-37-23-37-50Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="93" cy="111" r="6" :fill="dark" />
      <circle cx="130" cy="111" r="6" :fill="dark" />
      <path d="M103 132c6 5 14 5 20 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
      <path d="M73 92c15-9 35-12 61-5" fill="none" stroke="#d7c7b2" stroke-width="5" stroke-linecap="round" opacity=".75" />
    </g>

    <g v-else-if="props.spirit.shape === 'mud-turtle'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="67" ry="10" fill="#31575a" opacity=".14" />
      <path d="M70 111c-24 1-30 19-12 32 18-2 25-15 12-32Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M150 111c24 1 30 19 12 32-18-2-25-15-12-32Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <ellipse cx="110" cy="114" rx="61" ry="49" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <ellipse cx="110" cy="111" rx="38" ry="31" :fill="props.spirit.accentColor" opacity=".7" :stroke="dark" stroke-width="5" />
      <path d="M97 58c-6-16 18-23 25-9 6 12-14 19-25 9Z" fill="#ffcf91" :stroke="dark" stroke-width="5" />
      <circle cx="92" cy="112" r="6" :fill="dark" />
      <circle cx="128" cy="112" r="6" :fill="dark" />
      <path d="M103 132c6 4 12 4 18 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'cloud-chick'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="62" ry="10" fill="#31575a" opacity=".14" />
      <circle cx="77" cy="101" r="33" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="112" cy="82" r="39" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="145" cy="104" r="33" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path d="M82 122c16 30 58 30 74 0Z" :fill="props.spirit.primaryColor" />
      <circle cx="94" cy="105" r="7" :fill="dark" />
      <circle cx="128" cy="105" r="7" :fill="dark" />
      <path d="M106 118 119 118 112 128Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="4" stroke-linejoin="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'moss-mushroom'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="58" ry="10" fill="#31575a" opacity=".14" />
      <ellipse class="spirit-leaf-sway" cx="110" cy="73" rx="55" ry="28" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="6" />
      <path d="M67 83c18-35 71-45 92 0-20 18-71 20-92 0Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="6" />
      <ellipse cx="110" cy="119" rx="51" ry="49" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="93" cy="113" r="6" :fill="dark" /><circle cx="127" cy="113" r="6" :fill="dark" />
      <path d="M101 134c7 5 11 5 18 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
      <circle class="spirit-pollen" cx="75" cy="63" r="5" fill="#fff6c6" /><circle class="spirit-pollen spirit-delay-2" cx="145" cy="60" r="4" fill="#ffd5e2" />
    </g>

    <g v-else-if="props.spirit.shape === 'bell-leaf-deer'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="58" ry="10" fill="#31575a" opacity=".14" />
      <path class="spirit-leaf-sway" d="M81 63c-12-25 2-39 25-29 2 18-8 29-25 29Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="5" />
      <path class="spirit-leaf-sway spirit-delay-2" d="M139 63c12-25-2-39-25-29-2 18 8 29 25 29Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="5" />
      <circle class="spirit-spark" cx="74" cy="81" r="8" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="4" />
      <circle class="spirit-spark spirit-delay-2" cx="146" cy="81" r="8" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="4" />
      <path d="M70 115c0-39 23-64 40-64s40 25 40 64c0 39-19 57-40 57s-40-18-40-57Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="94" cy="109" r="7" :fill="dark" /><circle cx="126" cy="109" r="7" :fill="dark" />
      <path d="M101 132c6 5 12 5 18 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'vine-lantern-snake'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="66" ry="10" fill="#31575a" opacity=".14" />
      <path class="spirit-vine-breathe" d="M61 125c17-57 106-61 116-9 7 39-42 56-86 38-28-12-23-37 8-38 29-1 48 21 38 44" fill="none" :stroke="props.spirit.primaryColor" stroke-width="26" stroke-linecap="round" />
      <path d="M61 125c17-57 106-61 116-9 7 39-42 56-86 38-28-12-23-37 8-38 29-1 48 21 38 44" fill="none" :stroke="dark" stroke-width="6" stroke-linecap="round" />
      <circle cx="91" cy="102" r="6" :fill="dark" /><circle cx="120" cy="101" r="6" :fill="dark" />
      <circle class="spirit-lantern-glow" cx="164" cy="82" r="18" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
    </g>

    <g v-else-if="props.spirit.shape === 'forest-kirin'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="62" ry="10" fill="#31575a" opacity=".14" />
      <path class="spirit-leaf-sway" d="M92 51c-2-27 26-36 37-10-8 15-20 18-37 10Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M75 90c-17-24 0-39 20-21" :stroke="dark" stroke-width="6" stroke-linecap="round" fill="none" />
      <path d="M145 90c17-24 0-39-20-21" :stroke="dark" stroke-width="6" stroke-linecap="round" fill="none" />
      <path d="M63 116c0-43 25-70 49-70s49 27 49 70c0 38-22 57-49 57s-49-19-49-57Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path class="spirit-pollen" d="M76 154c20 10 47 10 68 0" fill="none" :stroke="props.spirit.accentColor" stroke-width="5" stroke-linecap="round" />
      <circle cx="92" cy="109" r="7" :fill="dark" /><circle cx="128" cy="109" r="7" :fill="dark" />
      <path d="M100 134c8 6 14 6 22 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'shell-doze'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="64" ry="10" fill="#31575a" opacity=".14" />
      <path d="M55 118c10-50 104-75 118 0-24 30-91 31-118 0Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="6" />
      <path d="M71 112c18-21 60-35 84-3" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity=".55" />
      <ellipse class="spirit-bubble-rise" cx="110" cy="127" rx="43" ry="35" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="95" cy="124" r="6" :fill="dark" /><circle cx="125" cy="124" r="6" :fill="dark" />
      <path d="M103 143c5 4 9 4 14 0" fill="none" :stroke="dark" stroke-width="4" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'wave-porpoise'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="66" ry="10" fill="#31575a" opacity=".14" />
      <path class="spirit-fin-wave" d="M155 112c31-24 47-7 24 23-15-1-25-9-24-23Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M58 119c0-37 33-61 74-54 35 6 56 33 45 63-11 31-54 45-91 30-19-8-28-20-28-39Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path class="spirit-bubble-rise" d="M70 100c18-13 36-17 57-12" fill="none" stroke="#dff9ff" stroke-width="6" stroke-linecap="round" />
      <circle cx="102" cy="111" r="7" :fill="dark" /><path d="M114 131c7 5 13 5 20 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'pearl-heron'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="58" ry="10" fill="#31575a" opacity=".14" />
      <path class="spirit-fin-wave" d="M78 124c-28 4-40-11-24-31 20 2 30 12 24 31Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M104 52c34 12 48 49 33 87-13 33-55 39-73 13-17-26-1-67 40-100Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle class="spirit-bubble-rise" cx="101" cy="51" r="8" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="4" />
      <circle cx="105" cy="101" r="7" :fill="dark" /><path d="M113 122c6 4 12 4 18 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'tide-whale'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="70" ry="10" fill="#31575a" opacity=".14" />
      <path class="spirit-fin-wave" d="M56 122c-18-27 1-45 30-26-3 21-13 30-30 26Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M65 111c0-39 37-62 82-51 39 10 55 42 37 72-20 35-92 44-116 9-5-8-3-19-3-30Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path class="spirit-bubble-rise" d="M94 75c14-11 36-12 51-2" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity=".55" />
      <circle cx="113" cy="109" r="7" :fill="dark" /><path d="M124 129c7 5 14 5 21 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'coal-sprite'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="58" ry="10" fill="#31575a" opacity=".14" />
      <ellipse cx="110" cy="120" rx="54" ry="49" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path class="spirit-flame-flicker" d="M95 67c-5-24 20-35 18-59 22 20 34 44 10 61" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <circle cx="92" cy="116" r="7" fill="#fff6c6" /><circle cx="128" cy="116" r="7" fill="#fff6c6" />
      <path d="M101 137c7 5 11 5 18 0" fill="none" stroke="#fff6c6" stroke-width="5" stroke-linecap="round" />
      <circle class="spirit-spark" cx="65" cy="88" r="5" :fill="props.spirit.accentColor" />
    </g>

    <g v-else-if="props.spirit.shape === 'warm-horn-sheep'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="62" ry="10" fill="#31575a" opacity=".14" />
      <path d="M75 75c-31 2-35-36 0-38 24 4 24 34 0 38Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M145 75c31 2 35-36 0-38-24 4-24 34 0 38Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <ellipse cx="110" cy="118" rx="63" ry="53" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle class="spirit-flame-flicker" cx="110" cy="130" r="23" :fill="props.spirit.accentColor" opacity=".8" />
      <circle cx="91" cy="107" r="7" :fill="dark" /><circle cx="129" cy="107" r="7" :fill="dark" />
      <path d="M101 121c7 5 11 5 18 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'ember-sparrow'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="62" ry="10" fill="#31575a" opacity=".14" />
      <path class="spirit-wing-flap" d="M74 116c-38-12-39-45-3-49 21 15 23 34 3 49Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path class="spirit-wing-flap spirit-delay-2" d="M146 116c38-12 39-45 3-49-21 15-23 34-3 49Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <ellipse cx="110" cy="113" rx="43" ry="52" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path class="spirit-flame-flicker" d="M99 64c5-24 23-27 29-4-8 8-17 10-29 4Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="4" />
      <circle cx="96" cy="107" r="7" :fill="dark" /><circle cx="124" cy="107" r="7" :fill="dark" /><path d="M104 121l8 9 8-9Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="4" />
    </g>

    <g v-else-if="props.spirit.shape === 'red-cloud-kirin'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="64" ry="10" fill="#31575a" opacity=".14" />
      <path class="spirit-flame-flicker" d="M74 77c16-37 54-44 81-12-19 14-55 17-81 12Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M61 116c0-43 24-68 49-68s49 25 49 68c0 38-22 57-49 57s-49-19-49-57Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path d="M82 87c-17-24 0-38 19-20" :stroke="dark" stroke-width="5" stroke-linecap="round" fill="none" />
      <path d="M138 87c17-24 0-38-19-20" :stroke="dark" stroke-width="5" stroke-linecap="round" fill="none" />
      <circle cx="92" cy="109" r="7" :fill="dark" /><circle cx="128" cy="109" r="7" :fill="dark" />
      <path d="M100 134c8 6 14 6 22 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'magnet-bean'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="56" ry="10" fill="#31575a" opacity=".14" />
      <path d="M91 68c-26-13-37 17-22 38 16-6 22-18 22-38Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M129 68c26-13 37 17 22 38-16-6-22-18-22-38Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <ellipse cx="110" cy="118" rx="45" ry="58" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path class="spirit-spark" d="M72 55h18M81 46v18M148 57h18M157 48v18" :stroke="props.spirit.accentColor" stroke-width="5" stroke-linecap="round" />
      <circle cx="96" cy="108" r="7" :fill="dark" /><circle cx="124" cy="108" r="7" :fill="dark" />
      <path d="M101 132c7 5 11 5 18 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'blue-volt-fox'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="63" ry="10" fill="#31575a" opacity=".14" />
      <path d="M80 77 67 36l36 25Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="5" />
      <path d="m140 77 13-41-36 25Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="5" />
      <path class="spirit-spark" d="m158 103 19-23-6 25 20-4-22 18 5 24-18-17-18 13 9-25-18-11Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="4" stroke-linejoin="round" />
      <ellipse cx="110" cy="116" rx="58" ry="53" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="91" cy="106" r="7" :fill="dark" /><circle cx="129" cy="106" r="7" :fill="dark" />
      <path d="M101 129c7 6 11 6 18 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'starwire-crane'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="60" ry="10" fill="#31575a" opacity=".14" />
      <path class="spirit-wing-flap" d="M82 124c-33 7-45-14-25-37 23 5 31 18 25 37Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M113 52c34 14 42 52 22 88-17 31-54 31-68 3-13-27 7-67 46-91Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path class="spirit-spark" d="M75 78c31-22 72-19 103 6" fill="none" :stroke="props.spirit.accentColor" stroke-width="4" stroke-linecap="round" stroke-dasharray="8 8" />
      <circle cx="106" cy="101" r="7" :fill="dark" /><path d="M114 123c6 4 12 4 18 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'aurora-thunder-deer'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="62" ry="10" fill="#31575a" opacity=".14" />
      <path class="spirit-spark" d="M85 65c-7-30 12-43 28-17-6 18-14 22-28 17Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path class="spirit-spark spirit-delay-2" d="M135 65c7-30-12-43-28-17 6 18 14 22 28 17Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M68 113c0-42 22-66 44-66s44 24 44 66c0 39-20 58-44 58s-44-19-44-58Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path class="spirit-ribbon-flow" d="M72 91c27-20 51-20 78 0" fill="none" :stroke="props.spirit.accentColor" stroke-width="5" stroke-linecap="round" opacity=".7" />
      <circle cx="94" cy="108" r="7" :fill="dark" /><circle cx="126" cy="108" r="7" :fill="dark" />
      <path d="M101 133c7 5 11 5 18 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'sand-cookie'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="61" ry="10" fill="#31575a" opacity=".14" />
      <circle cx="110" cy="117" r="57" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path class="spirit-stone-shiver" d="M72 95c25-16 57-17 80-2M77 139c22 15 48 17 70 3" fill="none" :stroke="props.spirit.accentColor" stroke-width="5" stroke-linecap="round" opacity=".75" />
      <circle cx="91" cy="111" r="6" :fill="dark" /><circle cx="129" cy="111" r="6" :fill="dark" />
      <path d="M101 132c7 5 11 5 18 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'shellback-rhino'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="68" ry="10" fill="#31575a" opacity=".14" />
      <path d="M60 122c0-42 38-66 86-58 37 6 55 33 46 66-12 42-98 52-126 15-5-7-6-15-6-23Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path class="spirit-stone-shiver" d="M80 95c23-26 69-23 88 4-22 18-67 17-88-4Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M152 113l34-9-18 24Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" stroke-linejoin="round" />
      <circle cx="104" cy="115" r="7" :fill="dark" /><path d="M118 135c7 4 13 4 20 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'amber-lizard'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="66" ry="10" fill="#31575a" opacity=".14" />
      <path class="spirit-stone-shiver" d="M150 128c36 7 42 29 12 38-19-7-23-20-12-38Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M57 119c0-37 33-60 72-53 33 6 53 32 43 62-10 30-53 42-87 28-19-8-28-19-28-37Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle class="spirit-lantern-glow" cx="169" cy="145" r="10" :fill="props.spirit.accentColor" />
      <circle cx="101" cy="112" r="7" :fill="dark" /><path d="M114 132c7 5 13 5 20 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'ancient-rock-whale'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="72" ry="10" fill="#31575a" opacity=".14" />
      <path d="M55 112c0-39 39-64 91-55 44 8 63 40 44 73-21 36-98 45-126 10-7-8-9-17-9-28Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path class="spirit-stone-shiver" d="M82 91c21-16 63-17 86 1M76 126c31 17 68 18 97 0" fill="none" :stroke="props.spirit.accentColor" stroke-width="5" stroke-linecap="round" opacity=".8" />
      <path d="M55 117c-20-22-3-39 25-23" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <circle cx="113" cy="108" r="7" :fill="dark" /><path d="M126 128c8 5 14 5 22 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'cloudfluff-rabbit'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="58" ry="10" fill="#31575a" opacity=".14" />
      <path class="spirit-ribbon-flow" d="M82 75 64 29c28 2 42 17 43 47Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path class="spirit-ribbon-flow spirit-delay-2" d="m138 75 18-46c-28 2-42 17-43 47Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <circle cx="82" cy="117" r="37" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="121" cy="105" r="48" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="99" cy="108" r="7" :fill="dark" /><circle cx="133" cy="108" r="7" :fill="dark" />
      <path d="M108 130c7 5 12 5 19 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'ribbon-sparrow'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="62" ry="10" fill="#31575a" opacity=".14" />
      <path class="spirit-wing-flap" d="M76 116c-36-8-42-38-9-49 21 12 26 29 9 49Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M144 127c29 13 27 33-1 38-16-11-16-25 1-38Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <ellipse cx="110" cy="113" rx="43" ry="52" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path class="spirit-ribbon-flow" d="M143 139c19 11 31 24 36 40" fill="none" :stroke="props.spirit.accentColor" stroke-width="6" stroke-linecap="round" />
      <circle cx="96" cy="107" r="7" :fill="dark" /><circle cx="124" cy="107" r="7" :fill="dark" /><path d="M104 121l8 9 8-9Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="4" />
    </g>

    <g v-else-if="props.spirit.shape === 'windbell-deer'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="60" ry="10" fill="#31575a" opacity=".14" />
      <path d="M83 78c-18-28 2-43 24-22" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
      <path d="M137 78c18-28-2-43-24-22" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
      <circle class="spirit-ribbon-flow" cx="82" cy="82" r="7" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="4" />
      <circle class="spirit-ribbon-flow spirit-delay-2" cx="138" cy="82" r="7" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="4" />
      <path d="M69 114c0-40 22-64 43-64s43 24 43 64c0 39-20 58-43 58s-43-19-43-58Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <circle cx="94" cy="108" r="7" :fill="dark" /><circle cx="126" cy="108" r="7" :fill="dark" /><path d="M101 132c7 5 11 5 18 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>

    <g v-else-if="props.spirit.shape === 'rainbow-wing-drake'" filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="66" ry="10" fill="#31575a" opacity=".14" />
      <path class="spirit-wing-flap" d="M72 118c-36-7-47-41-12-55 24 12 30 32 12 55Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path class="spirit-wing-flap spirit-delay-2" d="M148 118c36-7 47-41 12-55-24 12-30 32-12 55Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M77 114c0-40 18-65 43-65s43 25 43 65c0 38-19 57-43 57s-43-19-43-57Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path class="spirit-ribbon-flow" d="M79 84c27-22 55-23 83-2" fill="none" :stroke="props.spirit.accentColor" stroke-width="5" stroke-linecap="round" opacity=".7" />
      <circle cx="101" cy="107" r="7" :fill="dark" /><circle cx="133" cy="107" r="7" :fill="dark" /><path d="M109 130c7 5 12 5 19 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>
    <g v-else filter="url(#softShadow)">
      <ellipse cx="110" cy="166" rx="58" ry="10" fill="#31575a" opacity=".14" />
      <path d="M79 72 58 31c24 2 38 16 42 41Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="m141 72 21-41c-24 2-38 16-42 41Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" />
      <path d="M75 113c0-36 18-58 35-58s35 22 35 58c0 39-15 59-35 59s-35-20-35-59Z" :fill="props.spirit.primaryColor" :stroke="dark" stroke-width="6" />
      <path d="M63 86c-25-8-34 10-17 29 19-2 27-12 17-29Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" opacity=".9" />
      <path d="M157 86c25-8 34 10 17 29-19-2-27-12-17-29Z" :fill="props.spirit.accentColor" :stroke="dark" stroke-width="5" opacity=".9" />
      <circle cx="95" cy="105" r="7" :fill="dark" />
      <circle cx="125" cy="105" r="7" :fill="dark" />
      <path d="M101 128c7 6 11 6 18 0" fill="none" :stroke="dark" stroke-width="5" stroke-linecap="round" />
    </g>
  </svg>
</template>
