<script setup lang="ts">
  import Input from '@/components/atoms/Input.vue'
  import Caption from '@/components/atoms/Label.vue'

  defineProps<{
    id: string
    caption: string
    modelValue: string
    type?: string
    placeholder?: string
  }>()

  defineEmits(['update:modelValue'])
</script>

<template>
  <label class="form-control w-full" :id="id">
    <Caption :text="caption" />
    <Input
      aria-labelledby="id"
      :type="type"
      :placeholder="placeholder"
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </label>
</template>
