import axios from 'axios';
import { LoginCredentials } from '../types/auth';

const API_URL = 'https://api.example.com'; // Replace with your API URL

// For demo purposes, we'll mock the API calls
export const loginApi = async (credentials: LoginCredentials) => {
  // In a real app, this would be an actual API call
  // return axios.post(`${API_URL}/auth/login`, credentials);
  
  // For demo, we'll simulate a successful login if credentials match
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
        resolve({
          data: {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
          },
        });
      } else {
        reject({
          response: {
            data: {
              message: 'Invalid email or password',
            },
          },
        });
      }
    }, 800); // Simulate network delay
  });
};

export const checkAuthApi = async () => {
  // In a real app, this would be an actual API call to validate the token
  // return axios.get(`${API_URL}/auth/me`, {
  //   headers: {
  //     Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  //   },
  // });
  
  // For demo, we'll simulate a successful auth check if token exists
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        resolve({
          data: {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
          },
        });
      } else {
        resolve({ data: null });
      }
    }, 500);
  });
};

export const logoutApi = async () => {
  // In a real app, this would be an actual API call
  // return axios.post(`${API_URL}/auth/logout`, {}, {
  //   headers: {
  //     Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  //   },
  // });
  
  // For demo, we'll simulate a successful logout
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { success: true } });
    }, 300);
  });
};