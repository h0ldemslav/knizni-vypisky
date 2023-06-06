<template>
    <section v-if="book">
        <img v-if="book.image" :src="book.image?.smallThumbnail" :alt="book.title"/>
        <img v-else src="https://cdn-icons-png.flaticon.com/512/207/207114.png" alt="Obrázek knihy nenalezen"/>
        <h2>{{ book.title }}</h2>
        <p>{{ getListOfAuthors() }}</p>

        <p v-if="book.rating">Hodnocení: {{ book.rating.average }}, počet recenzí: {{ book.rating.count }}</p>

        <a v-if="book.pdfLink" :href="book.pdfLink">
            <img class="small-svg-icon" src="../../assets/pdf_link_icon.svg" alt="Odkaz na PDF soubor">
        </a>
        <a v-if="book.epubLink" :href="book.epubLink">
            <img class="small-svg-icon" src="../../assets/epub_link_icon.svg" alt="Odkaz na EPUB">
        </a>

        <section>
            <h3>Informace o knize</h3>
            <ul>
                <li><strong>ISBN</strong> {{ getListOfISBN() }}</li>
                <li><strong>Vydavatel</strong> {{ book.publisher ? book.publisher : "Neznamý vydavatel"}}</li>
                <li><strong>Vydáno</strong> {{ book.publishedDate ? book.publishedDate : "-" }}</li>
                <li><strong>Počet stran</strong> {{ book.pageCount ? book.pageCount : "-" }}</li>
                <li><strong>Jazyk</strong> {{ getFullLanguageName(book.language) }}</li>
            </ul>
        </section>
    </section>
    
    <section v-else>
        <h2>Hledana kniha nebyla nalezena</h2>
    </section>

    <section v-if="isNotesSectionVisible">
        <h2>Mé poznámky</h2>

        <form action="#" @submit.prevent="saveNote">
                <div v-for="field in note?.fields">
                <input type="text" v-model="field.name">
                <input type="text" v-model="field.value">
            </div>

            <button type="submit">Uložit</button>
        </form>

        <button @click="addNewField">Přidat nové políčko</button>
    </section>
</template>

<script lang="ts" setup>
    import { useBooksStore } from '@/stores/books'
    import { onMounted, ref } from 'vue'
    import { Book } from '@/model/Book'
    import { BookLanguage, BookNote, WriteOperation } from '@/types'
    import { useAuthStore } from '@/stores/auth'
    import { useBookNotesStore } from '@/stores/bookNotes'

    const props = defineProps<{ id: string }>()

    const authStore = useAuthStore()

    const bookStore = useBooksStore()
    const book = ref<Book | undefined>()
    
    const notesStore = useBookNotesStore()
    const isNotesSectionVisible = ref(false)
    const note = ref<BookNote | undefined>()

    const addNewField = () => note.value?.fields.push({ name: "Název", value: "" })

    const saveNote = async () => {
        if (note.value && note.value.fields) {
            
            if (notesStore.dbWriteOperation === WriteOperation.Create) {
                note.value.id = await notesStore.createBookNote(note.value)
            } else if (notesStore.dbWriteOperation === WriteOperation.Update) {
                await notesStore.updateBookNote(note.value)
            }

        }
    }

    const getListOfISBN = (): string => {
        let isbn: string = ""

        if (book.value?.isbn) {
            for (let i = 0; i < book.value.isbn.length; i++) {
                isbn += book.value.isbn[i].value + ` (${book.value.isbn[i].type})`

                if (i !== book.value.isbn.length - 1) isbn += ", "
            }
        }

        return isbn
    }

    const getListOfAuthors = (): string => {
        let authors: string = ""

        if (book.value?.authors) {
            for (let i = 0; i < book.value.authors.length; i++) {
                authors += book.value.authors[i]

                if (i !== book.value.authors.length - 1) authors += ", "
            }
        }

        return authors
    } 

    const getFullLanguageName = (langShort: string): string => {
        let language = "" 
        
        switch (langShort) {
            case "cs": 
                language = BookLanguage.Czech
                break

            case "en":
                language = BookLanguage.English
                break

            case "de":
                language = BookLanguage.German
                break

            case "fr":
                language = BookLanguage.French
                break

            case "es":
                language = BookLanguage.Spanish
                break

            case "zh":
                language = BookLanguage.Chinese
                break

            default:
                language = langShort
        }

        return language
    }


    onMounted(async () => {
        const foundBook = await bookStore.getBookById(props.id)
        book.value = foundBook

        if (authStore.isUserLoggedIn && authStore.user.id) {
            isNotesSectionVisible.value = true
            note.value = await notesStore.getBookNote(props.id, authStore.user.id)
            
            if (!note.value) {
                note.value = {
                    id: "",
                    fields: [],
                    book_id: props.id,
                    user_id: authStore.user.id
                }
            }
        }
    })

</script>