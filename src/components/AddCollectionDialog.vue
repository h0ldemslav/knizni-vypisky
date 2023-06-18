<template>
  <v-dialog
      v-model="props.dialogVisible"
      activator="parent"
      @click:outside="closeDialog()"
      width="700">

    <v-form @submit.prevent="submitNewCollectionForm" ref="formRef">
      <v-card>

        <v-card-title class="text-h5 mt-3 mr-3 mb-3">
          Vytvořit novou kolekci
        </v-card-title>

        <v-card-text>
          <v-text-field
              variant="solo"
              label="Název kolekce"
              :rules="[requiredRule]"
              v-model="state.title"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" block type="submit">Vytvořit</v-btn>
        </v-card-actions>

      </v-card>
    </v-form>

  </v-dialog>
</template>

<script setup lang="ts">

import {useBookCollectionsStore} from "@/stores/bookCollections";
import {reactive, ref} from "vue";
import {useAuthStore} from "@/stores/auth";

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  }
})

const formRef = ref<HTMLFormElement>()

const state = reactive({
  title: ""
})

const emit = defineEmits(["update:dialog-visible"])

const submitNewCollectionForm = () => {
  if (formRef.value?.validate() && state.title.length != 0) {
    bookCollectionsStore.createBookCollection({
      id: "",
      title: state.title,
      books: [],
      user_id: authStore.user.id
    })

    state.title = ""

    closeDialog()
  }
}

const closeDialog = () => {
  emit('update:dialog-visible', false)
}

const requiredRule = (value: string) => !!value || 'Název kolekce je povinný'

const bookCollectionsStore = useBookCollectionsStore()
const authStore = useAuthStore()
</script>

<style scoped>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
</style>