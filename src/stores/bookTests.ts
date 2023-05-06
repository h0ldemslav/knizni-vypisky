import { BookTest, BookTestQuestion } from '@/types'
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { db } from '@/main'
import {
    getDocs,
    query,
    where,
    collection
} from '@firebase/firestore'

export const useBookTestsStore = defineStore("bookTst", () => {
    
    const bookTests = reactive<Array <BookTest> >([])
    const bookTestQuestions = reactive<Array <BookTestQuestion>>([])

    const getAllBookTests = (user_id: string | undefined) => {
        const q = query(collection(db, "book_tests"), where("user_id", "==", user_id))

        getDocs(q)
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    bookTests.push(
                        {
                            id: doc.id,
                            user_id: doc.data().user_id,
                            book_collection_id: doc.data().book_collection_id,
                            questions: doc.data().questions
                        }
                    )

                })
            })
    }

    const getAllBookTestQuestions = (selectedTest: BookTest) => {
        // querying test_questions by __name__, which represents document ID in the collection
        const q = query(collection(db, "test_questions"), where("__name__", "in", selectedTest.questions.map(question => question.id)))
        
        getDocs(q)
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    bookTestQuestions.push(
                        { 
                            id: doc.id, 
                            text: doc.data().text,
                            book_id: doc.data().book_id, 
                            answers: doc.data().answers
                        }
                    )

                })
            })
    }


    return {
        bookTests,
        bookTestQuestions,
        getAllBookTests,
        getAllBookTestQuestions
    }
})