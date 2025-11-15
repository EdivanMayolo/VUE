import { api } from 'src/boot/axios'

export const MoradorService = {
  async list () {
    const { data } = await api.get('/morador')
    return data
  },
}