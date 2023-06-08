<template>
    <Header>
        <v-row>
            <v-col cols="12" sm="6">
                <div class="leftTopMargin">
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
        <div v-for="question in bookTestsStore.testQuestions" :key="question.id">
            <h3>{{ question.text }}</h3>
            <v-radio-group v-model="selectedAnswers[question.id]">
                <v-radio
                v-for="answer in bookTestsStore.testAnswers.filter(answer => answer.question_id === question.id)"
                :key="answer.id"
                :value="answer.id + ': ' + answer.is_correct"
                color="primary"
                >
                <template v-slot:label>
                    <div v-if="state.answersSend" strong :class="answer.is_correct ? 'text-success' : 'text-error'"> {{ answer.text }}</div>
                    <div v-else>{{ answer.text }}</div>
                </template> 
            </v-radio>
            </v-radio-group>
        </div>

        <p> {{ percentageOfQuestionsAnswered }}</p>

        <v-progress-linear color="primary" :model-value=percentageOfQuestionsAnswered :height="20"></v-progress-linear>

        <v-btn v-if="!state.answersSend" color="primary" @click="getSelectedValues">Odeslat test
            <!-- proc @close nefunguje??!? -->
            <v-dialog
                v-model="dialog.value"
                @close="state.answersSend = true"
                persistent
                activator="parent"
                transition="dialog-bottom-transition"
                width="auto">
                <!-- <v-toolbar
                color="primary"
                title=""
                ><h2 class="ml-14">Výsledek testu</h2></v-toolbar> -->
                <v-card>
                    <v-card-text class="d-flex flex-column align-center">
                        <h2>Výsledek testu</h2>
                        <p>Počet správných odpovědí: {{ questionsCorrect }} / {{ bookTestsStore.testQuestions.length }}</p>
                        <p>Procentuální úspěšnost: {{ questionsCorrect/bookTestsStore.testQuestions.length*100 }} %</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" block @click=" closeDialog">Zpět k testu</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-btn>
        <v-btn v-else color="primary" @click="router.push('/testy')">
            Zpět na výběr testů
        </v-btn>
    </main>
</template>

<script lang="ts" setup>
import Header from "@/components/Header.vue";
import { useBookTestsStore } from "@/stores/bookTests";
import { useAuthStore } from '@/stores/auth'
import { onMounted, computed, reactive, ref, defineProps} from 'vue'
import { BookTest } from '@/types/'
import router from '@/router/index'

const props = defineProps<{bookTestId: string}>()

const dialog = reactive({
    value: false
})

const state = reactive({
    answersSend: false
})

const percentageOfQuestionsAnswered = computed(() => Object.keys (selectedAnswers.value).length /
 bookTestsStore.testQuestions.length * 100)

const selectedAnswers = ref<Record<string, string>>({});
let questionsCorrect = computed(() => -1)

const closeDialog = () => {
    dialog.value = false
    state.answersSend = true
}

const getSelectedValues = () => {
    console.log(Object.keys(selectedAnswers.value).length)
    console.log(selectedAnswers.value)
    // state.answersSend = true
    questionsCorrect = computed(() => Object.values(selectedAnswers.value).filter(answer => answer.includes('true')).length)
}


const bookTestsStore = useBookTestsStore()
const authStore = useAuthStore()

console.log('tests', bookTestsStore.tests)
console.log('testQuestions', bookTestsStore.testQuestions)
console.log('testAnswers', bookTestsStore.testAnswers)

onMounted(async () => {
    //sort testy podle knih, at jsou testy na jednu knihu u sebe
    await bookTestsStore.getAllTests(authStore.user.id)
    console.log(props.bookTestId)
    // await bookTestsStore.getAllQuestionsByTestID(bookTestsStore.tests[0])
    //Lucka mi na stranku posle id bookTestu a ja si podle nej pak najdu questions
    await bookTestsStore.getAllQuestionsByTestID(props.bookTestId)
    await bookTestsStore.getAllAnswers()

    console.log(props.bookTestId)
})

</script>

<style scoped>

.leftTopMargin {
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
