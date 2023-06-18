<template>
    <section>
        <h2>Obnova hesla</h2>
        <p>Níže zadejte svůj e-mail a my vám pošleme odkaz pro obnovu vašeho hesla.</p>

        <form action="#" @submit.prevent="sendPasswordResetLink">
            <div class="textfield-wrapper">
                <input
                    v-model="userEmail" 
                    type="email" 
                    placeholder="example@example.com" 
                    required
                    class="basic-textfield" 
                >
            </div>
            <div>
                <v-btn 
                    type="submit" 
                    :loading="sendButtonLoading"
                    :disabled="userEmail.length === 0"
                    :style="userEmail.length === 0 ? 'border: 0.1px solid black;' : 'border-width: 0;'"
                >
                    Odeslat
                </v-btn>
            </div>
        </form>

        <div v-if="errorMessage.length > 0" class="error-message">
            {{ errorMessage }}

            <a v-if="errorMessage === errorMessageWildcard" href="mailto:knizni.vypisky.help@gmail.com" class="default-link">
                knizni.vypisky.help@gmail.com
            </a>
        </div>

        <v-container>
            <v-snackbar :model-value="isVisibleSnackbar" timeout="-1" color="grey-lighten-4">
                {{ successMessage }}

                <template v-slot:actions>
                    <v-btn
                        color="#E4573D"
                        variant="text"
                        @click="returnBack"
                    >
                        Zpět k přihlášení
                    </v-btn>
                </template>
            </v-snackbar>
        </v-container>

    </section>

</template>

<script lang="ts" setup>
    import { auth } from '@/main'
    import { ref } from 'vue'
    import { sendPasswordResetEmail } from 'firebase/auth'
    import router from '..'
    
    const userEmail = ref("")
    const sendButtonLoading = ref(false)
    const isVisibleSnackbar = ref(false)
    const successMessage = ref("")
    const errorMessage = ref("")
    const errorMessageWildcard = "Neznámá chyba, prosím vás, pošlete nám email na adresu"

    const sendPasswordResetLink = () => {
        errorMessage.value = ""
        sendButtonLoading.value = true

        sendPasswordResetEmail(auth, userEmail.value)
            .then(() => {
                successMessage.value = `Odkaz na adresu ${userEmail.value} byl úspěšně odeslán.`
                isVisibleSnackbar.value = true
            })

            .catch((error) => {
                if (error.code === "auth/user-not-found") {
                    errorMessage.value = "Špatně zadaný email."
                } else {
                    errorMessage.value = errorMessageWildcard
                }
            })

            .finally(() => {
                sendButtonLoading.value = false
            })
    }

    const returnBack = () => {
        isVisibleSnackbar.value = false

        router.push({ name: "auth" })
    }
</script>

<style scoped>
    section {
        padding: 1em;
    }

    form {
        margin: 1em 0;
    }

    input {
        padding: 0.3em;
    }

    .textfield-wrapper {
        margin-bottom: 1.5em;
    }

    .basic-textfield {
        background: #FFFFFF;
        width: 14em;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
    }

    .default-link:hover {
        color: blue;
    }

    .error-message {
        font-size: 0.9em;
    }

    @media screen and (min-width: 500px) {
        .error-message {
            width: 30em;
        }
    }
</style>