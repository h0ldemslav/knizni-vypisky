<script setup lang="ts">
import {reactive, watch} from "vue";

const props = defineProps({
  burgerActive: {
    type: Boolean,
    default: false
  }
})

// state
const emit = defineEmits(["update:burger-active"])

const state = reactive({
  isActive: props.burgerActive
})

watch(() => props.burgerActive, (newValue) => {
  state.isActive = newValue;
});

// methods
const burgerClick = () => {
  state.isActive = !state.isActive;
  emit("update:burger-active", state.isActive);
}

</script>

<template>
  <v-icon
      size="large"
      :color="state.isActive ? 'primary' : 'text'"
      class="burger"
      :class="{'active': state.isActive}"
      icon="mdi-menu"
      @click="burgerClick()"
  />
</template>

<style scoped>
.burger {
  display: none;
  cursor: pointer;
  transition: all 0.5s;
  align-items: center;
}

.active {
  transform: rotate(90deg);
}

@media only screen and (max-width: 768px) {
  .burger {
    display: flex;
  }
}

@media only screen and (min-width: 769px) {
  .burger {
    display: none;
  }
}
</style>