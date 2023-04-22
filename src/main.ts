import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/style.css'
import router from '@/router'
import { createPinia } from 'pinia'

import { initializeApp } from '@firebase/app'
import { getAuth } from '@firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCIpG_b3b7oKfZr7P5BfWuifqkSgIJ50oE",
    authDomain: "kniznivypisky.firebaseapp.com",
    projectId: "kniznivypisky",
    storageBucket: "kniznivypisky.appspot.com",
    messagingSenderId: "22864152713",
    appId: "1:22864152713:web:614805b9c2d9512f8d5e58"
}

initializeApp(firebaseConfig)
export const auth = getAuth()

const app = createApp(App)
app.use(createPinia())
app.use(vuetify)
app.use(router)
app.mount('#app')
