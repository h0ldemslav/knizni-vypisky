import {createApp} from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/style.css'
import router from "@/router"

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.mount('#app')
