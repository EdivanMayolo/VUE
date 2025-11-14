// src/stores/apartamento-store.js
import { defineStore } from 'pinia'
import { ApartamentoService } from 'src/services/apartamento'

export const useApartamentoStore = defineStore('apartamento', {
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
        this.lista = await ApartamentoService.list()
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao carregar apartamentos'
      } finally {
        this.loading = false
      }
    },

    async criar (payload) {
      try {
        this.loading = true
        this.erro = null
        const novo = await ApartamentoService.create(payload)
        this.lista.push(novo)
        return novo
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao criar apartamento'
        throw err
      } finally {
        this.loading = false
      }
    },

    async atualizar (id, payload) {
      try {
        this.loading = true
        this.erro = null
        const atualizado = await ApartamentoService.update(id, payload)
        const idx = this.lista.findIndex(a => a.id === id)
        if (idx !== -1) this.lista[idx] = atualizado
        return atualizado
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao atualizar apartamento'
        throw err
      } finally {
        this.loading = false
      }
    },

    async remover (id) {
      try {
        this.loading = true
        this.erro = null
        await ApartamentoService.remove(id)
        this.lista = this.lista.filter(a => a.id !== id)
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao remover apartamento'
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
