<template>
  <router-link :to="{ name: 'book_detail' , params: { id: props.book.id } }">
    <article>
      <v-row>
        <v-col>
          <img v-if="props.book.image" :src="props.book.image?.smallThumbnail" :alt="props.book.title"/>
          <img v-else src="https://cdn-icons-png.flaticon.com/512/207/207114.png" alt="obrázek knihy nenalezen"/>
        </v-col>
        <v-col>
          <h4>{{ props.book.title }}</h4>
          <div v-if="props.book.authors && props.book.authors.length > 0">{{ props.book.authors[0] }}</div>
          <div v-else>Autor neuveden</div>

          <!-- RATING -->
          <div v-if="props.book.rating != null">
            <v-rating
                v-model="props.book.rating.average"
                color="primary"
                size="x-small"
                density="comfortable"
                half-increments
                readonly
            />
            <span class="text-grey-lighten-2 text-caption me-2">
              ({{ props.book.rating.count }})
            </span>
          </div>

          <div class="description" v-if="props.book.description">
            {{ props.book.description }}
          </div>
        </v-col>
      </v-row>
    </article>
  </router-link>
</template>

<script setup lang="ts">
import {Book} from "@/types/model/Book";

const props = defineProps<{ book: Book }>();
</script>

<style scoped>
article {
  background-color: #FFFFFF;
  border-radius: 5px;
  width: 85vw;
  max-width: 550px;
  height: 230px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 20px;
}

img {
  width: auto;
  max-width: 150px;
  height: 220px;
  object-fit: fill;
  position: relative;
  margin-top: -40px;
}

.description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

@media only screen and (max-width: 576px) {
  .description {
    display: none;
  }
}
</style>