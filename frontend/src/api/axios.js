import axios from 'axios';

// 1. Create the instance
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1', // Points to FastAPI
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Add the "Interceptor"
// Before every request, check if we have a token in LocalStorage.
// If yes, attach it to the header.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;