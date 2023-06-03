<template>
    <div class="auth-form-wrapper bg-secondary">
        <img class="placeholder-image" src="../../assets/auth_image_placeholder.png" alt="">
        <div class="vertical-bar"></div>
        <AuthForm />
    </div>
    <Footer></Footer>
</template>

<script lang="ts" setup>
    import AuthForm from '@/components/AuthForm.vue'
    import Footer from '@/components/Footer.vue'
</script>

<style scoped>
    .auth-form-wrapper {
        padding: 1em 0;
    }

    .placeholder-image {
        width: 45%;
        object-fit: contain;
        display: none;
    }

    .vertical-bar {
        border: 1px solid grey;
        opacity: 0.5;
        margin-left: 1em;
        display: none;
    }

    @media screen and (min-width: 700px) {
        .placeholder-image {
            display: block;
        }

        .auth-form-wrapper {
            display: flex;
            justify-content: space-between;
            padding-left: 1em;
            padding-right: 1em;
        }

        .vertical-bar {
            display: block;
        }
    }

    @media screen and (min-width: 960px) {
        .auth-form-wrapper {
            padding-left: 1em;
            padding-right: 2em;
        }

        .placeholder-image {
            width: 450px;
        }
    }

    @media screen and (min-width: 1100px) {
        .auth-form-wrapper {
            padding-inline: 4em;
        }
    }

    @media screen and (min-width: 1280px) {
        .auth-form-wrapper {
            padding-right: 13em;
        }
    }
</style>