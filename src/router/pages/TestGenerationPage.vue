<template>
    <Header>
        <v-row>
            <v-col cols="12" sm="5">
                <h1 class="leftMargin mt-9">Generace testových otázek</h1>
                    <p class="leftMargin">Zde si můžeš naším algoritmem nechat vygenerovat otázky vztahující se k tebou vybrané kolekci knížek.</p>
                <v-sheet max-width="200" class="leftMargin mb-4 mt-4">
                    <v-form  @submit.prevent class="formBackground">
                    <v-text-field
                        type="number"
                        label="Počet otázek"
                        min="1"
                        max="60"
                        v-model="questionCount.count"
                    ></v-text-field>
                        <v-btn
                            @click="saveSelection()"
                            color="primary"
                            type="submit"
                            block>
                        Vygenerovat
                        </v-btn>
                    </v-form>
             </v-sheet>
            </v-col>
            <v-col cols="12" sm="7">
                <v-img
                    class="mt-8"
                    :src="collectionImg"
                    lazy-src=""
                    height="200px"
                    :cover="false"/>
            </v-col>
        </v-row>    
    </Header>
    <main>
        <div class="d-flex justify-center ma-6" v-if="state.isLoadingCollections">
        <v-progress-circular
            color="primary"
            indeterminate
            :size="68"
            :width="5"/>
        </div>

        <v-container fluid class="pa-8 collections" v-else>
        <v-row class="justify-center">
            <v-col v-if="bookCollectionsStore.bookCollections.length > 0" cols="12" sm="6" md="4" lg="3"
                v-for="collection in bookCollectionsStore.bookCollections" :key="collection.id">
            
            <div @click="handleCollectionClicked(collection.id)">
                <Collection :collection="collection"
                    :disableClick="true"
                    :class="{ otherclass: collection.is_clicked }"/>
            </div>
            </v-col>

            <div v-else>
            <h2 id="noCollectionMessage" class="mt-16">Zatím nemáte žádné kolekce</h2>
            </div>
        </v-row>
        </v-container>
    </main>
</template>

<script lang="ts" setup>

import Header from "@/components/Header.vue";
import { Book as BookInterface } from "@/types/model/Book";
import { onMounted, computed, reactive, ref} from 'vue'
import { useBookCollectionsStore } from '@/stores/bookCollections'
import {useBooksStore} from "@/stores/books";
import { useAuthStore } from '@/stores/auth'
import { bookCollectionsRef } from '@/main'
import {Order} from "@/services/BooksApiClient";
import { query, where, onSnapshot } from '@firebase/firestore'
import { BookCollection } from '@/types'
import {getCollectionImage} from "@/utils/bookCollectionUtils";
import Collection from "@/components/data_templates/CollectionCard.vue";
import router from '@/router'
    
const authStore = useAuthStore()
const bookCollectionsStore = useBookCollectionsStore()
const booksStore = useBooksStore();

const state = reactive({
  isDialogVisible: false,
  isLoadingCollections: true
})

let collectionImg = ref('')

const handleCollectionClicked = async (collectionId: string) => {
    console.log(collectionId)
    await bookCollectionsStore.getBookCollectionById(collectionId, authStore.user.id)
    collectionImg.value = await getCollectionImage(bookCollectionsStore.currentBookCollection)
    // if(lastClickedBookId.value !== '') {
    //     await bookCollectionsStore.getBookCollectionById(collectionId, authStore.user.id)
    //     lastClickedBook = await booksStore.getBookById(lastClickedBookId.value)
    //     if (lastClickedBook) {
    //         lastClickedBook.isClicked = false;
    //     }
    // }

    // lastClickedBookId.value = bookId

    // console.log(collectionId)
    // const book = await booksStore.getBookById(bookId)
    // if (book) {
    //     book.isClicked = true;
    //     lastClickedBook.value = book;
    // }
}

const saveSelection = () =>{
    if(questionCount.count > 60) {
        alert("Maximální počet otázek je 60")
        return
    }
    if(bookCollectionsStore.currentBookCollection.id !== '' && questionCount.count !== 0) {
        router.push(`/testy/${bookCollectionsStore.currentBookCollection.id}/${questionCount.count}`)
    } else {
        alert("Vyber knížku a počet otázek")
    }
}

const questionCount = reactive({
    count: 0
})

console.log(questionCount.count)

bookCollectionsStore.bookCollections.forEach((bookCollection) => {
    console.log(bookCollection.title)
    console.log("here")
})

const q = query(bookCollectionsRef, where("user_id", "==", authStore.user.id))
    
onMounted(async() => {
    onSnapshot(q, (snapshot) => {
    const queriedBookCollections: Array<BookCollection> = Array()

    snapshot.docs.forEach((doc) => {

      const col: BookCollection = {
        id: doc.id,
        title: doc.data().title,
        books: doc.data().books,
        user_id: doc.data().user_id
      }

      queriedBookCollections.push(col)
    })

    bookCollectionsStore.bookCollections.length = 0
    bookCollectionsStore.bookCollections.push(...queriedBookCollections)

    state.isLoadingCollections = false
  })
  console.log(bookCollectionsStore.bookCollections)
    booksStore.fetchBooks("*", Order.RELEVANCE);
    booksStore.fetchNewestBooks()
})
</script>

<style scoped>

.leftMargin {
    margin-left: 130px;

    @media screen and (max-width: 648px){
        margin: 0 50px 0 30px;
        text-align: left;
    }
}


.formBackground {
    background-color: #F4F3EC;
}

.topMargin {
    margin-top: 20px;
}
.books {
    width: 70vw;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 80px;
    justify-content: end;
    margin-left: auto;
    margin-right: 20px;
    margin-top: 90px;
}

</style>
