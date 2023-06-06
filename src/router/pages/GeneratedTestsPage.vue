<template>
    <Header>
        {{ props.id }}
        {{ props.count }}
    </Header>
    <main>
        
    </main>
</template>

<script lang="ts" setup>
import Header from '@/components/Header.vue'

const props = defineProps<{id: string, count: number}>()

</script>

<style scoped>

</style>
