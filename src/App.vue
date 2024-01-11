<template>
  <div
    class="min-w-full min-h-screen font-sans text-sm antialiased bg-gray-100 text-center"
  >
    <router-view />
    <ToastContainer />
  </div>
</template>

<script setup>
import { provide } from 'vue'
import useToast from './hook/toast'
import ToastContainer from './components/notification/ToastContainer.vue'

const toast = useToast()
provide('toast', toast)
</script>
