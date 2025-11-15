<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="background-color: green">
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
    // to :''
    icon: 'code',
  },
  {
    title: 'Agua',
    //to: 'agua',
    icon: 'water',    
  },
  {
    title: 'Caixa',
    // to :'',
    icon: '       ',
  },
  {
    title: 'Boletos',
    icon: 'money',    
  },
  {
    title: 'CADASTROS',
     //to :'cadastros',
    icon: 'person',
  },
  {
    title: 'Apartamento',
     to :'apartamento',
    //icon: 'person',
  },
  {
    title: 'Morador',
     to :'morador',
    //icon: 'person',
  },
  {
    title: 'Despesa Fixa',
     to :'despesa-fixa',
    //icon: 'per
    // son',
  },
  {
    title: 'Despesa Variavel',
     to :'despesa-variavel',
    //icon: 'person',
  },
  {
    title: 'Fatura',
     to :'fatura',
    //icon: 'person',
  },
  {
    title: 'Logout',
    to: '/', //conforme tiver que direcionar a pagina
    icon: 'back',
  },
]

const leftDrawerOpen = ref(false)

// function toggleLeftDrawer() {
//   leftDrawerOpen.value = !leftDrawerOpen.value
// }
</script>
