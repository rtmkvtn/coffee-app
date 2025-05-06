import { BASE_URL } from '@constants/index'
import axios from 'axios'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') // or use any other auth logic
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
