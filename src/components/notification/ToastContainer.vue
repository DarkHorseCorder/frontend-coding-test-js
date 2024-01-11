<template>
  <div class="fixed top-5 right-5 z-50 flex flex-col gap-2">
    <div
      v-for="toast in toasts"
      v-bind:key="toast.id"
      class="bg-gray-100 text-gray-800 p-4 rounded shadow-md transition-opacity duration-300 opacity-90"
      v-bind:class="{
        'bg-green-100 text-green-800 border-l-4 border-green-600':
          toast.type === 'success',
        'bg-red-100 text-red-800 border-l-4 border-red-600':
          toast.type === 'error',
      }"
    >
      <span v-if="toast.type === 'success'">✅</span>
      <span v-else-if="toast.type === 'error'">❌</span>
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const { toasts } = inject('toast')
</script>
