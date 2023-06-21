<template>
  <Header>
    <v-row>
      <v-col cols="12" sm="6">
        <div class="leftTopMargin">
          <h1>Testové otázky kolekce</h1>
          <v-col cols="12" sm="8">
            <p>Zde můžeš vyzkoušet svoje znalosti ke zvolené kolekci na vytvořených otázkách otázkách.</p>
            <p class="font-weight-bold primary-color mb-4 mb-sm-0">Neváhej a pusť se do toho!</p>
          </v-col>
        </div>
      </v-col>
      <v-col cols="12" sm="4" class="hidden-sm-and-down">
        <v-card width="250px" class="">
          <v-card-title class="d-flex justify-center">
            <v-card max-width="300x" class="ma-2 mt-1 pa-1">
              <h3 class="text-center">{{ bookCollection.title }}</h3>
            </v-card>
          </v-card-title>
          <v-img
              class="mb-3"
              :src="bookCollection.image"
              lazy-src=""
              height="200px"
              :cover="false"/>
        </v-card>
      </v-col>
    </v-row>
  </Header>
  <main>
    <v-row>
      <v-col cols="12" sm="6" class="mt-7 ">
        <h1 class="testoveOtazkyHeaderMargin">{{ testName === undefined ? 'Testové otázky' : testName }}</h1>
        <div v-for="(question, index) in bookTestsStore.testQuestions" :key="question.id" class="mt-4 ml-sm-16 ml-9">
          <h3>{{ index + 1 }}. {{ question.text }}</h3>
          <div v-if="!state.testPreview">
            <v-radio-group
                v-model="selectedAnswers[question.id]"
                @mouseenter="getBookOnHover(question.book_id)"
                @mouseleave="getBookOnHover('')"
            >
              <v-radio
                  v-for="answer in bookTestsStore.testAnswers.filter(ans => ans.question_id === question.id)"
                  :key="answer.id"
                  :value="answer.id + ': ' + answer.is_correct"
                  color="primary"
                  class="ml-3"
                  :disabled="state.answersSend"
              >
                <template v-slot:label>
                  <div v-if="state.answersSend" :class="answer.is_correct ? 'text-success' : 'text-error'">
                    {{ answer.text }}
                  </div>
                  <div v-else> {{ answer.text }}</div>
                </template>
              </v-radio>
            </v-radio-group>
          </div>

          <div v-else v-for="answer in bookTestsStore.testAnswers.filter(ans => ans.question_id === question.id)">
              <span v-if="bookTestsStore.currentPassedTest.selected_answers_ids.includes(answer.id)" class="font-italic"> ✓ </span>
              <span
                  :class="[answer.is_correct ? 'text-success' : 'text-error', bookTestsStore.currentPassedTest.selected_answers_ids.includes(answer.id) ? 'font-italic' : '' ]">
                {{ answer.text }}
              </span>
          </div>
        </div>

        <v-btn v-if="!state.testPreview && !state.answersSend" color="primary" class="ml-16 mt-3"
               @click="getSelectedValues">Odeslat test
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
                <p>Procentuální úspěšnost: {{
                    Math.round(questionsCorrect / bookTestsStore.testQuestions.length * 100)
                  }} %</p>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" block @click=" closeDialog">Zpět k testu</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-btn>
        <v-btn v-else color="primary" class="ml-16" @click="router.push('/testy/vyber')">
          Zpět na výběr testů
        </v-btn>
      </v-col>
      <v-divider vertical class="mt-7 mr-5"></v-divider>
      <v-col cols="12" sm="3">
        <div id="testStatistics" class="fixedPosition mt-10">
          <v-row v-if="!state.testPreview">
            <v-col cols="4">
              <h2>Postup</h2>
            </v-col>
            <v-col cols="8">
              <v-progress-linear color="primary" :model-value=percentageOfQuestionsAnswered height="20"
                                 class="mt-2"></v-progress-linear>
            </v-col>
          </v-row>
          <v-row v-if="!state.testPreview">
            <v-col cols="7" class="ml-2">
              <h3>Otázek odpovězeno:</h3>
            </v-col>
            <v-col cols="2">
              <p class="mt-0">{{ questionsAnswered }}/{{ questionsTotal }}</p>
            </v-col>
            <v-col cols="2">
              <p class="mt-0">{{ isNaN(percentageOfQuestionsAnswered) === true ? 0 : percentageOfQuestionsAnswered }}&nbsp;%</p>
            </v-col>
          </v-row>
          <v-row v-if="state.answersSend || state.testPreview">
            <v-col cols="7" class="ml-2">
              <h3>Otázek správně:</h3>
            </v-col>
            <v-col cols="2">
              <p class="mt-0">{{ questionsCorrect }}/{{ questionsTotal }}</p>
            </v-col>
            <v-col cols="2">
              <p class="mt-0">{{ Math.round(questionsCorrect / bookTestsStore.testQuestions.length * 100) }}&nbsp;%</p>
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
import {useBookTestsStore} from "@/stores/bookTests";
import {useAuthStore} from '@/stores/auth'
import {useBooksStore} from '@/stores/books'
import {onMounted, onBeforeUnmount, computed, reactive, ref, defineProps} from 'vue'
import {Book as BookInterface} from "@/types/model/Book"
import {useBookCollectionsStore} from '@/stores/bookCollections'
import { getCollectionImage} from "@/utils/bookCollectionUtils";
import router from '@/router/index'
import {BookCollection, BookTest, BookTestPassed} from "@/types";
import {db} from "@/main";
import {collection, doc, Timestamp} from "@firebase/firestore";


