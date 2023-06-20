<template>
  <router-link :to="{ name: 'collection_detail' , params: { id: props.collection.id } }">
    <v-card
        class="mx-auto"
        max-width="500">

      <v-img
          :src="state.image"
          height="200px"
          :cover="true"/>

      <v-card-title>
        {{ props.collection.title }}
      </v-card-title>

      <v-card-actions>
        <v-chip
            prepend-icon="mdi-bookshelf"
            variant="elevated"
            class="bg-primary">
          {{ props.collection.books.length }} {{ getCollectionLabel(props.collection.books.length) }}
        </v-chip>
      </v-card-actions>
    </v-card>
  </router-link>
</template>

<script setup lang="ts">
import {BookCollection} from "@/types";
import {onMounted, reactive} from "vue";
import {DEFAULT_COLLECTION_IMAGE, getCollectionImage, getCollectionLabel} from "@/utils/bookCollectionUtils";

const props = defineProps<{ collection: BookCollection }>();

const state = reactive({
  image: DEFAULT_COLLECTION_IMAGE
})

onMounted(async () => {
  state.image = await getCollectionImage(props.collection)
})
</script>

<style scoped>

</style>