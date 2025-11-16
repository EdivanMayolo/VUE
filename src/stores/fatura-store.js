// src/stores/fatura-store.js
import { defineStore } from 'pinia'
import { FaturaService } from 'src/services/fatura'

export const useFaturaStore = defineStore('fatura', {
  state: () => ({
    lista: [],
    loading: false,
    erro: null
  }),

  actions: {
    async carregarTodos () {
      try {
        this.loading = true
        this.erro = null
        this.lista = await FaturaService.list()
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao carregar faturas'
      } finally {
        this.loading = false
      }
    },

    async criar (payload) {
      try {
        this.loading = true
        this.erro = null
        const nova = await FaturaService.create(payload)
        this.lista.push(nova)
        return nova
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao criar fatura'
        throw err
      } finally {
        this.loading = false
      }
    },

    async atualizar (id, payload) {
      try {
        this.loading = true
        this.erro = null
        const atualizada = await FaturaService.update(id, payload)
        const idx = this.lista.findIndex(f => f.id === id)
        if (idx !== -1) this.lista[idx] = atualizada
        return atualizada
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao atualizar fatura'
        throw err
      } finally {
        this.loading = false
      }
    },

    async remover (id) {
      try {
        this.loading = true
        this.erro = null
        await FaturaService.remove(id)
        this.lista = this.lista.filter(f => f.id !== id)
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao remover fatura'
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
