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

// Initialize Firebase app and other references
initializeApp(firebaseConfig)
export const auth = getAuth()
export const db = getFirestore()
export const bookCollectionsRef = collection(db, "book_collections")
export const bookNotesRef = collection(db, "book_notes")

// Create the Vue app instance
const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Create an async function to initialize the app and start the Vue app only when ready
const initializeAppAndMount = async () => {
    const authStore = useAuthStore()
    await authStore.getCurrentAuthUserID

    app.use(vuetify)
    app.use(router)
    app.mount('#app')
}

// Call the async function to initialize the app and mount the Vue app
initializeAppAndMount();