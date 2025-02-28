<script setup lang="ts">
  defineProps<{ href: string }>();
</script>

<template>
  <a :href="href" class="text-sm text-blue-600 hover:underline">
    <slot />
  </a>
</template>
