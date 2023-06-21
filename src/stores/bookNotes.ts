import { BookNote } from '@/types'
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { db, bookNotesRef } from '@/main'
import {
    getDocs,
    query,
    where,
    doc,
    addDoc,
    updateDoc
} from '@firebase/firestore'

export const useBookNotesStore = defineStore("bookNts", () => {

    const currentBookNote = reactive<BookNote>({
        id: "",
        book_id: "",
        fields: [],
        user_id: ""
    })

    const getBookNote = async (book_id: string, user_id: string) => {
        const q = query(bookNotesRef, where("book_id", "==", book_id), where("user_id", "==", user_id))
        const snapshot = await getDocs(q) 

        if (snapshot.docs.length !== 0) {
            currentBookNote.id = snapshot.docs[0].id,
            currentBookNote.fields = snapshot.docs[0].data().fields,
            currentBookNote.book_id = snapshot.docs[0].data().book_id,
            currentBookNote.user_id = snapshot.docs[0].data().user_id
        } else {
            const newNoteRef = await addDoc(bookNotesRef, {
                fields: [],
                book_id: book_id,
                user_id: user_id
            })

            currentBookNote.id = newNoteRef.id
            currentBookNote.fields = []
        }
    }

    const updateBookNote = async (bookNote: BookNote) => {
        currentBookNote.fields = bookNote.fields
        await updateDoc(doc(db, "book_notes", bookNote.id), { fields: bookNote.fields })
    }

    return {
        currentBookNote,
        
        getBookNote,
        updateBookNote
    }
})