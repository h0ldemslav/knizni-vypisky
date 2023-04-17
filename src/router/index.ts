import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router"

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
        component: () => import("@/router/pages/CollectionsPage.vue")
    },
    {
        path: "/testy",
        name: "tests",
        component: () => import("@/router/pages/TestsPage.vue")
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
