<template>
    <form action="#" @submit.prevent="onSubmit">
        <div class="textfield-wrapper">
            <label for="email">Email</label>
            <input id="email" class="basic-textfield" type="email" required v-model="formState.email">
        </div>

        <div class="textfield-wrapper">
            <label for="password">Heslo</label>
            <input id="password" class="basic-textfield" type="password" required v-model="formState.password">
        </div>
        
        <div class="textfield-wrapper" v-if="authType.buttonLabel === 'Zaregistrovat se'">
            <label for="repeatPassword">Heslo</label>
            <input id="repeatPassword" class="basic-textfield" type="password" required v-model="formState.repeatPassword">
            <div class="small-supportive">(zopakovat)</div>
        </div>

        <div class="submit-wrapper">
            <button type="submit">{{ authType.buttonLabel }}</button>
            <span class="supportive" @click="toggleButtonLabel">{{ authType.supportiveText }}</span>
        </div>

        <div class="error-message" v-if="auth.errorMessage">{{ auth.errorMessage }}</div>
    </form>
</template>

<script lang="ts" setup>
    import { authStore } from '../stores/auth'
    import { reactive } from 'vue'

    const auth = authStore()
    const authType = reactive({
        buttonLabel: "Přihlásit se",
        supportiveText: "Nemáte účet? Zaregistrujte se"
    })

    const formState = reactive({
        email: "",
        password: "",
        repeatPassword: ""
    })

    const onSubmit = () => {
        if (authType.buttonLabel === "Přihlásit se") {
            auth.loginUser(formState.email, formState.password)
        } else if (authType.buttonLabel === "Zaregistrovat se") {
            register()
        }
    }

    const register = () => {
        if (formState.password === formState.repeatPassword) {
            auth.registerUser(formState.email, formState.password)
        } else {
            auth.errorMessage = "Hesla musí být stejná"
        }
    }

    const toggleButtonLabel = () => {
        if (authType.buttonLabel === "Přihlásit se") {
            authType.buttonLabel = "Zaregistrovat se"
            authType.supportiveText = "Máte účet? Přihlaste se"
        } else if (authType.buttonLabel === "Zaregistrovat se") {
            authType.buttonLabel = "Přihlásit se"
            authType.supportiveText = "Nemáte účet? Zaregistrujte se"
            
            if (auth.errorMessage !== "") auth.errorMessage = ""
        }
    }
</script>

<style scoped>
    /* TEMPORARY styling */

    label {
        display: inline-block;
        margin-right: 5em;
        font-weight: 400;
        line-height: 31px;
        color: #000000;
    }

    input {
        padding: 0.5em;
    }

    button[type="submit"] {
        color: white;
        background: #E4573D;
        font-weight: bold;
        width: 22em;
        height: 2.5em;
        padding: 0.5em;
        margin: 1em;
        margin-left: 7.5em;
        border-radius: 10px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }

    button[type="submit"]:hover {
        background: #953726;
    }
    .basic-textfield {
        background: #FFFFFF;
        width: 22em;
        height: 2.5em;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
    }

    .textfield-wrapper {
        margin-bottom: 1em;
    }

    .supportive {
        color: blue;
        text-decoration: underline;
        cursor: pointer;
    }

    .supportive:hover {
        text-decoration: none;
    }

    .small-supportive {
        width: 10em;
        font-size: 0.8em;
        margin: 0;
    }

    .submit-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>