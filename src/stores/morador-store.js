// src/stores/morador-store.js
import { defineStore } from 'pinia'
import { MoradorService } from 'src/services/morador'

export const useMoradorStore = defineStore('morador', {
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
        this.lista = await MoradorService.list()
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao carregar moradores'
      } finally {
        this.loading = false
      }
    },

    async criar (payload) {
      try {
        this.loading = true
        this.erro = null
        const novo = await MoradorService.create(payload)
        this.lista.push(novo)
        return novo
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao criar morador'
        throw err
      } finally {
        this.loading = false
      }
    },

    async atualizar (id, payload) {
      try {
        this.loading = true
        this.erro = null
        const atualizado = await MoradorService.update(id, payload)
        const idx = this.lista.findIndex(m => m.id === id)
        if (idx !== -1) this.lista[idx] = atualizado
        return atualizado
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao atualizar morador'
        throw err
      } finally {
        this.loading = false
      }
    },

    async remover (id) {
      try {
        this.loading = true
        this.erro = null
        await MoradorService.remove(id)
        this.lista = this.lista.filter(m => m.id !== id)
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao remover morador'
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
