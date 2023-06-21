import {BookCollection} from "@/types";
import {useBooksStore} from "@/stores/books";

const bookStore = useBooksStore()

export const DEFAULT_COLLECTION_IMAGE = "https://cdn.shopify.com/s/files/1/0064/5342/8271/collections/Banned-Books_2048x2048.jpg?v=1625674219"

export const getCollectionImage = async (collection: BookCollection) => {
    const size = collection.books.length

    if (size > 0) {
        const lastBook = await bookStore.getBookById(collection.books[size - 1])
        if (lastBook != undefined && lastBook.image != null) {
            return lastBook.image.smallThumbnail
        } else {
            return DEFAULT_COLLECTION_IMAGE
        }
    } else {
        return DEFAULT_COLLECTION_IMAGE
    }
}

export const getCollectionLabel = (collectionSize: number) => {
    if (collectionSize == 0) {
        return "knih"
    } else if (collectionSize == 1) {
        return "kniha"
    } else if (collectionSize > 1 && collectionSize < 5) {
        return "knihy"
    } else {
        return "knih"
    }
}