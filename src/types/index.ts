// User auth

export interface User {
    id: string | undefined
}

// Book collections 

export interface BookCollection {
    id: string,
    title: string,
    books: Array<string>,
    user_id: string | undefined
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
    name: string | undefined,
    is_generated: boolean,
    user_id: string | undefined,
    book_collection_id: string
}

export interface BookTestQuestion {
    id: string
    text: string,
    book_id: string,
    test_id: string
    selected_answer_id: string
}

export interface BookTestAnswer {
    id: string
    text: string,
    is_correct: boolean,
    question_id: string
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