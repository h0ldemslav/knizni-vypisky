import { DocumentReference, DocumentData } from '@firebase/firestore'

// User auth

export interface User {
    id: string | undefined
}

// Book collections 

export interface BookCollection {
    id: string,
    title: string,
    books: Array<string>,
    user_id: string
}

// Notes

export enum WriteOperation {
    Create, Update, Delete
}

export interface BookNote {
    id: string,
    fields: Array<{ name: string, value: string }>,
    book_id: string,
    user_id: string | undefined
}

// Tests

export interface BookTest {
    id: string,
    user_id: string | undefined,
    book_collection_id: DocumentReference<DocumentData>,
    questions: Array< DocumentReference<DocumentData> >
}

export interface BookTestQuestion {
    id: string,
    text: string,
    book_id: string,
    answers: Array<{ id: string, text: string, isCorrect: boolean }>
}