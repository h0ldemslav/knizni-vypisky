<template>
    <section v-if="book">

        <section class="intro-section">
            <img v-if="book.image" :src="book.image?.smallThumbnail" :alt="book.title"/>
            <img v-else src="https://cdn-icons-png.flaticon.com/512/207/207114.png" alt="Obrázek knihy nenalezen"/>
            
            <h3>{{ book.title }}</h3>
            <p class="book-title"><strong>{{ getListOfAuthors() }}</strong></p>

            <div v-if="book.rating" class="rating-wrapper">
                <img v-for="src in getRatingStars(book.rating.average)" :src="src" alt="" class="img-star">
                <span class="rating-count">{{ book.rating.count }}</span>
            </div>

            <div class="download-links">
                <a v-if="book.pdfLink" :href="book.pdfLink">
                    <img class="small-svg-icon" src="../../assets/pdf_link_icon.svg" alt="Odkaz na PDF soubor">
                </a>
                <a v-if="book.epubLink" :href="book.epubLink">
                    <img class="small-svg-icon" src="../../assets/epub_link_icon.svg" alt="Odkaz na EPUB">
                </a>
            </div>
        </section>

        <section class="desc-section">
            <h3>Informace o knize</h3>
            <ul>
                <li><strong>{{ book.isbn[0].type }}</strong> <span class="spacer">{{ book.isbn[0].value }}</span></li>
                <li><strong>{{ book.isbn[1].type }}</strong> <span class="spacer">{{ book.isbn[1].value }}</span></li>
                <li><strong>Vydavatel</strong> {{ book.publisher }}</li>
                <li><strong>Vydáno</strong> <span class="spacer"></span>{{ book.publishedDate ? book.publishedDate : "-" }}</li>
                <li><strong>Počet stran</strong> {{ book.pageCount ? book.pageCount : "-" }}</li>
                <li><strong>Jazyk</strong> {{ getFullLanguageName(book.language) }}</li>
            </ul>
        </section>

        <section class="collections-section" v-if="authStore.isUserLoggedIn">
            <h2>Kolekce</h2>

            <v-select
                clearable
                v-model="bookCollectionsModel"
                :items="bookCollectionsStore.bookCollections"
                item-title="title"
                item-value="id"
                label="Kolekce"
                return-object
                multiple
                @update:modelValue="isSelectInputChanged = true"
            ></v-select>

            <v-btn 
                v-if="isSelectInputChanged"
                @click="updateUserBookCollections"
                prepend-icon="mdi-content-save" 
                color="green">
                <template v-slot:prepend >
                    <v-icon color="white" class="pb-1"></v-icon>
                </template>
                Uložit
            </v-btn>
        </section>

        <section class="notes-section" v-if="authStore.isUserLoggedIn">
            <h2>Mé poznámky</h2>

            <form action="#" @submit.prevent="updateBookNoteFields">
                <div v-for="(field, index) in bookNotesStore.currentBookNote.fields">
                    <label><strong>{{ field.name }}</strong></label>
                    <input type="text" v-model="field.value" class="basic-textfield" :readonly="!isAddingFields">
                    <v-icon icon="mdi-delete" v-if="isAddingFields" @click="removeField(index)"></v-icon>
                </div>

                <div v-for="field in fields">
                    <input type="text" v-model="field.name" placeholder="Počet stran" class="basic-textfield">
                    <input type="text" v-model="field.value" placeholder="210" class="basic-textfield">
                </div>
                
                <div v-if="isAddingFields">
                    <v-btn @click="addNewField" icon="mdi-plus" color="green">                
                        <template v-slot:prepend>
                            <v-icon color="white" class="pb-1"></v-icon>
                        </template>
                    </v-btn>
                </div>

                
                <button v-if="!isAddingFields" @click="isAddingFields = true">Editovat</button>
                <button v-if="isAddingFields" @click="clearNewFields">Zrušit  </button>
                <button v-if="isAddingFields" type="submit">Uložit</button>
            </form>
        </section>

    </section>

</template>

<script lang="ts" setup>
    import { useBooksStore } from '@/stores/books'
    import { onMounted, ref, reactive } from 'vue'
    import { Book } from '@/model/Book'
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
    const isAddingFields = ref(false)

    const addNewField = () => fields.push({ name: "", value: ""})
    
    const clearNewFields = () => {
        fields.length = 0
        isAddingFields.value = false
    }

    const removeField = (index: number) => {
        bookNotesStore.currentBookNote.fields.splice(index, 1)
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
        bookNotesStore.currentBookNote.fields.push(...fields.filter(
            (field) => field.name.length > 0 && field.value.length > 0)
        )
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
            }

        } else {
            router.push({ name: "page_not_found" })
        }

    })

</script>

<style scoped>
    /* Not yet finished */
    
    .intro-section,
    .desc-section,
    .notes-section,
    .collections-section {
        padding: 1em;
    }
    .intro-section {
        background-color: #F4F3EC;
    }

    .intro-section::after {
        content: "";
        display: block;
        clear: both;
    }

    .intro-section > img {
        float: left;
        margin-right: 1em;
        object-fit: contain;
    }

    .desc-section {
        clear: both;
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

    ul li strong {
        display: inline-block;
        width: 100px;
        margin-left: 0.5em;
        margin-right: 3em;
    }

    input {
        margin-right: 2em;
        padding: 0.3em;
    }
    .basic-textfield {
        background: #FFFFFF;
        width: 10em;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
    }

    label {
        margin-right: 2em;
    }

    .notes-section form div {
        margin-bottom: 1em;
    }
</style>  