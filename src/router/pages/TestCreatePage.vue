<template>
    <Header>
        <v-row>
            <v-col cols="12" sm="6">
                <div>
                    <h1>Vlastní testové otázky</h1>
                    <p>Zde si můžeš vytvořit vlastní otázky k jednotlivým <br>knihám kolekcí!</p>
                    <p class="font-weight-bold primary-color" >Neváhej a pusť se do toho!</p>

                </div>    
            </v-col>
            <v-col cols="12" sm="5">
                    x
            </v-col>
        </v-row>
    </Header>
    <main>
        
    </main>
</template>

<script lang="ts" setup>
import Header from "@/components/Header.vue";
import { useBookTestsStore } from "@/stores/bookTests";
import { useAuthStore } from '@/stores/auth'
import { onMounted, computed, reactive, ref} from 'vue'

const bookTestsStore = useBookTestsStore()
const authStore = useAuthStore()

console.log("tests", bookTestsStore.bookTestQuestions)
console.log("test sets", bookTestsStore.bookTests)

onMounted(() => {
    bookTestsStore.getAllBookTests(authStore.user.id)
    bookTestsStore.getAllBookTestQuestions(bookTestsStore.bookTests[0])
})

</script>

<style scoped>

div {
    margin-top: 20px;
    margin-left: 25px;
}

div > p {
    margin-top: 15px;
}

.primary-color {
  color: #E4573D
}

</style>
