<template>
    <section v-if="book" class="main-section">
        <div class="book-image-wrapper">
            <img v-if="book.image" :src="book.image?.smallThumbnail" :alt="book.title"/>
            <img v-else src="https://cdn-icons-png.flaticon.com/512/207/207114.png" alt="Obrázek knihy nenalezen"/>
        </div>

        <section class="intro-section">
            <h2>{{ book.title }}</h2>
            <p class="book-title"><strong>{{ getListOfAuthors() }}</strong></p>

            <div v-if="book.rating" class="rating-wrapper">
                <img v-for="src in getRatingStars(book.rating.average)" :src="src" alt="" class="img-star">
                <span class="rating-count">{{ book.rating.count }}</span>
            </div>

            <div class="download-links">
                <a v-if="book.pdfLink" :href="book.pdfLink" class="mr-4">
                    <img class="small-svg-icon" src="../../assets/pdf_link_icon.svg" alt="Odkaz na PDF soubor">
                </a>
                <a v-if="book.epubLink" :href="book.epubLink">
                    <img class="small-svg-icon" src="../../assets/epub_link_icon.svg" alt="Odkaz na EPUB">
                </a>
            </div>
        </section>

        <div class="section-wrapper">
            <section class="desc-section">
                <h3>Informace o knize</h3>
                <ul>
                    <li v-if="book.isbn.length > 0" v-for="isbn in book.isbn">
                      <strong>{{isbn.type}}</strong>
                      {{ isbn.value}}
                    </li>
                    <li><strong>Vydavatel</strong>{{ book.publisher ? book.publisher : "Neznamý vydavatel"}}</li>
                    <li><strong>Vydáno</strong>{{ book.publishedDate }}</li>
                    <li><strong>Počet stran</strong>{{ book.pageCount ? book.pageCount : "-" }}</li>
                    <li><strong>Jazyk</strong>{{ getFullLanguageName(book.language) }}</li>
                </ul>

                <section v-if="authStore.isUserLoggedIn">
                    <h3>Kolekce</h3>

                    <v-select
                        variant="solo"
                        no-data-text="Nemáte žádné kolekce"
                        v-model="bookCollectionsModel"
                        :items="bookCollectionsStore.bookCollections"
                        item-title="title"
                        item-value="id"
                        label="Vybrat"
                        return-object
                        multiple
                        @update:modelValue="isSelectInputChanged = true"
                        class="collections-select"
                    ></v-select>

                    <div class="action-buttons">
                        <v-btn v-if="isSelectInputChanged" @click="cancelSelectField" variant="text" color="red" class="font-weight-bold">Zrušit</v-btn>

                        <v-btn 
                            v-if="isSelectInputChanged"
                            @click="updateUserBookCollections"
                            prepend-icon="mdi-content-save" 
                            color="green"
                            class="ml-2"
                        >
                            <template v-slot:prepend>
                                <v-icon color="white" class="pb-1"></v-icon>
                            </template>
                            Uložit
                        </v-btn>
                    </div>
                </section>

            </section>

            <section class="notes-section" v-if="authStore.isUserLoggedIn">
                <h3>Mé poznámky</h3>

                <form action="#" @submit.prevent="updateBookNoteFields">
                    <div :class="{ 'fields-overflow-wrapper': bookNotesStore.currentBookNote.fields.length > 2 || fields.length > 2 }">

                        <div v-for="(field, index) in bookNotesStore.currentBookNote.fields" class="fields-wrapper">
                            <label v-if="!isAddingFields" class="mr-4"><strong>{{ field.name }}</strong></label>
                            <input v-if="isAddingFields" type="text" v-model="field.name" class="basic-textfield mr-4 pa-1">
                            <v-icon 
                                icon="mdi-delete" 
                                v-if="isAddingFields" 
                                @click="removeField(index, bookNotesStore.currentBookNote.fields)" 
                                class="pt-2"
                            >
                            </v-icon>
                            <textarea 
                                v-model="field.value"
                                rows="3"
                                :maxlength="textAreaMaximumChars"
                                :readonly="!isAddingFields"
                                class="note-textarea"
                            >
                            </textarea>
                            <span v-if="isAddingFields" class="field-value-char-counter">{{ field.value.length }} / {{ textAreaMaximumChars }}</span>
                        </div>

                        <div v-for="(field, index) in fields" class="fields-wrapper">
                            <input type="text" v-model="field.name" placeholder="Název" class="basic-textfield mr-4 pa-1">
                            <v-icon icon="mdi-delete" v-if="isAddingFields" @click="removeField(index, fields)" class="pt-2"></v-icon>
                            <textarea 
                                placeholder="Text"
                                v-model="field.value"
                                rows="3"
                                :maxlength="textAreaMaximumChars"
                                :readonly="!isAddingFields"
                                class="note-textarea"
                            >
                            </textarea>
                            <span v-if="isAddingFields" class="field-value-char-counter">{{ field.value.length }} / {{ textAreaMaximumChars }}</span>
                        </div>

                    </div>
                    
                    <div v-if="isAddingFields" class="fab-add-wrapper">
                        <v-btn @click="addNewField" icon="mdi-plus" color="red" rounded="lg" size="40">                
                            <template v-slot:prepend>
                                <v-icon color="white"></v-icon>
                            </template>
                        </v-btn>
                    </div>

                    <div class="action-buttons mt-4" :style="bookNotesStore.currentBookNote.fields.length !== 0 ? 'justify-content: flex-end;' : 'justify-content: flex-start;'">
                        <v-btn v-if="!isAddingFields" @click="isAddingFields = true">
                            {{ bookNotesStore.currentBookNote.fields.length > 0 ? 'Editovat' : 'Přidat' }}
                        </v-btn>

                        <v-btn v-if="isAddingFields" @click="cancelForm" variant="text" color="red" class="font-weight-bold">Zrušit</v-btn>

                        <v-btn 
                            v-if="isAddingFields" 
                            prepend-icon="mdi-content-save" 
                            color="green"
                            type="submit"
                            class="ml-2"
                        >
                            <template v-slot:prepend>
                                <v-icon color="white" class="pb-1"></v-icon>
                            </template>
                            Uložit
                        </v-btn>
                    </div>
                </form>

            </section>

        </div>

    </section>

