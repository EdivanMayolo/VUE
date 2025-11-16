// src/services/fatura.js
import { api } from 'src/boot/axios'

export const FaturaService = {
  async list () {
    // se no db.json for "faturas"
    const { data } = await api.get('/fatura')
    // se ainda estiver "Fatura", troque para: await api.get('/Fatura')
    return data
  },

  async getById (id) {
    const { data } = await api.get(`/fatura/${id}`)
    return data
  },

  async create (payload) {
    const { data } = await api.post('/fatura', payload)
    return data
  },

  async update (id, payload) {
    const { data } = await api.put(`/fatura/${id}`, payload)
    return data
  },

  async remove (id) {
    await api.delete(`/fatura/${id}`)
  }
}
