// src/stores/despesa-fixa.store.js
import { defineStore } from 'pinia'
import { DespesaFixaService } from 'src/services/despesa_fixa'

export const useDespesaFixaStore = defineStore('despesaFixa', {
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
        this.lista = await DespesaFixaService.list()
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao carregar despesas fixas'
      } finally {
        this.loading = false
      }
    },

    async criar (payload) {
      try {
        this.loading = true
        this.erro = null
        const nova = await DespesaFixaService.create(payload)
        this.lista.push(nova)
        return nova
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao criar despesa fixa'
        throw err
      } finally {
        this.loading = false
      }
    },

    async atualizar (id, payload) {
      try {
        this.loading = true
        this.erro = null
        const atualizada = await DespesaFixaService.update(id, payload)
        const idx = this.lista.findIndex(d => d.id === id)
        if (idx !== -1) this.lista[idx] = atualizada
        return atualizada
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao atualizar despesa fixa'
        throw err
      } finally {
        this.loading = false
      }
    },

    async remover (id) {
      try {
        this.loading = true
        this.erro = null
        await DespesaFixaService.remove(id)
        this.lista = this.lista.filter(d => d.id !== id)
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao remover despesa fixa'
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
