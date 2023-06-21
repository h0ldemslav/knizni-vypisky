// User auth

import {Timestamp} from "@firebase/firestore";

export interface User {
    id: string | undefined
}

// Book collections 

export interface BookCollection {
    id: string,
    title: string,
    books: Array<string>,
    user_id: string | undefined
    is_clicked?: boolean
}

// Notes

export type NoteField = { name: string, value: string }

export interface BookNote {
    id: string,
    fields: Array<NoteField>,
    book_id: string,
    user_id: string | undefined
}

// Tests

export interface BookTest {
    id: string,
    name: string | undefined,
    is_generated: boolean,
    user_id: string | undefined,
    book_collection_id: string | undefined
}

export interface BookTestQuestion {
    id: string
    text: string,
    book_id: string,
    test_id: string
}

export interface BookTestAnswer {
    id: string
    text: string,
    is_correct: boolean,
    question_id: string
}

export interface BookTestPassed {
    id: string
    test_id: string
    user_id: string
    selected_answers_ids: string[]
    created_at: Timestamp | null;
}

// Book detail

export enum BookLanguage {
    Czech = "čeština",
    English = "angličtina",
    German = "němčina",
    French = "francouzština",
    Spanish = "španělština",
    Chinese = "čínština"
}