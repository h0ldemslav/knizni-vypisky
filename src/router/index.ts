import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "home",
        component: () => import("@/router/pages/HomePage.vue")
    },
    {
        path: "/knihy",
        name: "books",
        component: () => import("@/router/pages/BooksPage.vue")
    },
    {
        path: "/kolekce",
        name: "collections",
        component: () => import("@/router/pages/CollectionsPage.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/testy",
        name: "tests",
        component: () => import("@/router/pages/TestsPage.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/login",
        name: "auth",
        component: () => import("@/router/pages/AuthPage.vue"),
        meta: {
            requiresGuest: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const isAuthRequired = to.matched.some((record) => record.meta.requiresAuth)
    const isGuestRequired = to.matched.some((record) => record.meta.requiresGuest)
    const authStore = useAuthStore()

    if (isAuthRequired && !authStore.isUserLoggedIn) {
        next({ name: "auth" })
        localStorage.setItem("pagePath", to.fullPath)
    } else if (isGuestRequired && authStore.isUserLoggedIn) {
        next({ name: "home"})
    } else {
        next()
    }
})

export default router
