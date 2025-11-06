// import { defineBoot } from '#q-app/wrappers'
// import axios from 'axios'

// // Be careful when using SSR for cross-request state pollution
// // due to creating a Singleton instance here;
// // If any client changes this (global) instance, it might be a
// // good idea to move this instance creation inside of the
// // "export default () => {}" function below (which runs individually
// // for each client)
// const api = axios.create({ baseURL: 'https://api.example.com' })

// export default defineBoot(({ app }) => {
//   // for use inside Vue files (Options API) through this.$axios and this.$api

//   app.config.globalProperties.$axios = axios
//   // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
//   //       so you won't necessarily have to import axios in each vue file

//   app.config.globalProperties.$api = api
//   // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
//   //       so you can easily perform requests against your app's API
// })

// export { api }

import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Aqui você define a URL base da sua API
const api = axios.create({
  baseURL: 'http://localhost:9001/login' // troque pelo endereço da sua API
})

// (opcional) Interceptor para incluir token de login nas requisições
// Isso é útil quando o usuário loga e você guarda o token no localStorage.
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default boot(({ app }) => {
  // Deixa o Axios disponível globalmente
  app.config.globalProperties.$axios = axios // Instância original
  app.config.globalProperties.$api = api     // Instância com baseURL
})

export { api, axios }
