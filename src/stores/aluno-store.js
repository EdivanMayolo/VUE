import { defineStore, acceptHMRUpdate } from 'pinia'
import AlunoService from 'src/services/aluno'

export const useAlunoStore = defineStore('aluno', {
  state: () => ({
    alunos: [],
  }),

  actions: {
    async getAlunos() {
      console.log('Ação getAlunos chamada dentro do PINIA');
      this.alunos = await AlunoService.getAlunos();
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAlunoStore, import.meta.hot))
}
