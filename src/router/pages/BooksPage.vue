<template>
    <Header>
        <img src="@/assets/title_image.svg" alt="knizni vypisky logo">
        <div>
            <h1>Aplikace na Vaše výpisky</h1>

            <div class="description">
                <p>V naší aplikaci si můžete vytvářet výpisky ke knihám dle vašich potřeb. Tak hurá do toho.</p>
                <p>Najděte si svou oblíbenou knížku a tvořte výpisky.</p>
            </div>

            <v-text-field
                    class="search-field"
                    :loading="booksStore.isLoadingSearchedBooks"
                    v-model="state.query"
                    density="compact"
                    variant="solo"
                    label="Hledat knihy"
                    append-inner-icon="mdi-magnify"
                    single-line
                    @click:append-inner="searchBooks()"
                    @keydown.enter="searchBooks()">
            </v-text-field>
        </div>
    </Header>
    <main>
        <section class="books">
            <Book v-for="book in booksStore.books.values()"
                  :book="book"
                  :key="book.id"/>
        </section>
    </main>
</template>

<script lang="ts" setup>
import Header from "@/components/Header.vue";
import {useBooksStore} from "@/stores/books";
import {onMounted, reactive} from "vue";
import {Order} from "@/services/BooksApiClient";
import Book from "@/components/data_templates/Book.vue";

const booksStore = useBooksStore();

const state = reactive({
    query: ""
})

const searchBooks = async () => {
    if (state.query == "") {
        await booksStore.fetchBooks("*", Order.RELEVANCE)
    } else {
        await booksStore.fetchBooks(state.query, Order.RELEVANCE)
    }
}

onMounted(() => {
    booksStore.fetchBooks("*", Order.RELEVANCE);
    booksStore.fetchNewestBooks()
});
</script>

<style>
Header {
    display: flex;
    justify-content: center;
    gap: 4rem;
}

Header img {
    width: 20%;
}

h1 {
    margin-top: 2rem;
}

.search-field {
    margin-top: 3rem;
}

.description {
    margin-top: 2rem;
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