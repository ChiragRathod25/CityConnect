const config = {
    baseUrl:String(import.meta.env.VITE_BASE_FRONTEND_URL),
    apiURL:String(import.meta.env.VITE_API_BACKEND_URL),
    nodeEnvironment:String(import.meta.env.NODE_ENV),
};
export default config;