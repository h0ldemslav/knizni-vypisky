<template>
  <nav class="bg-secondary">
    <div class="logo">
      <v-icon>mdi-book-open-page-variant</v-icon>
      <router-link :to="{name: 'books'}">
        KnížníVýpisky<span class="text-primary font-weight-bold">.cz</span>
      </router-link>
    </div>

    <section class="links" :class="state.mobileLinksVisible ? 'links__visible' : ''">
      <router-link v-for="link in links" :key=link.title :to="{name: link.linkName}"
                   :class="isCurrentLink(link) ? 'current-link' : ''">
        <v-btn :prepend-icon="link.symbol" variant="plain">
          {{ link.title }}
        </v-btn>
      </router-link>

      <router-link :to="{ name: 'auth' }">
        <v-btn @click="logoutIfAuthenticated" prepend-icon="mdi-account-circle" variant="plain">
          {{ authStore.isUserLoggedIn ? "Odhlásit se" : "Přihlásit se" }}
        </v-btn>
      </router-link>
    </section>

    <Burger
        :burger-active="state.mobileLinksVisible"
        @update:burger-active="onBurgerClick"/>

  </nav>
</template>

<script lang="ts" setup>
import {useRouter, useRoute} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import {reactive, watch} from "vue";
import {Link} from "@/types/ui/navigation";
import Burger from "@/components/Burger.vue";

const route = useRoute()

// stores
const router = useRouter()
const authStore = useAuthStore()

// states
const state = reactive({
  mobileLinksVisible: false
})

watch(
    () => route.path,
    () => {
      state.mobileLinksVisible = false
    }
)

// data
const links: Array<Link> = [
  {title: "Knihy", linkName: "books", symbol: "mdi-book-open-page-variant", path: "/"},
  {title: "Kolekce", linkName: "collections", symbol: "mdi-layers-triple", path: "/kolekce"},
  {title: "Testy", linkName: "tests", symbol: "mdi-school", path: "/testy"}
]

// methods
const isCurrentLink = (link: Link) => {
  if (link.path === "/") {
    return router.currentRoute.value.path === "/" || router.currentRoute.value.path.startsWith("/detail-knihy")
  } else {
    return router.currentRoute.value.path.startsWith(link.path)
  }
}

const onBurgerClick = (isActive: boolean) => {
  state.mobileLinksVisible = isActive
}

function logoutIfAuthenticated() {
  if (authStore.isUserLoggedIn) authStore.logoutUser()
}
</script>

<style>
nav {
  max-width: 1440px;
  left: auto;
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 4.5rem;
}

.logo {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.current-link {
  color: #E4573D !important;
}

@media only screen and (max-width: 992px) {
  nav {
    padding: 0.8rem 2.5rem;
  }
}

@media only screen and (max-width: 768px) {
  .links {
    display: none;
    width: 100vw;
    flex-direction: column;
    position: absolute;
    left: 0;
    top: 4rem;
    align-items: center;
    justify-content: flex-start;
    z-index: 5000;
    overflow: hidden;
    gap: 0.5rem;
    background-color: #F2F5F7;
    border: 1px solid #E4573D;
  }

  .links > * {
    padding: 1.5rem;
  }

  .links__visible {
    display: flex;
  }
}

@media only screen and (min-width: 769px) {
  .links {
    display: block;
  }
}
</style>