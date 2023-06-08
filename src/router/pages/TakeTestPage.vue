<template>
    <Header>
        <v-row>
            <v-col cols="12" sm="6">
                <div class="leftTopMargin">
                    <h1>Testové otázky kolekce</h1>
                    <v-col cols="12" sm="8">
                        <p>Zde můžeš vyzkoušet svoje znalosti ke zvolené kolekci na vytvořených otázkách otázkách.</p>
                        <p class="font-weight-bold primary-color mb-4 mb-sm-0" >Neváhej a pusť se do toho!</p>
                    </v-col>
                </div>    
            </v-col>
            <v-col cols="12" sm="5" class="hidden-sm-and-down">
                    x
            </v-col>
        </v-row>
    </Header>
    <main>
        <v-row>
        <v-col cols="12" sm="6" class="mt-7">
        <h1 class="testoveOtazkyHeaderMargin">Testové otázky</h1>
        <div v-for="(question, index) in bookTestsStore.testQuestions" :key="question.id" class="mt-4 ml-16">
            <h3>{{index + 1}}. {{ question.text }}</h3>
            <v-radio-group 
                v-model="selectedAnswers[question.id]" 
                @mouseenter="getBookOnHover(question.book_id)"
                @mouseleave="getBookOnHover('')"
                >
                <v-radio
                v-for="answer in bookTestsStore.testAnswers.filter(answer => answer.question_id === question.id)"
                :key="answer.id"
                :value="answer.id + ': ' + answer.is_correct"
                color="primary"
                class="ml-3"
                :disabled="state.answersSend"
                >
                <template v-slot:label>
                    <div v-if="state.answersSend" strong :class="answer.is_correct ? 'text-success' : 'text-error'"> {{ answer.text }}</div>
                    <div v-else> {{ answer.text }}</div>
                </template> 
            </v-radio>
            </v-radio-group>
        </div>

        <v-btn v-if="!state.answersSend" color="primary" class="ml-16 mt-3" @click="getSelectedValues">Odeslat test
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
                        <p >Počet správných odpovědí: {{ questionsCorrect }} / {{ bookTestsStore.testQuestions.length }}</p>
                        <p>Procentuální úspěšnost: {{ Math.round(questionsCorrect/bookTestsStore.testQuestions.length*100) }} %</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" block @click=" closeDialog">Zpět k testu</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-btn>
        <v-btn v-else color="primary" @click="router.push('/testy/vyber')">
            Zpět na výběr testů
        </v-btn>
        </v-col>
        <v-divider vertical class="mt-7 mr-5"></v-divider>
        <v-col cols="12" sm="3">
            <div id="testStatistics" class="fixedPosition mt-10">
                <v-row>
                    <v-col cols="4">
                        <h2>Postup</h2>
                    </v-col>
                    <v-col cols="8">
                        <v-progress-linear color="primary" :model-value=percentageOfQuestionsAnswered height="20" class="mt-2"></v-progress-linear>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="7" class="ml-2">
                        <h3>Otázek odpovězeno:</h3>
                    </v-col>
                    <v-col cols="2">
                        <p class="mt-0">{{ questionsAnswered }}/{{ questionsTotal }}</p>
                    </v-col>
                    <v-col cols="2">
                        <p class="mt-0">{{ percentageOfQuestionsAnswered }}%</p>
                    </v-col>
                </v-row>
                <v-row v-if="state.answersSend">
                    <v-col cols="7" class="ml-2">
                        <h3>Otázek správně:</h3>
                    </v-col>
                    <v-col cols="2">
                        <p class="mt-0">{{ questionsCorrect }}/{{ questionsTotal }}</p>
                    </v-col>
                    <v-col cols="2">
                        <p class="mt-0">{{ Math.round(questionsCorrect/bookTestsStore.testQuestions.length*100) }} %</p>
                    </v-col>
                </v-row>
                <h2 class="mt-5">Kniha</h2>
                <p class="font-weight-light mb-5 ml-2">Otázka se týká knihy</p>
                <img v-if="hoveredBook !== null" :src="hoveredBook?.image?.smallThumbnail">
                <div v-else></div>
            </div>
        </v-col>
        </v-row>
    </main>
</template>

<script lang="ts" setup>
import Header from "@/components/Header.vue";
import { useBookTestsStore } from "@/stores/bookTests";
import { useAuthStore } from '@/stores/auth'
import { useBooksStore } from '@/stores/books'
import { onMounted, computed, reactive, ref, defineProps} from 'vue'
import { Book as BookInterface } from "@/model/Book";
import router from '@/router/index'

const index=0

const props = defineProps<{bookTestId: string}>()

const dialog = reactive({
    value: false
})

const state = reactive({
    answersSend: false
})

let questionsCorrect = -1

const hoveredBook = ref<BookInterface | null>(null)

const selectedAnswers = ref<Record<string, string>>({});

const closeDialog = () => {
    dialog.value = false
    state.answersSend = true}

const questionsAnswered = computed(() => Object.keys(selectedAnswers.value).length)
const questionsTotal = computed(() => bookTestsStore.testQuestions.length)
const percentageOfQuestionsAnswered = computed(() => Math.round(Object.keys (selectedAnswers.value).length /
bookTestsStore.testQuestions.length * 100))

const getSelectedValues = () => {
    console.log(Object.keys(selectedAnswers.value).length)
    console.log(selectedAnswers.value)
    questionsCorrect = Object.values(selectedAnswers.value).filter(answer => answer.includes('true')).length
}


const bookTestsStore = useBookTestsStore()
const authStore = useAuthStore()
const booksStore = useBooksStore()


const getBookOnHover = async (bookId: string) => {
    if(bookId !== ''){
        const book =  await booksStore.getBookById(bookId)
        if(book){
            hoveredBook.value = book
        }
        console.log('book', hoveredBook)
    } else{
        hoveredBook.value = null
    }
}

onMounted(async () => {
    await bookTestsStore.getAllTests(authStore.user.id)
    console.log(props.bookTestId)
    // await bookTestsStore.getAllQuestionsByTestID(bookTestsStore.tests[0])
    //Lucka mi na stranku posle id bookTestu a ja si podle nej pak najdu questions
    await bookTestsStore.getAllQuestionsByTestID(props.bookTestId)
    await bookTestsStore.getAllAnswers()

    bookTestsStore.testQuestions.sort((a, b) => {
        if (a.book_id < b.book_id) return -1;
        if (a.book_id > b.book_id) return 1;
        return 0;
    });
})

</script>

<style scoped>

.leftTopMargin {
    margin: 55px 0 0 110px;

    @media screen and (max-width: 648px){
        margin: 30px 30px 0 20px;
        text-align: left;
    }
}

div > p {
    margin-top: 15px;
}

.primary-color {
  color: #E4573D
}

.fixedPosition {
    position: -webkit-sticky;
    position: sticky;
    top: 10%
}

.testoveOtazkyHeaderMargin {
    margin-left: 82px;
}

</style>