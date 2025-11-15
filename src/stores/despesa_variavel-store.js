// src/stores/despesa-variavel-store.js
import { defineStore } from 'pinia'
import { DespesaVariavelService } from 'src/services/despesa_variavel'

export const useDespesaVariavelStore = defineStore('despesaVariavel', {
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
        this.lista = await DespesaVariavelService.list()
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao carregar despesas variáveis'
      } finally {
        this.loading = false
      }
    },

    async criar (payload) {
      try {
        this.loading = true
        this.erro = null
        const nova = await DespesaVariavelService.create(payload)
        this.lista.push(nova)
        return nova
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao criar despesa variável'
        throw err
      } finally {
        this.loading = false
      }
    },

    async atualizar (id, payload) {
      try {
        this.loading = true
        this.erro = null
        const atualizada = await DespesaVariavelService.update(id, payload)
        const idx = this.lista.findIndex(d => d.id === id)
        if (idx !== -1) this.lista[idx] = atualizada
        return atualizada
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao atualizar despesa variável'
        throw err
      } finally {
        this.loading = false
      }
    },

    async remover (id) {
      try {
        this.loading = true
        this.erro = null
        await DespesaVariavelService.remove(id)
        this.lista = this.lista.filter(d => d.id !== id)
      } catch (err) {
        console.error(err)
        this.erro = err.message || 'Erro ao remover despesa variável'
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
