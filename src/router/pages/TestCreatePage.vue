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
                :label="answer.text"
                :value="answer.id + ': ' + answer.is_correct"
                color="primary"
                ></v-radio>
            </v-radio-group>
        </div>

        <p> {{ percentageOfQuestionsAnswered }}</p>

        <v-progress-linear color="primary" :model-value=percentageOfQuestionsAnswered :height="20"></v-progress-linear>

        <v-btn color="primary" @click="getSelectedValues">Odeslat test
            <v-dialog
                v-model="dialog.value"
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
                        <v-btn color="primary" block @click="dialog.value = false">Close Dialog</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-btn>
    </main>
</template>

<script lang="ts" setup>
import Header from "@/components/Header.vue";
import { useBookTestsStore } from "@/stores/bookTests";
import { useAuthStore } from '@/stores/auth'
import { onMounted, computed, reactive, ref} from 'vue'

const dialog = reactive({
    value: false
})

const percentageOfQuestionsAnswered = computed(() => Object.keys (selectedAnswers.value).length /
 bookTestsStore.testQuestions.length * 100)

const selectedAnswers = ref<Record<string, string>>({});
let questionsCorrect = computed(() => -1)

const state = reactive({
    answersSend: false
})


const getSelectedValues = () => {
    console.log(Object.keys(selectedAnswers.value).length)
    console.log(selectedAnswers.value)
    state.answersSend = true
    questionsCorrect = computed(() => Object.values(selectedAnswers.value).filter(answer => answer.includes('true')).length)
}

const getLabelColor = computed((isCorrect: Boolean): string =>{
    if(isCorrect && state.answersSend){
        return 'green'
    } else if(!isCorrect && state.answersSend){
        return 'red'
    } else{
        return 'black'
    }
})


const bookTestsStore = useBookTestsStore()
const authStore = useAuthStore()

console.log(bookTestsStore.tests)
console.log(bookTestsStore.testQuestions)
console.log(bookTestsStore.testAnswers)

onMounted(async () => {
    //sort testy podle knih, at jsou testy na jednu knihu u sebe
    await bookTestsStore.getAllTests(authStore.user.id)
    await bookTestsStore.getAllQuestionsByTestID(bookTestsStore.tests[0])
    //Lucka mi na stranku posle id bookTestu a ja si podle nej pak najdu questions
    //await bookTestsStore.getAllQuestionsByTestID(bookTestsStore.tests.filter(test =>test.id === props.testId))
    await bookTestsStore.getAllAnswers()
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
