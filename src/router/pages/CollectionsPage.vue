<template>
    <Header>
        <h1>CollectionsPage</h1>
    </Header>
    <main>
        <!-- TODO -->
    </main>
</template>

<script lang="ts" setup>
    import Header from '@/components/Header.vue'
    import { onMounted } from 'vue'
    import { useBookCollectionsStore } from '@/stores/bookCollections'
    import { useAuthStore } from '@/stores/auth'
    import { bookCollectionsRef } from '@/main'
    import { query, where, onSnapshot } from '@firebase/firestore'
    import { BookCollection } from '@/types'
    
    const authStore = useAuthStore()
    const bookCollectionsStore = useBookCollectionsStore()

    const q = query(bookCollectionsRef, where("user_id", "==", authStore.user.id))
    
    onMounted(() => {
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
        })
    })
</script>