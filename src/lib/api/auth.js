import api from '../api.js'

export const authAPI = {
  // Register a new user
  register: async (email, password, name) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      name
    })
    return response.data
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    })
    return response.data
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/users/me')
    return response.data
  }
}

