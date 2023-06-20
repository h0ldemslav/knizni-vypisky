import {createVuetify, ThemeDefinition} from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // import Vuetify styles
import {VDataTable} from 'vuetify/labs/VDataTable'


const primaryTheme: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#F2F5F7',
        surface: '#FFFFFF',
        primary: '#E4573D',
        secondary: '#F4F3EC',
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
    }
}

export default createVuetify({
    theme: {
        defaultTheme: "primaryTheme",
        themes: {
            primaryTheme
        }
    },
    components: {
        VDataTable
    }
})