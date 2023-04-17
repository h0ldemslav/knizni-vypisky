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

        <!-- TODO handle logged-in vs logged-out user -->
        <v-btn prepend-icon="mdi-account-circle" variant="plain">
            Přihlásit se
        </v-btn>

        <v-spacer/>
    </v-app-bar>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router';

interface Link {
    title: string,
    linkName: string,
    symbol: string
}

const router = useRouter()

const links: Array<Link> = [
    {title: "Knihy", linkName: "books", symbol: "mdi-book-open-page-variant"},
    {title: "Kolekce", linkName: "collections", symbol: "mdi-layers-triple"},
    {title: "Testy", linkName: "tests", symbol: "mdi-school"}
]

const isCurrentLink = (link: Link) => {
    return router.currentRoute.value.name === link.linkName
}
</script>

<style>
/*TODO responsivity*/

.current-link {
    color: #E4573D !important;
}
</style>