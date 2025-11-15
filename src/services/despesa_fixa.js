// src/services/despesa-fixa.js
import { api } from 'src/boot/axios'

export const DespesaFixaService = {
  async list () {
    const { data } = await api.get('/despesa_fixa')
    return data
  },

  async getById (id) {
    const { data } = await api.get(`/despesa_fixa/${id}`)
    return data
  },

  async create (payload) {
    const { data } = await api.post('/despesa_fixa', payload)
    return data
  },

  async update (id, payload) {
    const { data } = await api.put(`/despesa_fixa/${id}`, payload)
    return data
  },

  async remove (id) {
    await api.delete(`/despesa_fixa/${id}`)
  }
}
