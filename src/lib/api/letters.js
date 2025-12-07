import api from '../api.js'

export const lettersAPI = {
  // Get all letters for current user
  getAll: async () => {
    const response = await api.get('/letters')
    return response.data
  },

  // Get a single letter
  getById: async (id) => {
    const response = await api.get(`/letters/${id}`)
    return response.data
  },

  // Create a new letter
  create: async (title, content, deliveryDate) => {
    const response = await api.post('/letters', {
      title,
      content,
      deliveryDate
    })
    return response.data
  },

  // Update a letter
  update: async (id, title, content, deliveryDate) => {
    const response = await api.put(`/letters/${id}`, {
      title,
      content,
      deliveryDate
    })
    return response.data
  },

  // Delete a letter
  delete: async (id) => {
    const response = await api.delete(`/letters/${id}`)
    return response.data
  }
}

