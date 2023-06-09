<template>
    <v-card width="350px" class="d-flex flex-column">
        <v-img :src="props.logo" height="150px" class="d-flex justify-center ma-5"></v-img>
        <div class="d-flex flex-column align-center">
            <router-link :to="{name: props.url, params: {testId: props.testId}}">
                <v-btn color="primary">
                    {{ buttonText }}
                </v-btn>
            </router-link>   
            <v-card-text>
                <p>{{ description }}</p>
            </v-card-text>
        </div>    
    </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
    logo: string
    buttonText: string
    description: string
    url: string
    testId?: string
}>()

</script>

<style scoped>

</style>
