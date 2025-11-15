// src/services/morador.js
import { api } from 'src/boot/axios'

export const MoradorService = {
  async list () {
    const { data } = await api.get('/morador')
    return data
  },

  async getById (id) {
    const { data } = await api.get(`/morador/${id}`)
    return data
  },

  async create (payload) {
    const { data } = await api.post('/morador', payload)
    return data
  },

  async update (id, payload) {
    const { data } = await api.put(`/morador/${id}`, payload)
    return data
  },

  async remove (id) {
    await api.delete(`/morador/${id}`)
  }
}
