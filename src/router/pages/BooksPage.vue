<template>
  <Header>
    <img src="@/assets/title_image.svg" alt="knizni vypisky logo">
    <div class="header-content">
      <h1>Aplikace na Vaše výpisky</h1>

      <div class="description">
        <p>V naší aplikaci si můžete vytvářet výpisky ke knihám dle vašich potřeb. Tak hurá do toho.</p>
        <p>Najděte si svou oblíbenou knížku a tvořte výpisky.</p>
      </div>

      <v-text-field
          class="search-field"
          :loading="booksStore.isLoadingSearchedBooks.valueOf()"
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
    <section class="d-flex justify-center status-section"
         v-if="booksStore.isLoadingSearchedBooks || !booksStore.isLoadingSearchedBooks && booksStore.books.size == 0">
      <v-progress-circular
          v-if="booksStore.isLoadingSearchedBooks"
          color="primary"
          indeterminate
          :size="68"
          :width="5"/>

      <h2 class="ma-15" v-else>
        Nebyly nalezeny žádné knihy.
      </h2>
    </section>

    <section class="books" v-if="!booksStore.isLoadingSearchedBooks && booksStore.books.size > 0">
      <BookCard v-for="book in booksStore.books.values()"
                :book="book"
                :key="book.id"/>
    </section>
  </main>

  <Footer/>
</template>

<script lang="ts" setup>
import Header from "@/components/Header.vue";
import {useBooksStore} from "@/stores/books";
import {onMounted, reactive} from "vue";
import {Order} from "@/services/BooksApiClient";
import Footer from "@/components/Footer.vue";
import BookCard from "@/components/data_templates/BookCard.vue";

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

onMounted(async () => {
  await booksStore.fetchBooks("*", Order.RELEVANCE);
  await booksStore.fetchNewestBooks()
});
</script>

<style scoped>
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
  width: 40vw;
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
  gap: 4rem;
  margin: 4rem auto auto auto;
  justify-content: center;
  padding-bottom: 4rem;
}

.status-section {
  margin-top: 5rem;
  margin-bottom: 25rem;
}

@media only screen and (max-width: 992px) {
  img {
    display: none;
  }
}

@media only screen and (max-width: 768px) {
  .header-content {
    padding: 1.5rem;
  }

  .search-field {
    width: 100%;
  }
}
</style>