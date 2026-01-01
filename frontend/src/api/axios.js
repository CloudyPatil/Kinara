import axios from 'axios';

// 1. Determine the Base URL dynamically
// If the environment variable exists (on Vercel), use it.
// Otherwise, fall back to localhost (for your computer).
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// 2. Create the instance
const api = axios.create({
    baseURL: `${BASE_URL}/api/v1`, // We append /api/v1 here automatically
    headers: {
        'Content-Type': 'application/json',
    },
});

// 3. Add the "Interceptor"
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;