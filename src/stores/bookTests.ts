import { BookTest, BookTestQuestion, BookTestAnswer } from '@/types'
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { db } from '@/main'
import {
    getDocs,
    query,
    where,
    collection,
    doc,
    addDoc,
    writeBatch,
} from '@firebase/firestore'

export const useBookTestsStore = defineStore("bookTst", () => {

    const tests = reactive<Array<BookTest>>([])
    const testQuestions = reactive<Array<BookTestQuestion>>([])
    const testAnswers = reactive<Array<BookTestAnswer>>([])

    const createNewTest = async (test: BookTest): Promise<BookTest> => {
        const { name, is_generated, user_id, book_collection_id } = test
        const newTestRef = await addDoc(collection(db, "book_tests"), { name, is_generated, user_id, book_collection_id })

        return {
            id: newTestRef.id,
            name: name,
            is_generated: is_generated,
            user_id: user_id,
            book_collection_id: book_collection_id
        }
    }

    const addQuestionsToTest = async (questions: Array<BookTestQuestion>): Promise<Array<BookTestQuestion>> => {
        // Batch allows to execute multiple operations together
        // https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
        const batch = writeBatch(db)

        const newQuestions: Array<BookTestQuestion> = questions.map((question) => {
            const newRef = doc(collection(db, "test_questions"))
            const { text, book_id, test_id, selected_answer_id } = question
            
            batch.set(newRef, { text, book_id, test_id, selected_answer_id })

            return { 
                id: newRef.id,
                text: text,
                book_id: book_id,
                test_id: test_id,
                selected_answer_id: selected_answer_id
            }
        })

        await batch.commit()

        return newQuestions
    }

    const addAnswersToTest = async (answers: Array<BookTestAnswer>): Promise<Array<BookTestAnswer>> => {
        const batch = writeBatch(db)

        const newAnswers = answers.map((answer) => {
            const newRef = doc(collection(db, "test_answers"))
            const { text, is_correct, question_id } = answer

            batch.set(newRef, { text, is_correct, question_id })

            return {
                id: newRef.id,
                text: text,
                is_correct: is_correct,
                question_id: question_id
            }
        })

        await batch.commit()

        return newAnswers
    }

    const getAllTests = async (user_id: string | undefined) => {
        const q = query(collection(db, "book_tests"), where("user_id", "==", user_id))
        const snapshot = await getDocs(q)

        tests.length = 0

        snapshot.docs.forEach((doc) => {
            tests.push(
                {
                    id: doc.id,
                    name: doc.data().name,
                    is_generated: doc.data().is_generated,
                    user_id: doc.data().user_id,
                    book_collection_id: doc.data().book_collection_id
                }
            )
        })
    }

    const getAllQuestionsByTestID = async (selectedTest: BookTest) => {
        const q = query(collection(db, "test_questions"), where("test_id", "==", selectedTest.id))
        const snapshot = await getDocs(q)

        testQuestions.length = 0

        snapshot.docs.forEach((doc) => {
            testQuestions.push(
                { 
                    id: doc.id, 
                    text: doc.data().text,
                    test_id: doc.data().test_id,
                    book_id: doc.data().book_id,
                    selected_answer_id: doc.data().selected_answer_id
                }
            )
        })
    }

    const getAllAnswers = async () => {
        const ids: Array<string> = testQuestions.map((question) => {
            return question.id
        })

        const q = query(collection(db, "test_answers"), where("question_id", "in", ids))
        const snapshot = await getDocs(q)

        testAnswers.length = 0

        snapshot.docs.forEach((doc) => {
            testAnswers.push(
                { 
                    id: doc.id, 
                    text: doc.data().text,
                    is_correct: doc.data().is_correct,
                    question_id: doc.data().question_id
                }
            )
        })
    }


    return {
        tests,
        testQuestions,
        testAnswers,
        createNewTest,
        addQuestionsToTest,
        addAnswersToTest,
        getAllTests,
        getAllQuestionsByTestID,
        getAllAnswers
    }
})