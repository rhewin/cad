<script setup lang="ts">
  defineProps<{ text: string }>();
</script>

<template>
  <span class="label-text">{{ text }}</span>
</template>
