export default class Config {
    static booksApiUrl = import.meta.env.VITE_BOOKS_API_URL;
    static booksApiKey = import.meta.env.VITE_BOOKS_API_KEY;

    static fbApiKey = import.meta.env.VITE_FB_API_KEY;
    static fbAuthDomain = import.meta.env.VITE_FB_AUTH_DOMAIN;
    static fbProjectID = import.meta.env.VITE_FB_PROJECT_ID;
    static fbStorageBucket = import.meta.env.VITE_FB_STORAGE_BUCKET;
    static fbMessagingSenderID = import.meta.env.VITE_FB_MESSAGING_SENDER_ID;
    static fbAppID = import.meta.env.VITE_FB_APP_ID;

    static publicPath =  process.env.NODE_ENV === "production" ? "/~xastapen/" : "/"
}