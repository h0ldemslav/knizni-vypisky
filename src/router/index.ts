import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import type {BookTest} from '@/types'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "books",
        component: () => import("@/router/pages/BooksPage.vue")
    },
    {
        path: "/detail-knihy/:id",
        name: "book_detail",
        component: () => import("@/router/pages/BookDetailPage.vue"),
        props: true
    },
    { 
        path: "/:pathMatch(.*)*", 
        name: "page_not_found", 
        component: () => import("@/router/pages/NotFoundPage.vue") 
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
        path: "/kolekce/:id",
        name: "collection_detail",
        component: () => import("@/router/pages/CollectionDetailPage.vue"),
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
    },
    {
        path: "/obnova-hesla",
        name:"password_reset",
        component: () => import("@/router/pages/PasswordResetPage.vue"),
        meta: {
            requiresGuest: true
        }
    },
    {
        path: "/testy/generace",
        name: "test-generation",
        component: () => import("@/router/pages/TestGenerationPage.vue"),
        meta: {
            requiresAuth: true
        }    
    },
    {
        path: "/testy/vytvoreni/:testId",
        name: "test-creation",
        component: () => import("@/router/pages/CreateTestPage.vue"),
        meta: {
            requiresAuth: true
        },
        props: true

    },
    {
        path: "/testy/testy/:bookTestId/:testPreview",
        name: "take-test",
        component: () => import("@/router/pages/TakeTestPage.vue"),
        meta: {
            requiresAuth: true
        },
        props: true
    },
    {
        path: "/testy/:id/:count",
        name: "generated-test",
        component: () => import("@/router/pages/GeneratedTestsPage.vue"),
        meta: {
            requiresAuth: true
        },
        props: true
    },
    {
        path: "/testy/vyber",
        name: "test-selection",
        component: () => import("@/router/pages/TestSelectionPage.vue"),
        meta: {
            requiresAuth: true
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
        next({ name: "books"})
    } else {
        next()
    }
})

export default router
