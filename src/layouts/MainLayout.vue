<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="background-color: #43A047">
        <q-btn flat dense round icon="menu" aria-label="Menu"/>

        <q-toolbar-title>  </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <!-- <q-item-label header> Essential Links </q-item-label> -->

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Home',
    to: '/',
    icon: 'house',
  },
  {
    title: 'Aptos Vagos',
    icon: 'code',
  },
  {
    title: 'Agua',
    icon: 'water',    
  },
  {
    title: 'Caixa',
    icon: '       ',
  },
  {
    title: 'Boletos',
    icon: 'money',    
  },
  {
    title: 'CADASTROS',
    icon: 'person',
  },
  {
    title: 'Apartamento',
     to :'apartamento',
  },
  {
    title: 'Morador',
     to :'morador',
        icon:'people',
  },
  {
    title: 'Despesa Fixa',
     to :'despesa-fixa',
  },
  {
    title: 'Despesa Variavel',
     to :'despesa-variavel',
  },
  {
    title: 'Fatura',
     to :'fatura',
  },
  {
    title: 'Logout',
    to: '/', //conforme tiver que direcionar a pagina
    icon: 'back',
  },
]

const leftDrawerOpen = ref(false)
</script>
