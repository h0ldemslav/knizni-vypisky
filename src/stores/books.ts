import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import {Book} from "@/types/model/Book";
import {BookResponseDTO, BooksApiClient, Order} from "@/services/BooksApiClient";
import {AxiosError} from "axios";

export const useBooksStore = defineStore("books", () => {
    const booksApi = BooksApiClient.getInstance();

    // 10 latest books
    const newestBooks = reactive<Book[]>([])

    const books = reactive<Map<string, Book>>(new Map<string, Book>());
    const totalBooksCount = ref(0);

    const isLoadingSearchedBooks = ref(false);
    const isLoadingNewestBooks = ref(false);
    const error = ref<string | null>(null);


    async function fetchBooks(query: string, order: Order) {
        isLoadingSearchedBooks.value = true;
        error.value = null;

        try {
            const dto: BookResponseDTO = await booksApi.getBooks(query, order);
            books.clear()
            dto.books.forEach((book) => {
                books.set(book.id, book)
            })

            totalBooksCount.value = dto.totalBooksCount
        } catch (e) {
            const err = e as AxiosError
            handleApiError(err)
        } finally {
            isLoadingSearchedBooks.value = false
        }
    }

    async function fetchNewestBooks() {
        isLoadingNewestBooks.value = true;
        error.value = null;

        try {
            const dto: BookResponseDTO = await booksApi.getBooks("*", Order.NEWEST, 10);
            newestBooks.splice(0, newestBooks.length)
            newestBooks.push(...dto.books)
        } catch (e) {
            const err = e as AxiosError
            handleApiError(err)
        } finally {
            isLoadingNewestBooks.value = false
        }
    }

    async function fetchBookById(bookId: string): Promise<Book | undefined> {
        isLoadingSearchedBooks.value = true;
        error.value = null;

        try {
            return await booksApi.getBookById(bookId)
        } catch (e) {
            const err = e as AxiosError
            handleApiError(err)
        } finally {
            isLoadingSearchedBooks.value = false
        }
    }

    async function getBookById(bookId: string): Promise<Book | undefined> {
        if (books.has(bookId)) {
            return books.get(bookId)
        } else {
            return fetchBookById(bookId);
        }
    }

    const handleApiError = (err: AxiosError) => {
        console.error(err.message)

        switch (err.status) {
            case 403:
                error.value = "Our Google API key is not working."
                break
            default:
                error.value = "Unable to fetch books."
        }
    }

    return {
        newestBooks,
        books,
        totalBooksCount,

        isLoadingSearchedBooks,
        isLoadingNewestBooks,
        error,

        fetchBooks,
        fetchNewestBooks,
        fetchBookById,
        getBookById
    }
})