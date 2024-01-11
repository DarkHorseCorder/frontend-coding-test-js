import { ref } from 'vue'

export default function useToast() {
  const toasts = ref([])

  function removeToast(id) {
    toasts.value = [...toasts.value.filter((toast) => toast.id !== id)]
  }

  function addToast(message, type = 'success') {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  return { toasts, addToast, removeToast }
}
