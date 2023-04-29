import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { db, bookCollectionsRef } from '@/main'
import { 
    doc,
    addDoc,
    updateDoc,
    deleteDoc, 
    arrayRemove, 
    arrayUnion
} from '@firebase/firestore'


export interface BookCollection {
    id: string,
    title: string,
    books: Array<string>,
    user_id: string
}

export const useBookCollectionsStore = defineStore("bookCols", () => {

    const bookCollections = reactive<BookCollection[]>([])
    const currentBookCollection = reactive<BookCollection>({
        id: "",
        title: "",
        books: Array<string>(),
        user_id: ""
    })

    const setCurrentBookCollection = (col: BookCollection) => {
        currentBookCollection.id = col.id
        currentBookCollection.title = col.title
        currentBookCollection.books = col.books
        currentBookCollection.user_id = col.user_id
    }

    const createBookCollection = (col_title: string, user_id: string | undefined) => {
        addDoc(bookCollectionsRef, {
            title: col_title,
            books: Array<string>(),
            user_id: user_id
        })
    }

    const updateBookCollectionTitle = (newTitle: string) => {
        updateDoc(doc(db, "book_collections", currentBookCollection.id), {
            title: newTitle 
        })
    }

    const removeBookCollection = () => { 
        deleteDoc(doc(db, "book_collections", currentBookCollection.id))
    }

    const addBook = (bookID: string) => { 
        updateDoc(doc(db, "book_collections", currentBookCollection.id), {
            books: arrayUnion(bookID) 
        })
    }
    
    const removeBook = (bookID: string) => {
        updateDoc(doc(db, "book_collections", currentBookCollection.id), {
            books: arrayRemove(bookID) 
        })
    }


    return {
        bookCollections,
        currentBookCollection, 
        setCurrentBookCollection,
        createBookCollection,
        updateBookCollectionTitle,
        removeBookCollection,
        addBook, 
        removeBook 
    }
})