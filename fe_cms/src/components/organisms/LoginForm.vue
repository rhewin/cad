<script setup lang="ts">
  import { ref } from 'vue'
  import FormField from '@/components/molecules/FormField.vue'
  import Button from '@/components/atoms/Button.vue'
  import Link from '@/components/atoms/Link.vue'
  import LoadingSpinner from '@/components/molecules/LoadingSpinner.vue'

  const email = ref('')
  const password = ref('')
  const loading = ref(false)

  const handleLogin = () => {
    loading.value = true
    setTimeout(() => {
      console.log('Logging in with:', email.value, password.value)
      loading.value = false
    }, 2000)
  }
</script>

<template>
  <div class="card w-96 bg-white shadow-xl p-6">
    <h2 class="text-2xl font-bold text-center">Login</h2>
    <form @submit.prevent="handleLogin" class="mt-4">
      <FormField label="Email" v-model="email" type="email" placeholder="Enter your email" />
      <FormField label="Password" v-model="password" type="password" placeholder="Enter your password" />

      <Button :disabled="loading" type="submit" class="mt-4">
        <LoadingSpinner v-if="loading" />
        <span v-else>Login</span>
      </Button>
    </form>

    <div class="text-center mt-3">
      <Link href="#">Forgot Password?</Link>
    </div>
  </div>
</template>
