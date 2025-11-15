// src/services/apartamento.js
import { api } from 'src/boot/axios'
// const resource = ''

export const ApartamentoService = {
  async list () {
    const { data } = await api.get('/apartamentos')
    return data
  },

  async getById (id) {
    const { data } = await api.get(`/apartamentos/${id}`)
    return data
  },

  async create (payload) {
    const { data } = await api.post('/apartamentos', payload)
    return data
  },

  async update (id, payload) {
    const { data } = await api.put(`/apartamentos/${id}`, payload)
    return data
  },

  async remove (id) {
    await api.delete(`/apartamentos/${id}`)
  }
}
