<template>
    <form action="#" @submit.prevent="onSubmit">
        <div class="textfield-wrapper">
            <label for="email">Email</label>
            <input id="email" class="basic-textfield" type="email" required v-model="formState.email">
        </div>

        <div class="textfield-wrapper">
            <label for="password">
                Heslo<input id="password" class="basic-textfield" type="password" required v-model="formState.password">
            </label>
            <div class="default-link supporting-text" v-if="authType.buttonLabel === 'Přihlásit se'">
                <router-link :to="{ name: 'password_reset' }">Zapomněl/a jste heslo?</router-link>
            </div>
        </div>
        
        <div class="textfield-wrapper" v-if="authType.buttonLabel === 'Zaregistrovat se'">
            <label for="repeatPassword">Heslo</label>
            <input id="repeatPassword" class="basic-textfield" type="password" required v-model="formState.repeatPassword">
            <div class="small-supporting-text">(zopakovat)</div>
        </div>

        <div class="submit-wrapper">
            <button type="submit">{{ authType.buttonLabel }}</button>
            <div class="default-link supporting-text" @click="toggleButtonLabel">{{ authType.supportiveText }}</div>
        </div>

        <div class="error-message" v-if="authStore.errorMessage">{{ authStore.errorMessage }}</div>
    </form>
</template>

<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth'
    import { reactive } from 'vue'

    const authStore = useAuthStore()
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
            authStore.loginUser(formState.email, formState.password)
        } else if (authType.buttonLabel === "Zaregistrovat se") {
            register()
        }
    }

    const register = () => {
        if (formState.password === formState.repeatPassword) {
            authStore.registerUser(formState.email, formState.password)
        } else {
            authStore.errorMessage = "Hesla musí být stejná"
        }
    }

    const toggleButtonLabel = () => {
        if (authType.buttonLabel === "Přihlásit se") {
            authType.buttonLabel = "Zaregistrovat se"
            authType.supportiveText = "Máte účet? Přihlaste se"
        } else if (authType.buttonLabel === "Zaregistrovat se") {
            authType.buttonLabel = "Přihlásit se"
            authType.supportiveText = "Nemáte účet? Zaregistrujte se"
        }

        if (authStore.errorMessage !== "") authStore.errorMessage = ""
    }
</script>

<style scoped>
    form {
        margin: 2em 1em 2em 1em;
    }

    label {
        font-weight: 400;
        color: #000000;
    }

    input {
        margin-left: 2em;
        padding: 0.3em;
    }
    .basic-textfield {
        background: #FFFFFF;
        width: 14em;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
    }

    .textfield-wrapper {
        margin-bottom: 1.5em;
    }

    .textfield-wrapper:nth-child(2) .supporting-text {
        margin-left: 5.1em;
    }
    
    .small-supporting-text {
        width: 10em;
        font-size: 0.8em;
        margin-bottom: -1em;
    }

    .supporting-text {
        font-size: 0.9em;
        cursor: pointer;
        margin-top: 0.4em;
    }

    .supporting-text:hover {
        color: #E4573D;
        transition: 0.3;
    }

    button[type="submit"] {
        color: white;
        background: #E4573D;
        font-weight: bold;
        width: 14em;
        height: 2em;
        padding: 0.3em 0;
        border-radius: 4px;
        margin-left: 4.55em;
        margin-top: 0.5em;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }

    button[type="submit"]:hover {
        background: #953726;
    }

    .submit-wrapper .supporting-text {
        text-align: center;
        width: 16.3em;
        margin-left: 4.7em;
    }

    @media screen and (min-width: 960px) {
        .basic-textfield, 
        button[type="submit"] {
            width: 18em;
        }

        .submit-wrapper .supporting-text {
            margin-left: 7.2em;
        }
    }

    @media screen and (max-width: 1150px) {
        form {
            margin-right: 2em;
        }
    }
</style>