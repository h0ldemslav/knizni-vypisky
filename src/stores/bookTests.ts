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
    deleteDoc,
    updateDoc,
} from '@firebase/firestore'

export const useBookTestsStore = defineStore("bookTst", () => {

    const tests = reactive<Array<BookTest>>([])
    const testQuestions = reactive<Array<BookTestQuestion>>([])
    const testAnswers = reactive<Array<BookTestAnswer>>([])

    const createNewTest = async (test: BookTest, newTestRef: any) => {
        // Batch allows to execute multiple operations together
        // https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
        const { id, name, is_generated, user_id, book_collection_id } = test

        const batch = writeBatch(db)
        batch.set(newTestRef, {name, is_generated, user_id, book_collection_id })

        tests.push({
            id: newTestRef.id,
            name: name,
            is_generated: is_generated,
            user_id: user_id,
            book_collection_id: book_collection_id
        })

        await batch.commit()
    }

    const addQuestionsToTest = async (questions: Array<BookTestQuestion>, questionRef: Array<any>) => {
        const batch = writeBatch(db)
        let index=-1
        
        questions.map((question) => {
            // const newRef = doc(collection(db, "test_questions"))
            index++
            const {text, book_id, test_id, selected_answer_id } = question
            
            batch.set(questionRef[index], {text, book_id, test_id, selected_answer_id })

            return { 
                id: questionRef[index].id,
                text: text,
                book_id: book_id,
                test_id: test_id,
                selected_answer_id: selected_answer_id
            }
        })

        await batch.commit()
    }

    const addAnswersToTest = async (answers: Array<BookTestAnswer>) => {
        const batch = writeBatch(db)

        testAnswers.push(...answers.map((answer) => {
            const newRef = doc(collection(db, "test_answers"))
            const { text, is_correct, question_id } = answer

            batch.set(newRef, { text, is_correct, question_id })

            return {
                id: newRef.id,
                text: text,
                is_correct: is_correct,
                question_id: question_id
            }
        }))

        await batch.commit()
    }

    const updateTestName = async (test_id: string, name: string | undefined) => {
        const testRef = doc(db, "book_tests", test_id)
        await updateDoc(testRef, { name: name })
    }

    const updateTestCollectionId = async (test_id: string, book_collection_id: string | undefined) => {
        const testRef = doc(db, "book_tests", test_id)
        await updateDoc(testRef, { book_collection_id: book_collection_id })
    }

    const updateQuestionsAndAnswers = async () => {
        const batch = writeBatch(db)

        testQuestions.forEach((question) => {
            const { text, book_id, test_id, selected_answer_id } = question
            const questionRef = doc(db, "test_questions", question.id)
            batch.update(questionRef, { text, book_id, test_id, selected_answer_id })
        })

        testAnswers.forEach((answer) => {
            const { text, is_correct, question_id } = answer
            const answerRef = doc(db, "test_answers", answer.id)
            batch.update(answerRef, { text, is_correct, question_id })
        })

        await batch.commit()
    }

    const deleteTestCompletely = async (test_id: string) => {
        const batch = writeBatch(db)

        const questionsToDelete = testQuestions.filter((question) => question.test_id === test_id).map((question) => question.id)
        const answersToDelete = testAnswers.filter((answer) => questionsToDelete.includes(answer.question_id)).map((answer) => answer.id)

        answersToDelete.forEach((answer_id) => {
            const answerRef = doc(db, "test_answers", answer_id)
            batch.delete(answerRef)
        })

        questionsToDelete.forEach((question_id) => {
            const questionRef = doc(db, "test_questions", question_id)
            batch.delete(questionRef)
        })

        const testRef = doc(db, "book_tests", test_id)
        batch.delete(testRef)

        await batch.commit()
    }

    const deleteQuestion = async (question_id: string) => {
        const answersToDelete = testAnswers.filter((answer) => answer.question_id === question_id).map((answer) => answer.id)

        const batch = writeBatch(db)

        answersToDelete.forEach((answer_id) => {
            testAnswers.splice(testAnswers.findIndex((answer) => answer.id === answer_id), 1)
            const answerRef = doc(db, "test_answers", answer_id)
            batch.delete(answerRef)
        })

        testQuestions.splice(testQuestions.findIndex((question) => question.id === question_id), 1)
        const questionRef = doc(db, "test_questions", question_id)
        batch.delete(questionRef)

        await batch.commit()
    }

    const deleteAnswer = async (answer_id: string) => {
        const answerRef = doc(db, "test_answers", answer_id)
        await deleteDoc(answerRef)
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

    const getAllQuestionsByTestID = async (id: string) => {
        const q = query(collection(db, "test_questions"), where("test_id", "==", id))
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
        //Sorting questions by book id, so that questions from the same book are grouped together
        testQuestions.sort((a, b) => {
            if (a.book_id < b.book_id) return -1;
            if (a.book_id > b.book_id) return 1;
            return 0;
        });
    }

    const getAllAnswers = async () => {
        const ids: Array<string> = testQuestions.map((question) => {
            return question.id
        })
        
        if(ids.length === 0) return
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

        getAllTests,
        getAllQuestionsByTestID,
        getAllAnswers,

        createNewTest,
        addQuestionsToTest,
        addAnswersToTest,

        updateTestName,
        updateTestCollectionId,
        updateQuestionsAndAnswers,

        deleteTestCompletely,
        deleteQuestion,
        deleteAnswer
    }
})