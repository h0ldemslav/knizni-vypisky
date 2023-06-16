<!-- reseni -  vybirani book_id, nakonec uprava -->
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
        <h1 class="testoveOtazkyHeaderMargin"> {{ testName === undefined ? 'Vlastní testové otázky' : testName }}</h1>
        <div v-for="(question, index) in bookTestsStore.testQuestions" :key="question.id" class="mt-4 ml-16">
            <div :id="question.id">
            <v-row>
                <v-col cols="8">
                    <h3 v-if="!editQuestionState[question.id]">{{index + 1}}. {{ question.text }}</h3>
                    <h3 v-else><v-text-field v-model="question.text" variant="underlined"></v-text-field></h3>
                </v-col>
                <v-col cols="4">
                    <v-btn v-if="!editQuestionState[question.id]" color="primary" @click="editQuestion(question.id)" class="mr-1">Upravit</v-btn>
                    <v-btn v-else color="primary" @click="saveEditedQuestion(question.id)" class="mr-1">Uložit</v-btn>
                    <v-btn color="primary" @click="deleteQuestion(question.id)">Smazat</v-btn>
                </v-col>
            </v-row>
            <!-- :v-model="bookTestsStore.testAnswers.filter(answer => answer.is_correct && answer.question_id === question.id)"  -->
            <v-radio-group 
                v-model="selectedAnswers[question.id]" 
                @mouseenter="getBookOnHover(question.book_id)"
                @mouseleave="getBookOnHover('')"
                >
                <v-radio
                v-for="answer in bookTestsStore.testAnswers.filter(answer => answer.question_id === question.id)"
                :key="answer.id"
                :value="answer.id"
                
                color="primary">
                    <template v-if="!editQuestionState[question.id]" v-slot:label >
                        <div class="ml-3" >{{ answer.text }} </div>
                    </template>
                    <template v-else v-slot:label >
                        <v-text-field class="textIn ml-3 mr-16" v-model="answer.text" variant="underlined"></v-text-field>
                    </template>
                    <v-icon icon="mdi-close" color="#002166" @click="deleteAnswer(answer.id)"></v-icon>
            </v-radio>
            </v-radio-group>
            </div>
        </div>


        <div id="newQuestion" class="ml-14 mt-4">
            <v-text-field class="mr-10" label="Nová otázka" 
            v-model="newQuestion.text" 
            variant="underlined"
            >
            </v-text-field>
            <v-radio-group 
                v-model="correctAnswer">
                <v-radio v-for="answer in newAnswers"
                :value="answer.id.toString()"
                :label = answer.text
                color="primary"
                class="pr-3">
                    <template v-slot:label >
                        <div class="ml-3" >{{ answer.text }}</div>
                    </template>
                    <v-icon icon="mdi-close" color="#002166" 
                    @click="newAnswers.splice(newAnswers.findIndex(a => a.id === answer.id), 1)"></v-icon>
                </v-radio>
                <v-row>
                <v-col cols="9">
                    <v-radio  v-if="showQuestionInput"  
                    color="primary"
                    :value="newAnswer.is_correct"
                    class="ml-3">
                        <template v-slot:label >
                            <v-text-field  label="Nová odpověď" v-model="newAnswer.text" variant="underlined"></v-text-field>
                        </template>
                        
                    </v-radio>
                    <v-icon icon="mdi-plus" class="clickabeIcon mt-3" v-if="!showQuestionInput" @click="showQuestionInput=true"/>
                </v-col>
                <v-col cols="2">
                    <v-btn v-if="showQuestionInput" 
                        style=" color: #E4573D;" :disabled="newAnswer.text.length ===0" @click="saveAnswer">Uložit</v-btn>
                </v-col>
                </v-row>
            </v-radio-group>
            <v-btn color="primary" class="mt-5 mb-10" :disabled="newQuestion.text.length ===0" @click="saveQuestion">Uložit otázku</v-btn>
        </div>

        <v-btn color="primary" class="ml-16 mt-3" @click="openDialog">Uložit test
            <v-dialog
                v-model="dialog.saveDialog"
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
import { collection,doc } from '@firebase/firestore'
import router from '@/router/index'

const bookTestsStore = useBookTestsStore()
const authStore = useAuthStore()
const booksStore = useBooksStore()

const newTestRef = doc(collection(db, "book_tests"))
let newQuestionRef = doc(collection(db, "test_questions"))

const questionToRef: Array<any> = []

const props = defineProps<{
    testId: string
}>()

const showQuestionInput = ref(false)
const editQuestionState = ref<Record<string, boolean>>({})

const testName = ref<string | undefined>(bookTestsStore.tests.find(test => test.id === props.testId)?.name)

const newAnswers = reactive<BookTestAnswer[]>([])
const selectedAnswers = ref<Record<string, string>>({});
const correctAnswer = ref<string>('')
const newQuestions = Array<BookTestQuestion>()

const hoveredBook = ref<BookInterface | null>(null)

const newQuestion = reactive({
    id: newQuestionRef.id,
    text: '',
    book_id: '',
    selected_answer_id: "",
})

const newAnswer = reactive({
    id: 0,
    text: "",
    is_correct: false,
    question_id: newQuestionRef.id,
})

const dialog = reactive({
    saveDialog: false,
    deleteDialog: false,
})


