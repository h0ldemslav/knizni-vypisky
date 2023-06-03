<template>
    <v-app>
        <v-main>
            <AppBar/>
            <router-view/>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">

import AppBar from "@/components/AppBar.vue";
</script>

<style>
    div#app {
        max-width: 1440px;
        margin: 0 auto;
    }
</style>