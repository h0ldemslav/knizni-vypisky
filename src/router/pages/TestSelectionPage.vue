<template>
    <Header>
    </Header>
    <main>
        <div  v-for="test in bookTestsStore.tests">
            <router-link :to="{name: 'take-test', params: {bookTestId: test.id, testPreview: false}}">
<!--              // todo add , testPreview: false-->
                {{ test.id }}
                {{ test.name }}
            </router-link>
            <router-link :to="{name: 'test-creation', params: {testId: test.id}}">
                <v-btn color="primary">Upravit</v-btn>
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
import { onMounted, computed, reactive, ref} from 'vue'

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

</style>
