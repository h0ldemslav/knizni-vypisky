<template>
  <v-dialog
      v-model="props.dialogVisible"
      activator="parent"
      @click:outside="closeDialog()"
      width="700">

    <v-form @submit.prevent="saveCollection()" ref="formRef">
      <v-card>

        <v-card-title class="text-h5 mt-3 mr-3 mb-3">
          <span v-if="collectionId == null">Vytvořit novou kolekci</span>
          <span v-else>Upravit kolekci</span>
        </v-card-title>

        <v-card-text>
          <v-text-field
              id="title-textfield"
              variant="solo"
              label="Název kolekce"
              :rules="[requiredRule, titleLessThan75CharsRule]"
              v-model="state.title"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn
              color="primary"
              block
              type="submit"
              :disabled="state.isLoading"
              :loading="state.isLoading">
            Uložit
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-form>

  </v-dialog>
</template>

<script setup lang="ts">

import {useBookCollectionsStore} from "@/stores/bookCollections";
import {onMounted, reactive, ref} from "vue";
import {useAuthStore} from "@/stores/auth";

// component
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  collectionId: {
    type: String,
    default: null
  }
})
const formRef = ref<HTMLFormElement>()
const emit = defineEmits(["update:dialog-visible"])
const state = reactive({
  title: "",
  isLoading: false
})

// stores
const collStore = useBookCollectionsStore()
const authStore = useAuthStore()

// methods
const fetchCollection = async () => {
  if (props.collectionId != null) {
    await collStore.getBookCollectionById(props.collectionId, authStore.user.id)
    if (collStore.currentBookCollection.title != "") {
      state.title = collStore.currentBookCollection.title
    }
  }
}

const saveCollection = async () => {
  state.isLoading = true

  // validate form
  if (formRef.value?.validate() && state.title.length != 0 && state.title.length < 75) {
    if (props.collectionId == null) {
      // create new collection
      await collStore.createBookCollection({
        id: "",
        title: state.title,
        books: [],
        user_id: authStore.user.id
      })

      state.title = ""
    } else {
      // update existing collection
      await collStore.updateBookCollectionTitle(props.collectionId, state.title)
      await fetchCollection()
    }

    closeDialog()
  }

  state.isLoading = false
}

const closeDialog = () => {
  emit('update:dialog-visible', false)
}

// rules
const requiredRule = (value: string) => !!value || 'Název kolekce je povinný'
const titleLessThan75CharsRule = (value: string) => value.length < 75 || 'Název kolekce musí být kratší než 75 znaků'

// hooks
onMounted(async () => {
  await fetchCollection()
})
</script>

<style scoped>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
</style>