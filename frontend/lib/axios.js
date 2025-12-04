// lib/axios.js - Axios instance for frontend
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - Add token to every request
instance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Request:', config.method.toUpperCase(), config.url);
      if (config.headers.Authorization) {
        console.log('🔑 Token present:', config.headers.Authorization.substring(0, 20) + '...');
      } else {
        console.warn('⚠️ No token in request');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
instance.interceptors.response.use(
  (response) => {
    // Log successful response
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Response:', response.config.url, response.status);
    }
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle specific error cases
      if (status === 401) {
        console.error('🚫 Unauthorized - Token may be invalid or expired');
        
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login (adjust path as needed)
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      } else if (status === 403) {
        console.error('🚫 Forbidden - Insufficient permissions');
        alert('You do not have permission to perform this action');
      } else if (status === 404) {
        console.error('🔍 Not found:', error.config.url);
      } else if (status === 500) {
        console.error('💥 Server error:', data.error || data.message);
        alert('Server error. Please try again later.');
      }
      
      // Log error details
      console.error('Error details:', {
        url: error.config.url,
        method: error.config.method,
        status,
        message: data.error || data.message,
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('📡 No response from server');
      alert('Cannot connect to server. Please check your connection.');
    } else {
      // Something else happened
      console.error('⚠️ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance;