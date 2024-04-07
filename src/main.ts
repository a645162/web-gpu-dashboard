import {createApp} from 'vue'
import {createPinia} from 'pinia'
import './style.css'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 暗色主题
import 'element-plus/theme-chalk/dark/css-vars.css'

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(ElementPlus)
app.use(ContextMenu)

app.mount('#app')