</template>

<script lang="ts" setup>
    import { useBooksStore } from '@/stores/books'
    import { onMounted, ref, reactive } from 'vue'
    import { Book } from '@/types/model/Book'
    import { BookCollection, BookLanguage, NoteField } from '@/types'
    import { useAuthStore } from '@/stores/auth'
    import { useBookNotesStore } from '@/stores/bookNotes'
    import { useBookCollectionsStore } from '@/stores/bookCollections'
    import router from '..'

    const props = defineProps<{ id: string }>()

    const authStore = useAuthStore()
    const bookStore = useBooksStore()
    const bookCollectionsStore = useBookCollectionsStore()
    const bookNotesStore = useBookNotesStore()

    const book = ref<Book>()
    const bookCollectionsModel = ref<BookCollection[]>([])
    const isSelectInputChanged = ref<boolean>(false)

    const fields = reactive<Array<NoteField>>([])
    const currentBookNoteFieldsCopy: Array<NoteField> = []
    const isAddingFields = ref(false)
    const textAreaMaximumChars = 512

    const addNewField = () => fields.push({ name: "", value: ""})
    
    const cancelForm = () => {
        fields.length = 0

        if (currentBookNoteFieldsCopy.length > 0) {
            bookNotesStore.currentBookNote.fields = [...currentBookNoteFieldsCopy]
            updateCopyFields()
        }

        isAddingFields.value = false
    }

    const removeField = (index: number, fields: Array<NoteField>) => {
        fields.splice(index, 1)
    }

    const updateCopyFields = () => {
        currentBookNoteFieldsCopy.length = 0

        bookNotesStore.currentBookNote.fields.forEach((field) => {
                currentBookNoteFieldsCopy.push({ name: field.name, value: field.value })
        })
    }

    const cancelSelectField = () => {
        bookCollectionsModel.value.length = 0
        bookCollectionsModel.value.push(...bookCollectionsStore.bookCollections.filter(
                        (col) => col.books.includes(book.value.id )
                    )
        )

        isSelectInputChanged.value = false
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

    const getRatingStars = (rating: number): string[] => {
        const filled = "/src/assets/filled_star_icon.svg"
        const half = "/src/assets/empty_star_icon.svg"
        const empty = "/src/assets/empty_star_icon.svg"

        let stars = [empty, empty, empty, empty, empty]
        let numberOfFilled = 0
        let numberOfHalves = 0

        for (let r of [0, 1, 2, 3, 4, 5]) {
            if (rating === r) {
                numberOfFilled = r
                
                break
            } else if (rating < r) {
                numberOfFilled += (r - 1)
                numberOfHalves = (rating - (r - 1)) >= 0.5 ? numberOfHalves + 1 : numberOfHalves
                
                break
            }
        }

        if (numberOfFilled !== 0) {
            stars = stars.fill(filled, 0, numberOfFilled)
        }

        if (numberOfHalves === 1) {
            const firstEmpty = stars.findIndex((element) => element === empty)
            stars[firstEmpty] = half
        }

        return stars
    }

    const updateUserBookCollections = async () => {
        for (const col of bookCollectionsStore.bookCollections) {
            const index = bookCollectionsModel.value.findIndex((c) => c.id === col.id)

            if (index != -1) {

                if (!col.books.includes(book.value.id)) {
                    await bookCollectionsStore.addBook(col.id, book.value.id)
                    bookCollectionsModel.value[index] = col
                }
                
            } else if (col.books.includes(book.value.id)) {
                await bookCollectionsStore.removeBook(col.id, book.value.id)
            } 
        }
        
        isSelectInputChanged.value = false
    }

    const updateBookNoteFields = async () => {
        bookNotesStore.currentBookNote.fields.push(...fields.map(
            (field) => {
                const name = field.name ? field.name : "Poznámka"
                return { name: name, value: field.value }
            })
        )
        updateCopyFields()

        fields.length = 0
        isAddingFields.value = false

        await bookNotesStore.updateBookNote(bookNotesStore.currentBookNote)
    }

    onMounted(async () => {
        const foundBook = await bookStore.getBookById(props.id)

        if (foundBook) {
            book.value = {...foundBook}

            if (authStore.isUserLoggedIn && authStore.user.id) {
                await bookCollectionsStore.getBookCollections(authStore.user.id)

                bookCollectionsModel.value.push(...bookCollectionsStore.bookCollections.filter(
                        (col) => col.books.includes(book.value.id )
                    )
                )

                await bookNotesStore.getBookNote(props.id, authStore.user.id)

                updateCopyFields()
            }

        } else {
            router.push({ name: "page_not_found" })
        }

    })

</script>

<style scoped>  
    h2 {
        font-size: 1.17em;
    }
    
    h3 {
        margin: 0.5em 0;
    }

    label {
        vertical-align: top;
        line-height: 2;
        margin-bottom: 1em;
    }

    input {
        vertical-align: top;
        margin-bottom: 1em;
    }

    ul,
    .desc-section,
    .notes-section {
        margin-bottom: 1em;
    }

    .fields-overflow-wrapper {
        height: 435px;
        overflow-y: auto;
    }

    .section-wrapper {
        display: flex;
        flex-direction: column;
        padding: 0 1em 1em 1em;
    }

    .intro-section {
        background-color: #F4F3EC;
        padding: 1em;
    }

    .intro-section::after {
        content: "";
        display: block;
        clear: both;
    }

    .book-image-wrapper {
        float: left;
        padding: 1em;
        margin-right: 1em;
    }

    .book-image-wrapper img {
        width: 100%;
        height: 200px;
        object-fit: contain;
    }

    .img-star {
        width: 18px;
        margin-right: 0.3em;
    }

    .book-title {
        color: #696969;
        padding-bottom: 0.2em;
    }

    .rating-wrapper {
        display: inline-block;
    }

    .rating-count {
        margin-left: 0.3em;
        position: relative;
        bottom: 0.15em;
    }

    .download-links {
        margin-top: 2em;
    }

    .desc-section ul {
        list-style-type: none;
    }

    .desc-section ul li { 
        overflow-wrap: break-word;
    }
    
    .desc-section ul li strong {
        display: inline-block;
        width: 100px;
        margin-right: 3em;
    }

    .basic-textfield, 
    .note-textarea, 
    .fab-add-wrapper, 
    .action-buttons,
    .collections-select {
        width: 80%; 
    }

    .basic-textfield {
        background: #FFFFFF;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
    }

    .note-textarea {
        display: block;
        padding-top: 3.75px;
        padding-left: 0.5em;
        background: #FFFFFF;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
    }

    .field-value-char-counter {
        display: inline-block;
        width: 4.5em;
        margin-top: 0.5em;
        margin-left: 58%;
        text-align: right;
    }

    .fields-wrapper {
        margin-bottom: 2.5em;
    }
    
    .fab-add-wrapper {
        display: inline-block;
        margin: 1em 0;
    }

    .action-buttons {
        display: flex;
    }

    .desc-section .action-buttons {
        justify-content: flex-end;
    }

    @media screen and (min-width: 500px) {
        h2 {
            font-size: 1.5em;
        }

        .basic-textfield {
            width: 20.5em;
        }

        .field-value-char-counter {
            margin-left: 54%;
        }

        .note-textarea,
        .collections-select,
        .action-buttons {
            width: 70%;
        }

        .book-image-wrapper {
            margin-right: 3em;
        }
    }

    @media screen and (min-width: 800px) {
        .book-image-wrapper {
            padding-left: 10em;
        }

        .desc-section h3:nth-of-type(2) {
            margin-bottom: 1em;
        }
        .section-wrapper {
            justify-content: space-between;
            flex-direction: row;
        }

        .notes-section {
            margin-left: 7em;
            flex: 2;
        }

        .basic-textfield {
            width: 14em;
        }

        .field-value-char-counter {
            margin-left: 58%;
        }
        
        .note-textarea, 
        .action-buttons {
            width: 80%;
        }

        .collections-select {
            width: 20.5em;
        }

        .desc-section .action-buttons {
            width: 100%; 
        }
    }

    @media screen and (min-width: 960px) {
        .section-wrapper {
            padding-left: 8em;
        }

        .basic-textfield {
            width: 15em;
        }

        .note-textarea, 
        .notes-section .action-buttons {
            width: 80%;
        }
    }

    @media screen and (min-width: 1150px) {
        .field-value-char-counter {
            margin-left: 46%;
        }

        .note-textarea,
        .notes-section .action-buttons {
            width: 60%;
        }
    }
</style>  