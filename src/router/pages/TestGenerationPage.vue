<template>
    <Header>
        <v-row>
            <v-col cols="12" sm="6">
                <h1 class="leftMargin mt-9">Generace testových otázek</h1>
                <v-col>
                    <p class="leftMargin">Zde si můžeš naším algoritmem nechat vygenerovat otázky vztahující se k tebou vybrané kolekci knížek.</p>
                <v-sheet max-width="200" class="leftMargin mb-4 mt-4">
                    <v-form  @submit.prevent class="formBackground">
                    <v-text-field
                        type="number"
                        label="Počet otázek"
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
            </v-col>
            <v-col cols="12" sm="6">
                <Book v-if="lastClickedBook !== null"
                :book = lastClickedBook
                class ="mt-16">
                    
                </Book>
            </v-col>
        </v-row>    
    </Header>
    <main>
        <section class="books">
            <Book v-for="book in booksStore.books.values()"
                  :book="book"
                  :key="book.id"
                  :class="{ otherclass: book.isClicked }"
                  @book-clicked="handleBookClicked"/>
        </section>
    </main>
</template>

<script lang="ts" setup>

import Header from "@/components/Header.vue";
import Book from "@/components/data_templates/BookCard.vue";
import { Book as BookInterface } from "@/types/model/Book";
import { onMounted, computed, reactive, ref} from 'vue'
import { useBookCollectionsStore } from '@/stores/bookCollections'
import {useBooksStore} from "@/stores/books";
import { useAuthStore } from '@/stores/auth'
import { bookCollectionsRef } from '@/main'
import {Order} from "@/services/BooksApiClient";
import { query, where, onSnapshot } from '@firebase/firestore'
import { BookCollection } from '@/types'
import router from '@/router'
    
const authStore = useAuthStore()
const bookCollectionsStore = useBookCollectionsStore()
const booksStore = useBooksStore();

const lastClickedBook = ref<BookInterface | null>(null);

const lastClickedBookId = ref('')

const handleBookClicked = async (bookId: string) => {
    if(lastClickedBookId.value !== '') {
        const lastClickedBook = await booksStore.getBookById(lastClickedBookId.value)
        if (lastClickedBook) {
            lastClickedBook.isClicked = false;
        }
    }

    lastClickedBookId.value = bookId

    console.log(bookId)
    const book = await booksStore.getBookById(bookId)
    if (book) {
        book.isClicked = true;
        lastClickedBook.value = book;
    }
}

const saveSelection = () =>{
    if(lastClickedBookId.value !== '' && questionCount.count !== 0) {
        router.push(`/testy/${lastClickedBookId.value}/${questionCount.count}`)
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
    
onMounted(() => {
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
    })
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
