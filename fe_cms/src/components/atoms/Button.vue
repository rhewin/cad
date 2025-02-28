<script setup lang="ts">
  defineProps<{
    type?: "button" | "submit";
    disabled?: boolean;
  }>();
</script>

<template>
  <button :type="type || 'button'" :disabled="disabled" class="btn btn-primary w-full">
    <slot />
  </button>
</template>