const deleteTest = () =>{
    if(props.testId !== 'new') {
    bookTestsStore.deleteTestCompletely(props.testId)
    }
    router.push('/testy/vyber')
}

const deleteQuestion = async (questionId: string ) => {
    await bookTestsStore.deleteQuestion(questionId)
    const indexOfNewQuestion = newQuestions.findIndex(question => question.id === questionId)
    if(indexOfNewQuestion !== -1){
        newQuestions.splice(newQuestions.findIndex(question => question.id === questionId), 1)
    }
}

const editQuestion = (questionId: string) => {
    editQuestionState.value[questionId] = true
}

const saveEditedQuestion = (questionId: string) => {
    editQuestionState.value[questionId] = false
}

const deleteAnswer = async (answerId: string) => {
     await bookTestsStore.deleteAnswer(answerId)
     await bookTestsStore.getAllAnswers()
}


const getSelectedAnswers = (questionId: string) => {
    const rightAnswerFromStore = bookTestsStore.testAnswers.filter(answer => answer.question_id === questionId && answer.is_correct === true)
    if(rightAnswerFromStore.length > 0){
        selectedAnswers.value[questionId] = rightAnswerFromStore[0].id
    }
}

const saveAnswer = () => {
    const newA: BookTestAnswer = {
        id: newAnswer.id.toString(),
        text: newAnswer.text,
        is_correct: newAnswer.is_correct,
        question_id: newAnswer.question_id,
    }
    newAnswer.id++
    newAnswer.text = ""
    newAnswer.is_correct = false
    showQuestionInput.value = false
    newAnswers.push(newA)
}

const saveQuestion = async () => {
    const newQ: BookTestQuestion = {
        id: newQuestion.id,
        text: newQuestion.text,
        test_id: props.testId === 'new' ? '' : props.testId,
        book_id: 'pridat potom',
        selected_answer_id: newQuestion.selected_answer_id
    }
    questionToRef.push(newQuestionRef)
    newQuestions.push(newQ)

    newAnswers.forEach(a => a.question_id = newQuestion.id.toString())
    const rightAnswer = newAnswers.find(answer => answer.id === correctAnswer.value)
    if(rightAnswer){
        rightAnswer.is_correct = true
    }
    bookTestsStore.addAnswersToTest(newAnswers)
    getSelectedAnswers(newQuestion.id)

    newQuestionRef = doc(collection(db, "test_questions"))
    newQuestion.id = newQuestionRef.id
    newQuestion.text = ""
    newQuestion.selected_answer_id = ""
    newAnswer.text = ""
    newAnswer.id = 0

    bookTestsStore.testQuestions.push(newQ)
    newAnswers.splice(0, newAnswers.length)
}

const saveTest = async () => {
    dialog.saveDialog = false
    const newBookTest: BookTest = {
        id: '',
        name: testName.value,
        is_generated: false,
        user_id: authStore.user.id,
        book_collection_id: 'collection_id'
    }
    
    await bookTestsStore.testAnswers.forEach(a => {
        if(Object.values(selectedAnswers.value).includes(a.id)){
            a.is_correct = true
        } else {
            a.is_correct = false
        }
    })

    if(props.testId === 'new') {
        await bookTestsStore.createNewTest(newBookTest, newTestRef)
        await bookTestsStore.addQuestionsToTest(newQuestions.map(q => (q.test_id = newTestRef.id, q)), questionToRef)
    } else {
        await bookTestsStore.updateTestName(props.testId, testName.value)
        await bookTestsStore.addQuestionsToTest(newQuestions.map(q => (q.test_id = props.testId, q)), questionToRef)
    }
    console.log(bookTestsStore.testAnswers)
    await bookTestsStore.updateQuestionsAndAnswers()

    router.push('/testy/vyber')
}


const openDialog = () => {
    if(props.testId !== 'new'){
        testName.value = bookTestsStore.tests.find(test => test.id === props.testId)?.name
    }
}

const questionsTotal = computed(() => bookTestsStore.testQuestions.length)


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
    await bookTestsStore.testQuestions.splice(0, bookTestsStore.testQuestions.length)
    await bookTestsStore.testAnswers.splice(0, bookTestsStore.testAnswers.length)
    if(props.testId !== 'new'){
        await bookTestsStore.getAllTests(authStore.user.id)
        await bookTestsStore.getAllQuestionsByTestID(props.testId)
        await bookTestsStore.getAllAnswers()
        bookTestsStore.testQuestions.forEach(question => {
            const rightAns = bookTestsStore.testAnswers.find(answer => answer.question_id === question.id && answer.is_correct === true)
            if(rightAns){
                selectedAnswers.value[question.id] = rightAns.id
            }
        })
    }
})

onBeforeUnmount(async() => {
    await bookTestsStore.testQuestions.splice(0, bookTestsStore.testQuestions.length)
    await bookTestsStore.testAnswers.splice(0, bookTestsStore.testAnswers.length)
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

.textIn {
    padding-top: 10px;
}

.clickabeIcon {
    color: grey;
    transition: transform 0.3s;
}
.clickabeIcon:hover{
    cursor: pointer;
    color: #E4573D;
    transform: scale(1.2); 
    transition: transform 0.3s;
}


</style>