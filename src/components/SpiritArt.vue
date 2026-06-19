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
