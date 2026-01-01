import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  // Ensure cookies (including httpOnly session cookies) are sent with requests
  withCredentials: true,
});

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  (config) => {
    // Prefer tokens delivered via cookies instead of localStorage for security.
    // Accessing cookies is only possible in the browser environment.
    const getTokenFromCookies = () => {
      if (typeof document === 'undefined') return null;
      const match = document.cookie.match(/(?:^|; )accessToken=([^;]+)/) || document.cookie.match(/(?:^|; )token=([^;]+)/);
      return match ? decodeURIComponent(match[1]) : null;
    };

    let token = getTokenFromCookies();
    
    // Fallback to localStorage if no cookie token found (fixes 404/401 on reload)
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    }
    if (token) {
      config.headers = config.headers || {};
      // Use Authorization header when a token is available
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      // Try to clear non-httpOnly cookies (if present). If your backend
      // issues httpOnly cookies we cannot clear them from JS and the
      // backend should handle invalidation.
      if (typeof document !== 'undefined') {
        document.cookie = 'token=; Max-Age=0; path=/';
        document.cookie = 'accessToken=; Max-Age=0; path=/';
      }

      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
