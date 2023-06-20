export interface RawISBN {
    type: string,
    identifier: string
}

export enum IsbnType {
    ISBN_10 = "ISBN-10",
    ISBN_13 = "ISBN-13"
}

export interface ISBN {
    type: IsbnType,
    value: string
}