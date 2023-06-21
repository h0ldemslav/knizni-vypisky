<template>
    <Header>
    </Header>
    <main>
        <div v-for="test in bookTestsStore.tests">
            <p class="test-id">
                <router-link :to="{name: 'take-test', params: {bookTestId: test.id}}">
                    {{ test.name }}
                </router-link>
            </p>
            <router-link :to="{name: 'test-creation', params: {testId: test.id}}">
                <v-btn color="primary" class="ml-4 mr-4">Upravit</v-btn>
            </router-link>
            <v-btn color="primary" @click="deleteTest(test.id)">
                Smazat
            </v-btn>
        </div>
    </main>
</template>

<script lang="ts" setup>
import Header from '@/components/Header.vue'
import { useBookTestsStore } from "@/stores/bookTests";
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const deleteTest = async (testId: string) => {
    await bookTestsStore.getAllQuestionsByTestID(testId)
    await bookTestsStore.getAllAnswers()
    await bookTestsStore.deleteTestCompletely(testId)
    await bookTestsStore.getAllTests(authStore.user.id)
}

const bookTestsStore = useBookTestsStore()
const authStore = useAuthStore()

onMounted(async () => {
    await bookTestsStore.getAllTests(authStore.user.id)
})



</script>

<style scoped>
    p.test-id {
        font-weight: bold;
        font-size: 1.2em;
        display: inline-block;
        margin-left: 1em;
    }
</style>
