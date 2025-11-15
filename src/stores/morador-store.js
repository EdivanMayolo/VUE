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
        this.erro = err.message || 'Erro ao carregar apartamentos'
      } finally {
        this.loading = false
      }
    },
  }
});