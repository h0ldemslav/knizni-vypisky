<template>
  <v-card
      class="mx-auto"
      max-width="500">

    <v-img
        :src="state.image"
        height="200px"
        cover/>

    <v-card-title>
      {{ props.collection.title }}
    </v-card-title>

    <v-card-actions>
      <v-chip
          prepend-icon="mdi-bookshelf"
          variant="elevated"
          class="bg-primary">
        {{ props.collection.books.length }}
      </v-chip>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import {BookCollection} from "@/types";
import {useBooksStore} from "@/stores/books";
import {onMounted, reactive} from "vue";

const props = defineProps<{ collection: BookCollection }>();
const bookStore = useBooksStore()

const DEFAULT_COLLECTION_IMAGE = "https://cdn.shopify.com/s/files/1/0064/5342/8271/collections/Banned-Books_2048x2048.jpg?v=1625674219"

const state = reactive({
  image: DEFAULT_COLLECTION_IMAGE
})

onMounted(async () => {
  const collectionSize = props.collection.books.length

  if (collectionSize > 0) {
    const lastBook = await bookStore.getBookById(props.collection.books[collectionSize - 1])
    if (lastBook != undefined && lastBook.image != null) {
      state.image = lastBook.image.smallThumbnail
    }
  }
})
</script>

<style scoped>

</style>