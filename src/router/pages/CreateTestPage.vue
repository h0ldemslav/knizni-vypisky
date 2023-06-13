<!-- reseni - answers aby se ukladaly, ID ke questions a answers a vybirani book_id, pri upravit test ulozeni nakonci oddelat pojmenovani testu, nakonec uprava -->
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

        <div v-for="question in newQuestions">
            <h3>{{ question.text }} {{ question.id }}</h3>
            <ul>
                <li v-for="answer in templateNewAnswers.filter(a => a.question_id === question.id)" :color="answer.is_correct === true ? 'green' : 'red'">
                    {{ answer.text }}
                    {{  answer.question_id }}
                </li>
            </ul>
        </div>

        <v-btn v-if="!showQuestionInput" @click="showQuestionInput=true">
            <v-icon icon="mdi-plus" />
        </v-btn>
        <div id="newQuestion">
            <v-text-field label="Nová otázka" v-model="newQuestion.text" variant="underlined"></v-text-field>
            <v-radio-group >
                <v-radio v-for="answer in newAnswers"
                :value="answer.id + ': ' + answer.is_correct"
                :label = answer.text
                color="primary">
                </v-radio>
                <v-radio  v-if="showQuestionInput"  
                color="primary"
                :value="newAnswer.is_correct">
                    <template v-slot:label>
                        <v-text-field  label="Nová odpověď" v-model="newAnswer.text" variant="underlined"></v-text-field>
                    </template>
                    
                </v-radio>
                <v-btn v-if="showQuestionInput" @click="saveAnswer">Uložit odpověď</v-btn>
            </v-radio-group>
            <v-btn color="primary" @click="saveQuestion">Uložit otázku</v-btn>
        </div>

        <v-btn color="primary" class="ml-16 mt-3" @click="openDialog">Uložit test
            <v-dialog v-if="props.testId === 'new'"
                v-model="dialog.saveDialog"
                @close="state.answersSend = true"
                activator="parent"
                transition="dialog-bottom-transition"
                width="300px">
                <!-- <v-toolbar
                color="primary"
                title=""
                ><h2 class="ml-14">Výsledek testu</h2></v-toolbar> -->
                <v-card>
                    <v-card-text>
                        <h2 class="ml-11">Pojmenuj test</h2>
                        <v-text-field label="Název testu" v-model="testName" variant="underlined"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" class="pt-0" block @click="saveTest">Uložit test</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-btn>
        <v-btn color="primary" class="ml-16 mt-3">Smazat test
            <v-dialog
                v-model="dialog.deleteDialog"
                @close="state.answersSend = true"
                activator="parent"
                transition="dialog-bottom-transition"
                width="auto">
                <v-card>
                    <v-card-text class="d-flex flex-column align-center">
                        <h2>Opravdu chceš test smazat?</h2>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" block @click="deleteTest">Smazat test</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
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
import { onMounted, computed, onBeforeUnmount, reactive, ref, defineProps} from 'vue'
import { Book as BookInterface } from "@/model/Book";
import { BookTestAnswer}  from "@/types/index";
import { BookTestQuestion } from "@/types/index";
import { BookTest } from "@/types/index";
import { db } from "@/main"
import {
    getDocs,
    query,
    where,
    collection,
    doc,
    addDoc,
    writeBatch,
    deleteDoc,
    updateDoc,
} from '@firebase/firestore'
import router from '@/router/index'

const newTestRef = doc(collection(db, "book_tests"))
const newQuestionRef = doc(collection(db, "test_questions"))

const props = defineProps<{testId: string}>()

const showQuestionInput = ref(false)

const testName = ref<string | undefined>(undefined)

const newAnswers = reactive<BookTestAnswer[]>([])
let templateNewAnswers = reactive<BookTestAnswer[]>([])

const arrayOfNewAnswers:Array<Array<BookTestAnswer>> = []

const newQuestion = reactive({
    id: newQuestionRef.id,
    text: '',
    // test_id: props.testId === 'new' ? newQuestionRef.id : props.testId,
    book_id: '',
    selected_answer_id: "",
})

const newAnswer = reactive({
    id: 0,
    text: "",
    is_correct: false,
    question_id: -1,
})

const newQuestions = Array<BookTestQuestion>()

const deleteTest = () =>{
    if(props.testId !== 'new') {
    bookTestsStore.deleteTestCompletely(props.testId)
    }
    router.push('/testy/vyber')
}

const saveAnswer = () => {
    const newA: BookTestAnswer = {
        id: newAnswer.id.toString(),
        text: newAnswer.text,
        is_correct: newAnswer.is_correct,
        question_id: '',
    }
    newAnswer.id++
    newAnswer.text = ""
    newAnswer.is_correct = false
    showQuestionInput.value = false
    newAnswers.push(newA)
}

const saveQuestion = async () => {
    const newQ: BookTestQuestion = {
        id: newQuestion.id.toString(),
        text: newQuestion.text,
        test_id: props.testId === 'new' ? '' : props.testId,
        book_id: 'pridat potom',
        selected_answer_id: newQuestion.selected_answer_id
    }
    console.log('id', newQuestion.id)
    console.log('id2', newTestRef.id)
    console.log('id3', newQ.id)
    newQuestions.push(newQ)
    if(props.testId !== 'new') {
        await bookTestsStore.addQuestionsToTest(newQuestions, newQuestionRef)
        newQuestions.splice(0, newQuestions.length)
        await bookTestsStore.getAllQuestionsByTestID(props.testId)
    }
    newAnswers.forEach(a => a.question_id = newQuestion.id.toString())
    // newQuestion.id++
    newQuestion.text = ""
    newQuestion.selected_answer_id = ""
    templateNewAnswers = newAnswers.slice();
    console.log(templateNewAnswers)
    newAnswers.splice(0, newAnswers.length)
}

const saveTest = async () => {
    dialog.saveDialog = false
    let newQ: BookTestQuestion[] = []
    const newBookTest: BookTest = {
        id: '',
        name: testName.value,
        is_generated: false,
        user_id: authStore.user.id,
        book_collection_id: 'collection_id'
    }
    if(props.testId === 'new') {
        await bookTestsStore.createNewTest(newBookTest)
        newQ = newQuestions.map(q => (q.test_id = bookTestsStore.tests[bookTestsStore.tests.length-1].id, q))
        await bookTestsStore.getAllTests(authStore.user.id)
        await bookTestsStore.addQuestionsToTest(newQ, newQuestionRef)
    } else {
        await bookTestsStore.testQuestions.push(...newQuestions)
        // bookTestsStore.testAnswers.push(...newAnswers)
        await bookTestsStore.updateQuestionsAndAnswers()
    }
    router.push('/testy/vyber')
}

const dialog = reactive({
    saveDialog: false,
    deleteDialog: false,
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

const openDialog = () => {
    if(props.testId !== 'new'){
        testName.value = bookTestsStore.tests.find(test => test.id === props.testId)?.name
        saveTest()
    }
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
    }
})

onBeforeUnmount(async() => {
    await bookTestsStore.testQuestions.splice(0, bookTestsStore.testQuestions.length)
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