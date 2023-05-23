import {Book} from "@/model/Book";
import axios from "axios";
import Config from "@/config";
import {BookRating} from "@/model/BookRating";
import {BookImage} from "@/model/BookImage";

export enum Order {
    NEWEST = "newest",
    RELEVANCE = "relevance"
}

export interface BookResponseDTO {
    totalBooksCount: number
    books: Book[]
}

export class BooksApiClient {
    private static INSTANCE: BooksApiClient;
    private readonly axiosInstance

    private constructor() {
        this.axiosInstance = axios.create({
            baseURL: Config.booksApiUrl,
        })

        this.axiosInstance.interceptors.request.use(config => {
            config.params = {
                ...config.params,
                key: Config.booksApiKey
            };

            return config;
        });
    }

    public static getInstance(): BooksApiClient {
        if (!this.INSTANCE) {
            BooksApiClient.INSTANCE = new BooksApiClient()
        }

        return BooksApiClient.INSTANCE
    }

    async getBooks(query: string = "", orderBy: Order, maxResults: Number = 40): Promise<BookResponseDTO> {
        let url = `/volumes?printType=books&langRestrict=cs&maxResults=${maxResults}`
        if (query !== "") {
            url += `&q=${query}`
        }

        const response = await this.axiosInstance.get(url)
        if (!("items" in response.data)) {
            return {books: [], totalBooksCount: 0}
        }

        // @ts-ignore
        const books: Book[] = response.data.items.map((rawData) => {
            return this.parseBook(rawData)
        })

        return {totalBooksCount: response.data.totalItems, books: books}
    }

    async getBookById(id: string): Promise<Book> {
        const response = await this.axiosInstance.get(`/volumes/${id}`)
        return this.parseBook(response.data)
    }

    private parseBook(rawData: any): Book {
        let subtitle = null
        if ("subtitle" in rawData.volumeInfo) {
            subtitle = rawData.volumeInfo.subtitle
        }

        let description = null
        if ("description" in rawData.volumeInfo) {
            description = rawData.volumeInfo.description
        }

        let image: BookImage | null = null
        if ("imageLinks" in rawData.volumeInfo) {
            image = {
                smallThumbnail: rawData.volumeInfo.imageLinks.smallThumbnail,
                thumbnail: rawData.volumeInfo.imageLinks.thumbnail
            }
        }

        let epubLink = null
        if ("epub" in rawData.accessInfo && "acsTokenLink" in rawData.accessInfo.epub) {
            epubLink = rawData.accessInfo.epub.acsTokenLink
        }

        let pdfLink = null
        if ("pdf" in rawData.accessInfo && "acsTokenLink" in rawData.accessInfo.pdf) {
            pdfLink = rawData.accessInfo.pdf.acsTokenLink
        }

        let rating: BookRating | null = null
        if ("averageRating" in rawData.volumeInfo) {
            rating = {average: rawData.volumeInfo.averageRating, count: rawData.volumeInfo.ratingsCount}
        }

        let categories: string[] = []
        if ("categories" in rawData.volumeInfo) {
            categories = rawData.volumeInfo.categories
        }

        let publisher: string | null = null
        if ("publisher" in rawData.volumeInfo) {
            publisher = rawData.volumeInfo.publisher
        }

        return {
            id: rawData.id,
            title: rawData.volumeInfo.title,
            subtitle: subtitle,
            description: description,
            authors: rawData.volumeInfo.authors,
            publishedDate: rawData.volumeInfo.publishedDate,
            image: image,
            language: rawData.volumeInfo.language,
            epubLink: epubLink,
            pdfLink: pdfLink,
            pageCount: rawData.volumeInfo.pageCount,
            rating: rating,
            categories: categories,
            publisher: publisher
        }
    }
}