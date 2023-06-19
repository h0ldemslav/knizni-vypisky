import {BookImage} from "@/types/model/BookImage";
import {BookRating} from "@/types/model/BookRating";
import {ISBN} from "@/types/model/ISBN";

export interface Book {
    id: string
    title: string
    subtitle: string | null
    isbn: ISBN[]
    description: string | null
    authors: string[]
    publishedDate: string,
    image: BookImage | null,
    language: string
    epubLink: string | null
    pdfLink: string | null
    pageCount: number | null
    rating: BookRating | null
    categories: string[]
    publisher: string | null
}
