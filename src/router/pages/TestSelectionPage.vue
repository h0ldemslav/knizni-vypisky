<template>
    <Header>
    </Header>

    <main>
        <router-link :to="{name: 'take-test', params: {bookTestId: test.id}}" v-for="test in bookTestsStore.tests">
            {{ test.id }}
            {{ test.name }}
        </router-link>
    </main>
</template>

<script lang="ts" setup>
import Header from '@/components/Header.vue'
import { useBookTestsStore } from "@/stores/bookTests";
import { useAuthStore } from '@/stores/auth'
import { onMounted, computed, reactive, ref} from 'vue'

const bookTestsStore = useBookTestsStore()
const authStore = useAuthStore()

bookTestsStore.tests.forEach(async test => {
    await bookTestsStore.getAllQuestionsByTestID(test.id)
})

console.log('tests', bookTestsStore.tests)
console.log('questions', bookTestsStore.testQuestions)
console.log('answers', bookTestsStore.testAnswers)

onMounted(async () => {
    await bookTestsStore.getAllTests(authStore.user.id)
    bookTestsStore.tests.forEach(async test => {
        await bookTestsStore.getAllQuestionsByTestID(test.id)})
        await bookTestsStore.getAllAnswers()
})



</script>

<style scoped>

</style>
