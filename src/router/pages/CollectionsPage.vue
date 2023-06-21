<template>
  <Header>
    <v-row>
      <v-col cols="12" md="7">
        <v-row>
          <v-col cols="12" class="d-flex flex-column align-right mt-8">
            <h1>Kolekce</h1>
            <p>
              Uspořádejte si své knížky do kolekcí a mějte nad nimi lepší přehled. Z kolekcí si následně můžete tvořit
              vlastní testy a zkoušet, jestli ovládate látku své kolekce.
            </p>
            <div class="text-left">
              <v-btn
                  rounded="lg"
                  class="btn"
                  color="primary"
                  prepend-icon="mdi-book-plus-multiple-outline"
                  small
                  @click="state.isDialogVisible = true">
                Vytvořit kolekci
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="5" class="d-flex justify-center my-11">
        <img src="@/assets/collection.png" alt="kolekce knih">
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
          <Collection :collection="collection"/>
        </v-col>

        <div v-else>
          <h2 id="noCollectionMessage" class="mt-16">Zatím nemáte žádné kolekce</h2>
        </div>
      </v-row>
    </v-container>
  </main>

  <AddEditCollectionDialog
      :dialog-visible="state.isDialogVisible"
      @update:dialog-visible="isVisible => state.isDialogVisible = isVisible"/>
</template>

<script lang="ts" setup>
import Header from '@/components/Header.vue'
import {onMounted, reactive} from 'vue'
import {useBookCollectionsStore} from '@/stores/bookCollections'
import {useAuthStore} from '@/stores/auth'
import {bookCollectionsRef} from '@/main'
import {query, where, onSnapshot} from '@firebase/firestore'
import {BookCollection} from '@/types'
import Collection from "@/components/data_templates/CollectionCard.vue";
import AddEditCollectionDialog from "@/components/AddEditCollectionDialog.vue";

// component
const state = reactive({
  isDialogVisible: false,
  isLoadingCollections: true
})

// stores
const authStore = useAuthStore()
const bookCollectionsStore = useBookCollectionsStore()

// data
const q = query(bookCollectionsRef, where("user_id", "==", authStore.user.id))

// hooks
onMounted(() => {
  state.isLoadingCollections = true

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
})
</script>

<style scoped>

Header {
  padding-left: 15rem;
  padding-right: 15rem;
  padding-top: 1.5rem;
}

Header h1 {
  margin-bottom: 1.2rem;
}

img {
  height: 15rem;
  width: auto;
}

.btn {
  text-transform: unset;
  float: left;
  text-align: left;
  margin-top: 1.2rem;
}

@media only screen and (max-width: 1200px) {
  Header {
    padding-left: 10rem;
    padding-right: 10rem;
  }
}

@media only screen and (max-width: 992px) {
  Header {
    padding-left: 7.5rem;
    padding-right: 7.5rem;
  }

  img {
    display: none;
  }
}

@media only screen and (max-width: 768px) {
  Header {
    padding-left: 4.5rem;
    padding-right: 4.5rem;
  }
}


@media only screen and (max-width: 576px) {
  Header {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
</style>