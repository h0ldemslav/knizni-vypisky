import { WriteOperation, BookNote } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db, bookNotesRef } from '@/main'
import {
    getDocs,
    query,
    where,
    doc,
    addDoc,
    updateDoc,
    deleteDoc 
} from '@firebase/firestore'

export const useBookNotesStore = defineStore("bookNts", () => {

    let dbWriteOperation = ref<WriteOperation>()

    const createBookNote = async (bookNote: BookNote): Promise<string> => {
        const docRef = await addDoc(bookNotesRef, {
            fields: bookNote.fields,
            book_id: bookNote.book_id,
            user_id: bookNote.user_id
        })
        
        dbWriteOperation.value = WriteOperation.Update
        return docRef.id
    }
    
    const getBookNote = async (book_id: string, user_id: string): Promise<BookNote | undefined> => {
        const q = query(bookNotesRef, where("book_id", "==", book_id), where("user_id", "==", user_id))
        const snapshot = await getDocs(q) 

        if (snapshot.docs.length !== 0) {
            dbWriteOperation.value = WriteOperation.Update
            return {
                id: snapshot.docs[0].id,
                fields: snapshot.docs[0].data().fields,
                book_id: snapshot.docs[0].data().book_id,
                user_id: snapshot.docs[0].data().user_id,
             }
        } else {
            dbWriteOperation.value = WriteOperation.Create
            return undefined
        }
    }

    const updateBookNote = async (bookNote: BookNote) => {
        await updateDoc(doc(db, "book_notes", bookNote.id), { fields: bookNote.fields })
    }

    const deleteBookNote = async (bookNote: BookNote) => {
        await deleteDoc(doc(db, "book_notes", bookNote.book_id))
    }

    return {
        dbWriteOperation,
        
        createBookNote,
        getBookNote,
        updateBookNote,
        deleteBookNote
    }
})