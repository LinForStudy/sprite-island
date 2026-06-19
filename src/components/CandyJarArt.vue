<script setup lang="ts">
defineProps<{
  motion?: '' | 'shake' | 'sparkle';
}>();
</script>

<template>
  <svg class="candy-jar" :class="motion ? `candy-jar--${motion}` : ''" viewBox="0 0 180 180" role="img" aria-label="星糖罐">
    <ellipse cx="90" cy="155" rx="54" ry="10" fill="#31575a" opacity=".16" />
    <path d="M58 52c0-16 12-28 32-28s32 12 32 28v9H58Z" fill="#ffe3ec" stroke="#273d42" stroke-width="6" />
    <path d="M50 63h80c8 0 14 6 14 14v51c0 21-18 34-54 34s-54-13-54-34V77c0-8 6-14 14-14Z" fill="#ffd5e2" stroke="#273d42" stroke-width="6" />
    <path d="M48 83c18 9 38 11 61 6 15-3 26-1 36 5v23c-19-10-36-12-55-7-17 4-31 3-42-4Z" fill="#fff3aa" opacity=".9" />
    <path d="m90 83 8 16 18 2-13 12 4 18-17-9-16 9 3-18-13-12 18-2Z" fill="#ffffff" stroke="#273d42" stroke-width="5" stroke-linejoin="round" />
    <circle cx="62" cy="126" r="7" fill="#7ed982" />
    <circle cx="121" cy="128" r="8" fill="#78c9ef" />
    <circle cx="90" cy="143" r="6" fill="#ffb36d" />
    <g class="jar-sparkles">
      <path d="M33 47h20M43 37v20" stroke="#fff4a8" stroke-width="6" stroke-linecap="round" />
      <path d="M139 42h18M148 33v18" stroke="#fff4a8" stroke-width="6" stroke-linecap="round" />
      <path d="M145 139h16M153 131v16" stroke="#fff4a8" stroke-width="5" stroke-linecap="round" />
    </g>
  </svg>
</template>
