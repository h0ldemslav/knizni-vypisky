import { defineStore } from 'pinia'
import { reactive } from 'vue'
// import router from '../router/'
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth'

interface User {
    id: string | undefined
}

const auth = getAuth()

export const authStore = defineStore("auth", () => {
    let user: User = reactive({
        id: undefined
    })

    const isUserLoggedIn = (() => user.id !== undefined ? true : false)

    const registerUser = (email: string, password: string) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                console.log("Successfully registered!")
            })
            .catch((error) => {
                console.error(error.code)
            })
    }

    const loginUser = (email: string, password: string) => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                // router.push("/book-collections")
                console.log("Successfully logged in!")
            })
            .catch((error) => {
                console.error(error.code)
            })
    }

    const logoutUser = () => {
        signOut(auth)
            .then(() => {
                // router.push("/")
                console.log("Successfully logged out!")
            })   
    }
    
    onAuthStateChanged(auth, (authUser) => {
        user.id = authUser?.uid
        // console.log(user.id)
    })

    return { user, registerUser, loginUser, logoutUser, isUserLoggedIn }
})