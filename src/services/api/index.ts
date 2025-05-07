import { BASE_URL } from '@constants/index'
import axios from 'axios'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

// Optional: add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') // or use any other auth logic
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 426) {
      // Handle upgrade required error
      console.error('Connection upgrade required:', error)
      // You might want to show a user-friendly message here
    }
    return Promise.reject(error)
  }
)

export default api
