// src/services/despesa-variavel.js
import { api } from 'src/boot/axios'

export const DespesaVariavelService = {
  async list () {
    // Se NO db.json você deixou "despesa_variavel":
    const { data } = await api.get('/despesa_variavel')

    // Se manteve "Despesa_Variavel", troque para:
    // const { data } = await api.get('/Despesa_Variavel')

    return data
  },

  async getById (id) {
    const { data } = await api.get(`/despesa_variavel/${id}`)
    // ou `/Despesa_Variavel/${id}` se não padronizar
    return data
  },

  async create (payload) {
    const { data } = await api.post('/despesa_variavel', payload)
    return data
  },

  async update (id, payload) {
    const { data } = await api.put(`/despesa_variavel/${id}`, payload)
    return data
  },

  async remove (id) {
    await api.delete(`/despesa_variavel/${id}`)
  }
}
