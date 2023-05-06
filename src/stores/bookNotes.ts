import { WriteOperation, BookNote } from '@/types'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
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

    const currentBookNote = reactive<BookNote>({
        id: "",
        fields: [],
        book_id: "",
        user_id: undefined
    })

    const createBookNote = () => {
        addDoc(bookNotesRef, {
            fields: currentBookNote.fields,
            book_id: currentBookNote.book_id,
            user_id: currentBookNote.user_id
        })
            .then((doc) => {
                currentBookNote.id = doc.id
                dbWriteOperation.value = WriteOperation.Update
            })
    }

    const getBookNote = (book_id: string, user_id: string) => {
        const q = query(bookNotesRef, where("book_id", "==", book_id), where("user_id", "==", user_id))

        getDocs(q)
            .then((snapshot) => {
                // only one document expected

                if (snapshot.docs.length !== 0) {
                    dbWriteOperation.value = WriteOperation.Update

                    currentBookNote.id = snapshot.docs[0].id
                    currentBookNote.fields = snapshot.docs[0].data().fields
                    currentBookNote.book_id = snapshot.docs[0].data().book_id
                    currentBookNote.user_id = snapshot.docs[0].data().user_id
                } else {
                    dbWriteOperation.value = WriteOperation.Create
                }
            })
    }

    const updateBookNote = () => {
        updateDoc(doc(db, "book_notes", currentBookNote.id), currentBookNote)
    }

    const deleteBookNote = () => {
        deleteDoc(doc(db, "book_notes", currentBookNote.id))
    }

    return {
        dbWriteOperation,
        currentBookNote,
        createBookNote,
        getBookNote,
        updateBookNote,
        deleteBookNote
    }
})