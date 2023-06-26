import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/style.css'
import router from '@/router'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

import { initializeApp } from '@firebase/app'
import { getAuth } from '@firebase/auth'
import { getFirestore, collection } from '@firebase/firestore'
import Config from './config'

const firebaseConfig = {
    apiKey: Config.fbApiKey,
    authDomain: Config.fbAuthDomain,
    projectId: Config.fbProjectID,
    storageBucket: Config.fbStorageBucket,
    messagingSenderId: Config.fbMessagingSenderID,
    appId: Config.fbAppID
}

initializeApp(firebaseConfig)
export const auth = getAuth()
export const db = getFirestore()
export const bookCollectionsRef = collection(db, "book_collections") // reference to the database 'table'
export const bookNotesRef = collection(db, "book_notes")

const app = createApp(App)

app.use(createPinia())
const authStore = useAuthStore()
await authStore.getCurrentAuthUserID

app.use(vuetify)
app.use(router)
app.mount('#app')
