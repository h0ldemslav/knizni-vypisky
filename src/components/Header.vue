<template>
  <header class="bg-secondary">
    <slot></slot>
  </header>
</template>

<script lang="ts" setup>
</script>

<style scoped>
header {
  min-height: 35vh;
}

@media only screen and (max-width: 768px) {
  :slotted(.header-content) {
    width: 90vw;
  }
}
</style>