<template>
  <main>
    <v-card
        class="ma-5">
      <v-tabs
          align-tabs="center"
          v-model="tab"
          bg-color="primary"
      >
        <v-tab value="generated_tests">Vygenerované testy</v-tab>
        <v-tab value="created_tests">Vytvořené testy</v-tab>
        <v-tab class="passed_tests" value="passed_tests">Absolvované testy</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab" class="ma-5 pa-1">

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
                <td>{{ test.name }}</td>
                <td>{{ test.book_collection_id }}</td>
              </tr>
              </tbody>
            </v-table>
            <div v-else>
              Žádné vygenerované testy
            </div>
          </v-window-item>

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
          </v-window-item>

          <v-window-item value="passed_tests">
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
                  {{ bookTestsStore.tests.filter(t => t.id === test.test_id) != null ? bookTestsStore.tests.filter(t => t.id === test.test_id)[0].name : ''}}
                </td>
                <td>
                  {{ bookTestsStore.tests.filter(t => t.id === test.test_id) != null ? bookTestsStore.tests.filter(t => t.id === test.test_id)[0].book_collection_id : '' }}
                </td>
                <td>
                  {{ new Date(test.created_at.seconds*1000).getDate() }}.
                  {{ new Date(test.created_at.seconds*1000).getMonth() }}.
                  {{ new Date(test.created_at.seconds*1000).getFullYear() }}<br>
                  {{ new Date(test.created_at.seconds*1000).getHours() }}:{{ new Date(test.created_at.seconds*1000).getMinutes() < 9 ? '0'+new Date(test.created_at.seconds*1000).getMinutes() : new Date(test.created_at.seconds*1000).getMinutes()}}
                </td>
                <td>
                  uspesnost
                </td>
                <td class="text-right">
                  <router-link :to="{name: 'take-test', params: {bookTestId: test.id, testPreview: true}}">
                    <v-btn color="primary">Náhled</v-btn>
                  </router-link>
                </td>
              </tr>
              </tbody>
            </v-table>
            <div v-else>
              Žádné absolvované testy
            </div>

          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>


  </main>

</template>

<script lang="ts" setup>
import {useBookTestsStore} from "@/stores/bookTests.js";
import {useAuthStore} from "@/stores/auth.js";
import {onMounted, ref} from "vue";
import {useBookCollectionsStore} from "@/stores/bookCollections";

const tab = ref(null)
const deleteTest = async (testId: string) => {
  await bookTestsStore.getAllQuestionsByTestID(testId)
  await bookTestsStore.getAllAnswers()
  await bookTestsStore.deleteAllPassedTestsByBookTestID(testId)
  await bookTestsStore.deleteTestCompletely(testId)
  await bookTestsStore.getAllTests(authStore.user.id)
}

const bookTestsStore = useBookTestsStore()
const bookCollectionsStore = useBookCollectionsStore()
const authStore = useAuthStore()


onMounted(async () => {
  await bookTestsStore.getAllTests(authStore.user.id)
  await bookTestsStore.getAllAnswers()
  await bookTestsStore.getGeneratedTests(authStore.user.id)
  await bookTestsStore.getAllPassedTests(authStore.user.id)
  await bookCollectionsStore.getBookCollections(authStore.user.id)
})

</script>