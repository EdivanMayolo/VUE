<!-- <template>
  <router-view />
</template>

<script setup>
//
</script> -->
<template>
  <!-- Rotas de autenticação (sem layout) -->
  <router-view v-if="isAuthRoute" key="auth" />

  <!-- Demais rotas com layout -->
  <MainLayout v-else>
    <!-- Mantém este router-view aqui para garantir renderização,
         mesmo que seu MainLayout não tenha <router-view/> interno -->
    <router-view key="app" />
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from 'layouts/MainLayout.vue'

const route = useRoute()
const AUTH_ROUTES = ['/login', '/redefinir-senha']
const isAuthRoute = computed(() => AUTH_ROUTES.includes(route.path))
</script>

<style>
/* opcional: estilos globais específicos do App */
</style>
