<template>
    <Header>
        <v-row>
            <v-col cols="12" md="7">
                <v-row>
                    <v-col cols="12" class="d-flex flex-column align-right mt-8">
                        <h1 class="marginLeft">Test znalostí</h1>
                        <p class="marginLeft pl-3">
                            Chceš si ověřit, jak dobře znáš knížky, které jsi četl? Vyzkoušej si náš test znalostí! Je to úplně jednoduché,
                             stačí si vybrat jakými testy chceš začít a můžeme se do toho pustit.
                        </p>
                        <router-link :to="{name: 'test-selection'}">
                            <v-btn rounded="lg" class="mb-sm-0 mb-8 btn marginLeft" color="primary" small>
                                Začít test
                            </v-btn>
                        </router-link>    
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" sm="5" class="d-flex justift-left my-11 hide-on-phone">
                        <img src="@/assets/bookshelf.png" class="bookshelf">
                    </v-col>
        </v-row>
    </Header>
    <main>
        <v-row class="d-flex justify-center my-10">
            <v-col cols="12" md="3" class="d-flex justify-sm-end justify-center">
                <test-card url="test-generation" :logo=ai buttonText="Generuj otázky" description= "Vygeneruj otázky ke zvolené kolekci"/>
            </v-col>
            <v-col cols="12" md="3" class="d-flex justify-sm-start justify-center">
                <test-card id="new-test" url="test-creation" testId="new"  :logo=page buttonText="Vytvoř test" description= "Vytvoř si test s vlastními otázkami"/>
            </v-col>
            <v-col cols="12" md="3" class="d-flex justify-sm-start justify-center">
                <test-card url="test-selection"  :logo=check buttonText="Vlastní testy" description= "Otestuj svoje znalosti na vlastních otázkách"/>
            </v-col>
        </v-row>
    </main>
</template>

<script lang="ts" setup>

import Header from "@/components/Header.vue";
import TestCard from "@/components/TestCard.vue";
import ai from '@/assets/ai.png'
import page from '@/assets/page.png'
import check from '@/assets/check.png'

</script>

<style scoped>

.bookshelf{
    height: 15em;
    width: auto;
}

/* Changing the CAPITAL text from the button to minuscule */
.btn {
  text-transform: unset !important;
  margin-left: 230px !important;

  @media only screen and (max-width: 648px){
        margin-left: 38px !important;
    }
}

.marginLeft{
    margin-left: 220px;
    margin-right: 210px;
    margin-top: 17px;

    @media only screen and (max-width: 648px){
        margin: 20px 70px 0 28px;
    }
}

.hide-on-phone {
    @media only screen and (max-width: 648px){
        display: none !important;
    }
}

</style>