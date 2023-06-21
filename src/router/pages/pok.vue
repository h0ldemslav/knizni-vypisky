<template>
  <main>
<!--    todo prejmenovat na TestSelectionPage-->
    <v-card
        class="ma-5">
      <v-tabs
          align-tabs="center"
          v-model="tab"
          bg-color="primary"
      >
        <v-tab value="generated_tests">Vygenerované testy</v-tab>
        <v-tab value="created_tests">Vytvořené testy</v-tab>
        <v-tab value="passed_tests">Absolvované testy</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab" class="ma-5 pa-1">
<!--          ----------------------------------------------------------------------------------------------->
          <v-window-item value="generated_tests">
            <v-table v-if="bookTestsStore.generatedTests.length !== 0">
              <thead>
              <tr>
                <th class="text-left">Název</th>
                <th class="text-left">Kolekce</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="test in bookTestsStore.generatedTests" :key="test.id">
<!--              <tr v-for="test in bookTestsStore.tests.filter(t => t.is_generated === false)" :key="test.id">-->
                <td>{{ test.name }}</td>
                <td>{{ test.book_collection_id }}</td>
              </tr>
              </tbody>
            </v-table>
            <div v-else>
              Žádné vygenerované testy
            </div>
          </v-window-item>

 <!--          ----------------------------------------------------------------------------------------------->

          <v-window-item value="created_tests">
            <v-table v-if="bookTestsStore.tests.length !== 0">
              <thead>
              <tr>
                <th class="text-left">
                  Název
                </th>
                <th class="text-left">
                  Kolekce
                </th>
                <th class="text-right">
                  Akce
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="test in bookTestsStore.tests"
                  :key="test.name"
              >
                <td><router-link :to="{name: 'take-test', params: {bookTestId: test.id, testPreview: false}}">
                  {{ test.name }}
                </router-link></td>
                <td>{{ test.book_collection_id }}</td>
                <td class="text-right">
                  <router-link :to="{name: 'test-creation', params: {testId: test.id}}">
                    <v-btn color="primary">Upravit</v-btn>
                  </router-link>
                  <v-btn color="primary" @click="deleteTest(test.id)">
                    Smazat
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </v-table>
            <div v-else>
              Žádné vytvořené testy
            </div>

<!--            tests-->
<!--            <div v-for="test in bookTestsStore.tests">-->
<!--              <router-link :to="{name: 'take-test', params: {bookTestId: test.id}}">-->
<!--                {{ test.id }}-->
<!--                {{ test.name }}-->
<!--                {{ test.is_generated }}-->
<!--              </router-link>-->
<!--              <router-link :to="{name: 'test-creation', params: {testId: test.id}}">-->
<!--                <v-btn color="primary">Upravit</v-btn>-->
<!--              </router-link>-->
<!--              <v-btn color="primary" @click="deleteTest(test.id)">-->
<!--                Smazat-->
<!--              </v-btn>-->
<!--            </div>-->
          </v-window-item>
 <!--          ----------------------------------------------------------------------------------------------->
          <v-window-item value="passed_tests">
<!--            -->
<!--            test questions-->
<!--            <div v-for="test in bookTestsStore.testQuestions">-->
<!--              {{ test.id }} , {{ test.text }}, {{ test }}-->
<!--            </div>-->

<!--            answers-->
<!--            <div v-for="ans in bookTestsStore.testAnswers">-->
<!--              {{ ans }}-->
<!--            </div>-->

<!--            tests {{ bookTestsStore.tests.length}}-->
<!--            <div v-for="test in bookTestsStore.tests">-->
<!--              {{ test }}-->
<!--            </div>-->

<!--            passed {{ bookTestsStore.passedTests.length}}-->
<!--            <div v-for="test in bookTestsStore.passedTests">-->
<!--              {{ test }}-->
<!--            </div>-->

            <v-table v-if="bookTestsStore.passedTests.length !== 0">
              <thead>
              <tr>
                <th class="text-left">
                  Název
                </th>
                <th class="text-left">
                  Kolekce
                </th>
                <th class="text-left">
                  Datum
                </th>
                <th class="text-left">
                  Úspěšnost
                </th>
                <th class="text-right">
                  Akce
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="test in bookTestsStore.passedTests"
                  :key="test.id"
              >
                <td>
                  {{ test.id }}
                </td>
                <td>
                  {{ test.book_collection_id }}
                </td>
                <td>
                  {{ test.created_at.seconds }}
                </td>
                <td>
                  uspesnost
                </td>
                <td class="text-right">
                  <router-link :to="{name: 'take-test', params: {bookTestId: test.test_id, testPreview: true}}">
                    <v-btn color="primary">Náhled</v-btn>
                  </router-link>
                </td>
              </tr>
              </tbody>
            </v-table>
            <div v-else>
              Žádné vytvořené testy
            </div>

          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>


  </main>

</template>

<script lang="ts">
//
export default {
  data: () => ({
    tab: null,
  }),
}

</script>

<script lang="ts" setup> // lang="ts" setup>
import {useBookTestsStore} from "@/stores/bookTests.js";
import {useAuthStore} from "@/stores/auth.js";
import {onMounted, reactive} from "vue";


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
  await bookTestsStore.getGeneratedTests(authStore.user.id)
  await bookTestsStore.getAllQuestionsByTestID("EKzub6NGeAdDTIbxWFMT")
  await bookTestsStore.getAllAnswers()
  await bookTestsStore.getAllPassedTests(authStore.user.id)

  // generatedTests = bookTestsStore.tests.filter(t => t.is_generated == true)
})


// const data = () => ({
//   tab: null,
// })
</script>