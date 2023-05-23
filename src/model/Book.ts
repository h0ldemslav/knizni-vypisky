import {BookImage} from "@/model/BookImage";
import {BookRating} from "@/model/BookRating";

export interface Book {
    id: string
    title: string
    subtitle: string | null
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
