<script setup lang="ts">
defineProps<{
  modelValue: string;
  type?: string;
  placeholder?: string;
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
  <input :type="type || 'text'" :placeholder="placeholder" :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    class="input input-bordered w-full" />
</template>
