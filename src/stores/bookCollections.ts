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
    arrayUnion,
    query,
    where,
    getDocs,
    getDoc
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

    const getBookCollections = async (user_id: string | undefined) => {
        const q = query(bookCollectionsRef, where("user_id", "==", user_id))
        const snapshot = await getDocs(q)

        if (snapshot.docs.length > 0) {

            bookCollections.length = 0

            snapshot.docs.forEach((doc) => {
                const col: BookCollection = {
                    id: doc.id,
                    title: doc.data().title,
                    books: doc.data().books,
                    user_id: user_id
                }

                bookCollections.push(col)
            })

        }
        
    }

    const getBookCollectionById = async (collection_id: string, user_id: string | undefined) => {
        const docRef = doc(db, "book_collections", collection_id)

        const snapshot = await getDoc(docRef)

        if (snapshot.exists() && snapshot.data().user_id == user_id) {
            currentBookCollection.id = snapshot.id
            currentBookCollection.title = snapshot.data().title
            currentBookCollection.books = snapshot.data().books
            currentBookCollection.user_id = snapshot.data().user_id
        }
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
        const colIndex = bookCollections.findIndex((col) => col.id === collectionID)
        bookCollections[colIndex].books.push(bookID)
        
        await updateDoc(doc(db, "book_collections", collectionID), {
            books: arrayUnion(bookID) 
        })
    }
    
    const removeBook = async (collectionID: string, bookID: string) => {
        const colIndex = bookCollections.findIndex((col) => col.id === collectionID)
        const bookIndex = bookCollections[colIndex].books.findIndex((id) => id === bookID)
        bookCollections[colIndex].books.splice(bookIndex, 1)

        await updateDoc(doc(db, "book_collections", collectionID), {
            books: arrayRemove(bookID) 
        })
    }


    return {
        bookCollections,
        currentBookCollection,
         
        getBookCollections,
        getBookCollectionById,
        setCurrentBookCollection,
        createBookCollection,
        updateBookCollectionTitle,
        removeBookCollection,
        addBook, 
        removeBook 
    }
})