import { createApp } from 'vue'
import './styles/main.css'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import initializeRouter from './router'

const app = createApp(App)
// Create a new QueryClient instance
const queryClient = new QueryClient()
// Create Vue application and use VueQueryPlugin
app.use(VueQueryPlugin, { queryClient }) // Provide the QueryClient to the Vue app
initializeRouter(app)

app.mount('#app')
