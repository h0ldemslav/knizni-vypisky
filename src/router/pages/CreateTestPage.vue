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
        <v-row>
        <v-col cols="12" sm="7" class="mt-7">
        <h1 class="testoveOtazkyHeaderMargin">Vlatní testové otázky</h1>
        <div v-for="(question, index) in bookTestsStore.testQuestions" :key="question.id" class="mt-4 ml-16">
            <div :id="question.id">
            <v-row>
                <v-col cols="10">
                    <h3>{{index + 1}}. {{ question.text }}</h3>
                </v-col>
                <v-col cols="2">
                    <v-btn color="primary" @click="deleteQuestion(question.id)">Smazat</v-btn>
                </v-col>
            </v-row>
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
        </div>

        <v-btn v-if="!showQuestionInput" @click="showQuestionInput=true">
            <v-icon icon="mdi-plus" />
        </v-btn>
        <div id="newQuestion">
            <v-text-field label="Nová otázka" v-model="newQuestion.text" variant="underlined"></v-text-field>
            <v-radio-group >
                <v-radio v-for="answer in newAnswers"
                :value="answer.text + ': ' + answer.is_correct"
                :label = answer.text
                color="primary">
                </v-radio>
                <v-radio  v-if="showQuestionInput"  
                color="primary"
                :value="newAnswer.is_correct">
                    <template v-slot:label>
                        <v-text-field label="Nová odpověď" v-model="newAnswer.text" variant="underlined"></v-text-field>
                    </template>
                    
                </v-radio>
                <v-btn v-if="showQuestionInput" @click="udelejneco">Přidat odpověď</v-btn>

            </v-radio-group>
        </div>

        <v-btn color="primary" class="ml-16 mt-3" @click="getSelectedValues">Uložit test
            
        </v-btn>
        </v-col>
        <v-divider vertical class="mt-7 mr-5"></v-divider>
        <v-col cols="12" sm="3">
            <div id="testStatistics" class="fixedPosition mt-10">
                <v-row>
                     <h2>Vlastní otázky</h2>
                </v-row>
                <v-row>
                    <v-col cols="7" class="ml-2">
                        <h3>Otázek ke kolekci</h3>
                    </v-col>
                    <v-col cols="2">
                        <p class="mt-0">{{ questionsTotal }}</p>
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
import { createVuetify } from 'vuetify'
import { aliases,mdi } from 'vuetify/iconsets/mdi'
import router from '@/router/index'

const props = defineProps<{testId: string}>()

const newQuestion = reactive({
    text: "",
    test_id: props.testId,
    book_id: "",
    selected_answer_id: "",
})

const showQuestionInput = ref(false)

interface newAnswerInterface {
    text: string,
    is_correct: boolean,
    question_id: string,
}

const createVuetify = ({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

const udelejneco = () => {
    const newA: newAnswerInterface = {
        text: newAnswer.text,
        is_correct: newAnswer.is_correct,
        question_id: "test"
    }
    newAnswer.text = ""
    newAnswer.is_correct = false
    showQuestionInput.value = false
    newAnswers.push(newA)
}

const newAnswers = reactive<newAnswerInterface[]>([
 
])

const newAnswer = reactive({
    text: "",
    is_correct: false,
    question_id: "",
})


const dialog = reactive({
    value: false
})

const state = reactive({
    answersSend: false
})

let questionsCorrect = -1

const hoveredBook = ref<BookInterface | null>(null)

const selectedAnswers = ref<Record<string, string>>({});


const questionsAnswered = computed(() => Object.keys(selectedAnswers.value).length)
//questionstotal nepujde i samo o sobe?
const percentageOfQuestionsAnswered = computed(() => Math.round(Object.keys (selectedAnswers.value).length /
bookTestsStore.testQuestions.length * 100))

const getSelectedValues = () => {
    console.log(Object.keys(selectedAnswers.value).length)
    console.log(selectedAnswers.value)
    questionsCorrect = Object.values(selectedAnswers.value).filter(answer => answer.includes('true')).length
}

const deleteQuestion = async (bookId: string ) => {
    await bookTestsStore.deleteQuestion(bookId)
    await bookTestsStore.getAllQuestionsByTestID(props.testId)
    // const q = document.getElementById(bookId)
    // console.log(q)
    // if(q) {
    //     q.remove()}
    // const index = bookTestsStore.testQuestions.findIndex(question => question.book_id === bookId)
    // if(index !== -1){
    //     bookTestsStore.testQuestions.splice(index, 1)
    // }
}


const bookTestsStore = useBookTestsStore()
const authStore = useAuthStore()
const booksStore = useBooksStore()

const questionsTotal = computed(() => bookTestsStore.testQuestions.length)
console.log('questionsTotal', questionsTotal)


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
    if(props.testId !== 'new'){
        await bookTestsStore.getAllTests(authStore.user.id)
        await bookTestsStore.getAllQuestionsByTestID(props.testId)
        await bookTestsStore.getAllAnswers()

        bookTestsStore.testQuestions.sort((a, b) => {
            if (a.book_id < b.book_id) return -1;
            if (a.book_id > b.book_id) return 1;
            return 0;
        });
    }
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