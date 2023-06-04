<template>
    <Header>
        <v-row>
            <v-col cols="12" md="8">
                <v-row>
                    <v-col cols="12" sm="10" class="d-flex flex-column justify-left align-center pt-8 pl-sm-16">
                        <h1 class="ml-sm-16">Test znalostí</h1>
                        <v-container class="d-flex justify-center">
                            <p class="textDescription">
                                Chceš si ověřit, jak dobře znáš knížky, které jsi četl? Vyzkoušej si náš test znalostí! Je to úplně jednoduché,
                                 stačí si vybrat jakými testy chceš začít a můžeme se do toho pustit.
                            </p>
                        </v-container>
                        <v-btn rounded="lg" class="ml-sm-16 mb-sm-0 mt-2 mb-8 btn" color="primary" small>
                            Začít test
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="2" class="d-flex justift-left my-11 hide-on-phone">
                        <img src="@/assets/bookshelf.png" class="bookshelf">
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </Header>
    <main>
        <v-row class="my-10">
            <v-col cols="12" md="6" class="d-flex justify-sm-end justify-center pr-sm-10">
                <test-card :logo=ai buttonText="Generuj otázky" description= "Vygeneruj otázky ke zvolené kolekci"/>
            </v-col>
            <v-col cols="12" md="5" class="d-flex justify-sm-start justify-center pl-sm-10">
                <test-card :logo=page buttonText="Vytvoř otázky" description= "Vytvoř si vlastní otázky"/>
            </v-col>
        </v-row>
    </main>
</template>

<script lang="ts" setup>

import Header from "@/components/Header.vue";
import TestCard from "@/components/TestCard.vue";
import ai from '@/assets/ai.png'
import page from '@/assets/page.png'

</script>

<style scoped>

.bookshelf{
    height: 15em;
    width: auto;
}

.textDescription{
    margin: 0 10.5vw 0 15.5vw;

    @media only screen and (max-width: 648px){
        margin: 0 12px 0 28px;
    }
}

/* Changing the CAPITAL text from the button to minuscule */
.btn {
  text-transform: unset !important;
}

.hide-on-phone {
    @media only screen and (max-width: 648px){
        display: none !important;
    }
}

</style>