const bookTestsStore = useBookTestsStore()
const authStore = useAuthStore()
const booksStore = useBooksStore()
const collectionStore = useBookCollectionsStore()

const props = defineProps<{ bookTestId: string, testPreview: string }>()

const testName = ref<string | undefined>(bookTestsStore.tests.find(test => test.id === props.bookTestId)?.name)

const newPassedTestRef = doc(collection(db, "test_passed"))

const bookCollection = reactive({
  image: '',
  title: ''
})


const dialog = reactive({
  value: false
})

const state = reactive({
  answersSend: false,
  testPreview: props.testPreview == "true"
})
// console.log("ans:", state.answersSend)
// console.log("ans props:", props.testPreview)
// console.log("bookid props:", props.bookTestId)

let questionsCorrect = ref<number>(-1)

const hoveredBook = ref<BookInterface | null>(null)

const selectedAnswers = ref<Record<string, string>>({});
const selectedAnswersToSave: Array<string> = [];

const closeDialog = () => {
  dialog.value = false
  state.answersSend = true
}

const questionsAnswered = computed(() => Object.keys(selectedAnswers.value).length)
const questionsTotal = computed(() => bookTestsStore.testQuestions.length)
const percentageOfQuestionsAnswered = computed(() => Math.round(Object.keys(selectedAnswers.value).length /
    bookTestsStore.testQuestions.length * 100))

// console.log("percentage:", percentageOfQuestionsAnswered.value)

const getSelectedValues = async () => {
  // console.log("keys " + Object.keys(selectedAnswers.value))
  // console.log("values " + Object.values(selectedAnswers.value), "!")
  // console.log("len " + Object.values(selectedAnswers.value).length, "!")
  // console.log("value:", selectedAnswers.value)
  let value: string = ""

  for (let i = 0; i < Object.values(selectedAnswers.value).length; i++) {
    value = ""
    value = value.concat("", Object.values(selectedAnswers.value)[i].substring(0, 20))
    selectedAnswersToSave.push(value)
  }
  // console.log("value concat:", value)
  // console.log("selectedToSave:", selectedAnswersToSave)

  questionsCorrect.value = Object.values(selectedAnswers.value).filter(answer => answer.includes('true')).length


  const newPassedBookTest: BookTestPassed = {
    id: '',
    test_id: props.bookTestId,
    user_id: authStore.user.id, // xsNnzfikywcDp3DV3ypWLFpNVYo2
    selected_answers_ids: selectedAnswersToSave,
    created_at: Timestamp.now(),
  }

  console.log("newpassed", newPassedBookTest, " ref:", newPassedTestRef)
  await bookTestsStore.createPassedTest(newPassedBookTest, newPassedTestRef)
}

const getBookOnHover = async (bookId: string) => {
  if (bookId !== '') {
    const book = await booksStore.getBookById(bookId)
    if (book) {
      hoveredBook.value = book
    }
    console.log('book', hoveredBook)
  } else {
    hoveredBook.value = null
  }
}

onMounted(async () => {
  await bookTestsStore.getAllTests(authStore.user.id)
  await collectionStore.getBookCollections(authStore.user.id)
  await authStore.getCurrentAuthUserID

  if (state.testPreview) {
    await bookTestsStore.getPassedTestById(props.bookTestId, authStore.user.id)
    questionsCorrect.value = bookTestsStore.testAnswers.filter(ans => ans.is_correct == true && bookTestsStore.currentPassedTest.selected_answers_ids.includes(ans.id)).length
    // console.log("ques", questionsCorrect.value)
    // console.log("ques", bookTestsStore.testAnswers)
  } else {
    await bookTestsStore.getAllQuestionsByTestID(props.bookTestId)
    await bookTestsStore.getAllAnswers()
  }

  const testCollection: BookCollection | undefined = collectionStore.bookCollections.find(bCollection => bCollection.title === (bookTestsStore.tests.find(test => test.id === props.bookTestId)?.book_collection_id))
  if (testCollection) {
    bookCollection.image = await getCollectionImage(testCollection)
    bookCollection.title = testCollection.title
  }
  bookTestsStore.testQuestions.sort((a, b) => {
    if (a.book_id < b.book_id) return -1;
    if (a.book_id > b.book_id) return 1;
    return 0;
  });
})

onBeforeUnmount(async () => {
  await bookTestsStore.testQuestions.splice(0, bookTestsStore.testQuestions.length)
  await bookTestsStore.testAnswers.splice(0, bookTestsStore.testAnswers.length)
})

</script>

<style scoped>

.leftTopMargin {
  margin: 55px 0 0 90px;

@media screen and (max-width: 648px) {
  margin:

30px

30px

0 20px

;
  text-align: left

;
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
  top: 3%;

@media screen and (max-width: 648px) {
  display: none

;
}

}

.testoveOtazkyHeaderMargin {
  margin-left: 82px;

@media screen and (max-width: 648px) {
  margin-left:

48px

;
}

}

</style>