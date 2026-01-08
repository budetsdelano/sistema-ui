import { createApp } from 'vue'
// import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { vMaska } from 'maska/vue'
// import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/styles/main.scss'

const app = createApp(App)
app.directive('maska', vMaska)
// app.use(createPinia())
app.use(router)
app.mount('#app')
