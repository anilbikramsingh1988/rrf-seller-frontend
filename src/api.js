import axios from 'axios';

// Create a configured Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // 🔴 CHANGE THIS to your backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically add the authorization token
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    if (token) {
      // If a token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
