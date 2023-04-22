import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { getDocs } from '@firebase/firestore'
import { collectionRef } from '@/main'

export interface BookCollection {
    id: string,
    user_id: string,
    title: string,
    books: Array<string>
}

export const bookCollectionsStore = defineStore("bookCols", () => {

    const bookCollections = reactive(Array<BookCollection>())
    const currentBookCollectionID = ref("")

    const getAllBookCollections = () => {
        getDocs(collectionRef)
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    const col: BookCollection = {
                        id: doc.id,
                        user_id: doc.data().user_id,
                        title: doc.data().title,
                        books: doc.data().books
                    }

                    bookCollections.push(col)
                })
            })
    }

    const createBookCollection = (title: string, user_id: string) => {
        // TODO
    }

    const updateBookCollectionTitle = () => {
        // TODO
    }

    const removeBookCollection = () => {
        // TODO
    }

    return { bookCollections, getAllBookCollections }
})