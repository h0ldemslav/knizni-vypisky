import { BookTest, BookTestQuestion, BookTestAnswer, BookTestPassed } from '@/types'
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { db } from '@/main'
import {
    getDocs,
    getDoc,
    query,
    where,
    collection,
    doc,
    writeBatch,
    deleteDoc,
    updateDoc,
    Timestamp
} from '@firebase/firestore'

export const useBookTestsStore = defineStore("bookTst", () => {

    const tests = reactive<Array<BookTest>>([])
    const generatedTests = reactive<Array<BookTest>>([])
    const testQuestions = reactive<Array<BookTestQuestion>>([])
    const testAnswers = reactive<Array<BookTestAnswer>>([])
    const currentTest = reactive<BookTest>({id: "", name: "", is_generated: false, user_id: "", book_collection_id: ""})
    const currentPassedTest = reactive<BookTestPassed>({
        id: "",
        test_id: "",
        user_id: "",
        created_at: null,
        selected_answers_ids: []
    })
    const passedTests = reactive<Array<BookTestPassed>>([])

    const createNewTest = async (test: BookTest, newTestRef: any) => {
        // Batch allows to execute multiple operations together
        // https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
        const {id, name, is_generated, user_id, book_collection_id} = test
        console.log("test:", test)

        const batch = writeBatch(db)
        batch.set(newTestRef, {name, is_generated, user_id, book_collection_id})

        tests.push({
            id: newTestRef.id,
            name: name,
            is_generated: is_generated,
            user_id: user_id,
            book_collection_id: book_collection_id
        })

        await batch.commit()
    }

    const createPassedTest = async (test: BookTestPassed, newTestPassedRef: any) => {
        const {id, test_id, user_id, selected_answers_ids, created_at} = test
        console.log("test:", test)

        const batch = writeBatch(db)
        batch.set(newTestPassedRef, {test_id, user_id, selected_answers_ids, created_at})

        passedTests.push({
            id: newTestPassedRef.id,
            test_id: test.test_id,
            user_id: test.user_id,
            selected_answers_ids: test.selected_answers_ids,
            created_at: test.created_at
        })

        await batch.commit()
    }

    const addQuestionsToTest = async (questions: Array<BookTestQuestion>, questionRef: Array<any>) => {
        const batch = writeBatch(db)
        let index = -1

        questions.map((question) => {
            // const newRef = doc(collection(db, "test_questions"))
            index++
            const {text, book_id, test_id} = question

            batch.set(questionRef[index], {text, book_id, test_id})

            return {
                id: questionRef[index].id,
                text: text,
                book_id: book_id,
                test_id: test_id
            }
        })

        await batch.commit()
    }

    const addAnswersToTest = async (answers: Array<BookTestAnswer>) => {
        const batch = writeBatch(db)

        testAnswers.push(...answers.map((answer) => {
            const newRef = doc(collection(db, "test_answers"))
            const {text, is_correct, question_id} = answer

            batch.set(newRef, {text, is_correct, question_id})

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
        await updateDoc(testRef, {name: name})
    }

    const updateTestCollectionId = async (test_id: string, book_collection_id: string | undefined) => {
        const testRef = doc(db, "book_tests", test_id)
        await updateDoc(testRef, {book_collection_id: book_collection_id})
    }

    const updateQuestionsAndAnswers = async () => {
        const batch = writeBatch(db)

        testQuestions.forEach((question) => {
            const {text, book_id, test_id} = question
            const questionRef = doc(db, "test_questions", question.id)
            batch.update(questionRef, {text, book_id, test_id})
        })

        testAnswers.forEach((answer) => {
            const {text, is_correct, question_id} = answer
            const answerRef = doc(db, "test_answers", answer.id)
            batch.update(answerRef, {text, is_correct, question_id})
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

    const getTestById = async (id: string, user_id: string | undefined) => {
        // reset current test
        currentTest.id = ""
        currentTest.name = ""
        currentTest.user_id = ""
        currentTest.is_generated = false
        currentTest.book_collection_id = ""

        const docRef = doc(db, "book_tests", id)

        const snapshot = await getDoc(docRef)

        if (snapshot.exists() && snapshot.data().user_id == user_id) {
            currentTest.id = snapshot.id
            currentTest.name = snapshot.data().name
            currentTest.user_id = snapshot.data().userId
            currentTest.is_generated = snapshot.data().is_generated
            currentTest.book_collection_id = snapshot.data().book_collection_id
        }
    }

    const getGeneratedTests = async (user_id: string | undefined) => {
        const q = query(collection(db, "book_tests"),
            where("user_id", "==", user_id),
            where("is_generated", "==", true))
        const snapshot = await getDocs(q)

        generatedTests.length = 0

        snapshot.docs.forEach((doc) => {
            generatedTests.push(
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

        if (ids.length === 0) return
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

    const getAllPassedTests = async (user_id: string | undefined) => {
        const q = query(collection(db, "test_passed"), where("user_id", "==", user_id))
        const snapshot = await getDocs(q)

        passedTests.length = 0

        snapshot.docs.forEach((document) => {
            passedTests.push(
                {
                    id: document.id,
                    test_id: document.data().test_id,
                    user_id: document.data().user_id,
                    selected_answers_ids: document.data().selected_answers_ids,
                    created_at: document.data().created_at
                }
            )
        })
    }

    const getPassedTestById = async (id: string, user_id: string | undefined) => {
        const docRef = doc(db, "test_passed", id)

        const snapshot = await getDoc(docRef)

        if (snapshot.exists() && snapshot.data().user_id == user_id) {
            // questions of passed test
            await getAllQuestionsByTestID(snapshot.data().test_id)

            // answers of passed test
            await getAllAnswers()

            // test of passed test
            await getTestById(snapshot.data().test_id, user_id)

            // passed test
            currentPassedTest.id = snapshot.id
            currentPassedTest.test_id = snapshot.data().test_id
            currentPassedTest.user_id = snapshot.data().user_id
            currentPassedTest.selected_answers_ids = snapshot.data().selected_answers_ids
            currentPassedTest.created_at = snapshot.data().created_at
        }
    }

    const deleteAllPassedTestsByBookTestID = async (book_test_id: string) => {
        const batch = writeBatch(db)

        const filteredPassedTests = passedTests.filter((test) => test.test_id === book_test_id)

        filteredPassedTests.forEach((test) => {
            const testRef = doc(collection(db, "test_passed"), test.id)
            batch.delete(testRef)
        })

        const updatedPassedTests = passedTests.filter((test) => test.test_id !== book_test_id)
        passedTests.length = 0
        passedTests.push(...updatedPassedTests)

        await batch.commit()
    }

    return {
        tests,
        testQuestions,
        testAnswers,
        passedTests,
        currentTest,
        currentPassedTest,
        generatedTests,

        getAllTests,
        getTestById,
        getAllQuestionsByTestID,
        getAllAnswers,
        getGeneratedTests,

        createNewTest,
        addQuestionsToTest,
        addAnswersToTest,

        updateTestName,
        updateTestCollectionId,
        updateQuestionsAndAnswers,

        deleteTestCompletely,
        deleteQuestion,
        deleteAnswer,

        createPassedTest,
        getAllPassedTests,
        getPassedTestById,
        deleteAllPassedTestsByBookTestID
    }
})