import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
}

export const carsAPI = {
  list: (params) => api.get('/cars', { params }),
  get: (id) => api.get(`/cars/${id}`),
  create: (data) => api.post('/cars', data),
  update: (id, data) => api.put(`/cars/${id}`, data),
  delete: (id) => api.delete(`/cars/${id}`),
  uploadImages: (id, formData) =>
    api.post(`/cars/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export const usersAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  getMyCars: () => api.get('/users/me/cars'),
  getFavorites: () => api.get('/users/me/favorites'),
  addFavorite: (carId) => api.post(`/users/me/favorites/${carId}`),
  removeFavorite: (carId) => api.delete(`/users/me/favorites/${carId}`),
}

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  makeAdmin: (email) => api.put('/admin/users/make-admin', null, { params: { email } }),
  removeAdmin: (userId) => api.put(`/admin/users/${userId}/remove-admin`),
  getCars: (params) => api.get('/admin/cars', { params }),
  deleteCar: (id) => api.delete(`/admin/cars/${id}`),
}

export default api
