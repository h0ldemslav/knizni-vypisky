import { User } from '@/types'
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { computed } from '@vue/reactivity'
import router from '@/router/'
import { auth } from '@/main'
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged  
} from 'firebase/auth'

export const useAuthStore = defineStore("auth", () => {
    let user: User  = reactive({
        id: undefined
    })

    let errorMessage = ref("")

    const getCurrentAuthUserID = new Promise<void>((resolve) => {
        onAuthStateChanged(auth, (authUser) => {
            user.id = authUser?.uid
            resolve()
        })
    })
    
    const isUserLoggedIn = computed(() => user.id !== undefined)

    const registerUser = (email: string, password: string) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                errorMessage.value = ""
                router.push("/")
            }).catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    errorMessage.value = "Zadaný email již existuje"
                } else if (error.code === "auth/weak-password") {
                    errorMessage.value = "Heslo musí mít alespoň 6 znaků"
                } else {
                    // Wild card
                    console.log(error)
                }
            })
    }

    const loginUser = (email: string, password: string) => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                errorMessage.value = ""
                router.push(localStorage.getItem("pagePath") ?? "/kolekce")
            })
            .catch((error) => {
                if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
                    errorMessage.value = "Špatně zadaný email/heslo"
                } else if (error.code === "auth/too-many-requests") {
                    errorMessage.value = "Příliš mnoho pokusů o přihlášení. Zkuste se přihlásit později"
                } else {
                    // Wild card
                    console.log(error)
                }
            })
    }

    const logoutUser = () => {
        signOut(auth)
            .then(() => {
                router.push("/")
                localStorage.removeItem("pagePath")
            })   
    }

    return { 
        getCurrentAuthUserID,
        user,
        isUserLoggedIn, 
        registerUser, 
        loginUser, 
        logoutUser,
        errorMessage 
    }
})