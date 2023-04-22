<template>
    <v-app-bar app color="secondary">
        <v-spacer/>

        <v-toolbar-title>
            <div class="d-flex align-center">
                <v-icon>mdi-book-open-page-variant</v-icon>
                <div class="ml-2">
                    <router-link :to="{name: 'home'}">
                        KnížníVýpisky<span class="text-primary font-weight-bold">.cz</span>
                    </router-link>
                </div>
            </div>
        </v-toolbar-title>

        <v-spacer/>
        <v-spacer/>

        <router-link v-for="link in links" :to="{name: link.linkName}"
                     :class="isCurrentLink(link) ? 'current-link' : ''">
            <v-btn :prepend-icon="link.symbol" variant="plain">
                {{ link.title }}
            </v-btn>
        </router-link>

        <router-link :to="{ name: 'auth' }">
            <v-btn @click="logoutIfAuthenticated" prepend-icon="mdi-account-circle" variant="plain">
                {{ auth.isUserLoggedIn() ? "Odhlásit se" : "Přihlásit se" }}
            </v-btn>
        </router-link>

        <v-spacer/>
    </v-app-bar>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { authStore } from '../stores/auth'

interface Link {
    title: string,
    linkName: string,
    symbol: string
}

const router = useRouter()
const auth = authStore()

const links: Array<Link> = [
    {title: "Knihy", linkName: "books", symbol: "mdi-book-open-page-variant"},
    {title: "Kolekce", linkName: "collections", symbol: "mdi-layers-triple"},
    {title: "Testy", linkName: "tests", symbol: "mdi-school"}
]

const isCurrentLink = (link: Link) => {
    return router.currentRoute.value.name === link.linkName
}

function logoutIfAuthenticated() { if (auth.isUserLoggedIn()) auth.logoutUser() }
</script>

<style>
/*TODO responsivity*/

.current-link {
    color: #E4573D !important;
}
</style>