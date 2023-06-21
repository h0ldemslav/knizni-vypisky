<template>
  <Header>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-img
              aspect-ratio="1"
              contain
              :src="state.image">
          </v-img>
        </v-col>
        <v-col cols="8">
          <div>
            <h1 class="mb-2">{{ collection.title }}</h1>

            <v-chip
                prepend-icon="mdi-bookshelf"
                variant="elevated"
                class="bg-primary">
              {{ collection.books.length }}
              {{ getCollectionLabel(collection.books.length) }}
            </v-chip>

          </div>
          <v-spacer></v-spacer>
          <div class="mt-10">
            <v-btn
                id="editCollection"
                rounded="lg"
                class="btn bg-info me-5"
                prepend-icon="mdi-pencil"
                variant="tonal"
                @click="state.isDialogVisible = true">
              Upravit
            </v-btn>

            <v-btn
                id="deleteCollection"
                rounded="lg"
                class="btn bg-error"
                prepend-icon="mdi-trash-can-outline"
                min-width="135"
                variant="tonal"
                @click="deleteCollection()">
              Odstranit
            </v-btn>

          </div>
        </v-col>
      </v-row>
    </v-container>
  </Header>

  <main>
    <v-data-table
        v-if="!state.isLoadingBooks"
        :headers="headers"
        :items="books"
        item-value="name"
        class="elevation-1">
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <router-link :to="{name:'book_detail', params: { id: item.columns.id }}">
              <v-avatar v-if="item.columns.image != null" size="70" class="rounded ma-5">
                <img :src="item.columns.image.smallThumbnail" alt="">
              </v-avatar>
            </router-link>
          </td>

          <td>
            <router-link :to="{name:'book_detail', params: { id: item.columns.id }}">
              {{ item.columns.title }}
            </router-link>
          </td>

          <td>
            <span v-if="item.columns.authors.length > 0">
              {{ item.columns.authors[0] }}
            </span>
          </td>

          <td>
            <span v-if="item.columns.description != null">
              {{ item.columns.description.substring(0, 80) }}
            </span>
            <span v-else>
              Bez popisku
            </span>
          </td>

          <td class="text-disabled">{{ item.columns.id }}</td>

          <td>
            <v-btn
                class="ma-6"
                icon="mdi-book-remove-outline"
                @click="removeBook(item.columns.id)"/>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="d-flex justify-center ma-6" v-else>
      <v-progress-circular
          color="primary"
          indeterminate
          :size="68"
          :width="5">

      </v-progress-circular>
    </div>
  </main>

  <AddEditCollectionDialog
      :collection-id="id"
      :dialog-visible="state.isDialogVisible"
      @update:dialog-visible="isVisible => state.isDialogVisible = isVisible"/>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import {onMounted, reactive, ref} from "vue";
import {useBookCollectionsStore} from "@/stores/bookCollections";
import {Book} from "@/types/model/Book";
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import {useBooksStore} from "@/stores/books";
import {Mutex} from "async-mutex"
import {DEFAULT_COLLECTION_IMAGE, getCollectionImage, getCollectionLabel} from "@/utils/bookCollectionUtils";
import AddEditCollectionDialog from "@/components/AddEditCollectionDialog.vue";

// component
const state = reactive({
  isLoadingCollection: true,
  isLoadingBooks: true,
  isDialogVisible: false,
  image: DEFAULT_COLLECTION_IMAGE,
})

// routing
const id = useRoute().params.id as string
const router = useRouter()

// stores
const authStore = useAuthStore()
const collStore = useBookCollectionsStore()
const booksStore = useBooksStore()

// data
const collection = reactive(collStore.currentBookCollection)
const books = ref<Book[]>([])
const lock = new Mutex()
const headers = [
  {title: 'Obrázek', key: 'image', align: 'start', sortable: false},
  {title: 'Název', key: 'title', sortable: false},
  {title: 'Autor', key: 'authors', sortable: false},
  {title: 'Popisek', key: 'description', sortable: false},
  {title: 'ID', key: 'id', sortable: false},
  {title: 'Odebrat', key: 'actions', sortable: false},
]

// methods
const fetchCollection = async () => {
  state.isLoadingCollection = true

  try {
    await collStore.getBookCollectionById(id, authStore.user.id)

    if (collStore.currentBookCollection.id == "") {
      await router.push({name: "page_not_found"})
    }
  } catch {
    await router.push({name: "page_not_found"})
  }

  state.isLoadingCollection = false
}

const fetchBooks = async () => {
  state.isLoadingBooks = true

  if (collStore.currentBookCollection.books.length != 0) {
    await Promise.all(collStore.currentBookCollection.books.map(async (bookId) => {
          const book = await booksStore.getBookById(bookId)
          if (book != undefined) {
            const release = await lock.acquire()

            try {
              books.value.push(book)
            } finally {
              release()
            }
          }
        })
    )
  }

  state.isLoadingBooks = false
}

const removeBook = async (bookId: string) => {
  await collStore.removeBook(id, bookId)
  books.value = books.value.filter((book) => {
    return book.id != bookId
  })
}

const deleteCollection = async () => {
  await collStore.removeBookCollection(id)
  router.back()
}

// hooks
onMounted(async () => {
  await fetchCollection()
  await fetchBooks()

  if (collStore.currentBookCollection.id != "") {
    state.image = await getCollectionImage(collStore.currentBookCollection)
  }
})
</script>

<style scoped>
main {
  padding: 2.5rem 4rem;
}
</style>