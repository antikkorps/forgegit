import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './styles/main.css'
import App from './App.vue'
import { router } from './router'
import fr from './locales/fr.json'

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: { fr },
})

createApp(App).use(createPinia()).use(router).use(i18n).mount('#app')
