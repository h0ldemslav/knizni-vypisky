import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { authStore } from '@/stores/auth'

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
            authRequired: true
        }
    },
    {
        path: "/testy",
        name: "tests",
        component: () => import("@/router/pages/TestsPage.vue"),
        meta: {
            authRequired: true
        }
    },
    {
        path: "/login",
        name: "auth",
        component: () => import("@/router/pages/AuthPage.vue")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const isAuthRequired = to.matched.some((record) => record.meta.authRequired)
    const auth = authStore()

    if (isAuthRequired && !auth.isUserLoggedIn()) {
      next({ name: "auth" })
    } else {
        next()
    }
})

export default router
