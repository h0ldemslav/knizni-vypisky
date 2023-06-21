<template>
  <article class="onhover" @click="props.disableClick ? '' : router.push({ name: 'collection_detail' , params: { id: props.collection.id } })" >
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
  </article>
</template>

<script setup lang="ts">
import {BookCollection} from "@/types";
import {onMounted, reactive} from "vue";
import router from '@/router'
import {DEFAULT_COLLECTION_IMAGE, getCollectionImage, getCollectionLabel} from "@/utils/bookCollectionUtils";

const props = defineProps<{ 
  collection: BookCollection,
  disableClick?: boolean,
  isClicked?: boolean,
 }>();

const state = reactive({
  image: DEFAULT_COLLECTION_IMAGE
})


onMounted(async () => {
  state.image = await getCollectionImage(props.collection)})
</script>

<style scoped>

.onhover {
  transition: transform 0.3s;
  border: 1px solid #ffffff;
}
.onhover:hover {
  border-color: red; /* Change the border color to your desired color for the last clicked book */
  transition: transform 0.3s ease, border-color 0.3s ease;
  transform: scale(1.1);
}
</style>