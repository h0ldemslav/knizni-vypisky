import { BookCollection } from '@/types'
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

export const useBookCollectionsStore = defineStore("bookCols", () => {

    const bookCollections = reactive<Array<BookCollection>>([])
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

    const createBookCollection = async (col: BookCollection) => {
        const { title, books, user_id } = col
        
        const newCollectionRef = await addDoc(bookCollectionsRef, {
            title: title,
            books: books,
            user_id: user_id
        })

        setCurrentBookCollection(
            {
                id: newCollectionRef.id,
                title: title,
                books: books,
                user_id: user_id
            }
        )
    }

    const updateBookCollectionTitle = async (id: string, newTitle: string) => {
        await updateDoc(doc(db, "book_collections", id), {
            title: newTitle 
        })
    }

    const removeBookCollection = async (id: string) => { 
        await deleteDoc(doc(db, "book_collections", id))
    }

    const addBook = async (collectionID: string, bookID: string) => { 
        await updateDoc(doc(db, "book_collections", collectionID), {
            books: arrayUnion(bookID) 
        })
    }
    
    const removeBook = async (collectionID: string, bookID: string) => {
        await updateDoc(doc(db, "book_collections", collectionID), {
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