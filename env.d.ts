/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_BOOKS_API_KEY: string;
    VITE_BOOKS_API_URL: string;
}

interface ImportMeta {
    env: ImportMetaEnv;
}
