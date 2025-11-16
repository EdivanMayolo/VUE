<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated style="background-color: #66BB6A">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <!-- Se quiser, coloca o nome do sistema aqui -->
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      side="left"
      bordered
      style="background-color: #66BB6A"
    >
      <q-list padding>

        <!-- LINKS PRINCIPAIS -->
        <EssentialLink
          v-for="link in mainLinks"
          :key="link.title"
          v-bind="link"
        />

        <!-- SEÇÃO CADASTROS -->
        <q-separator spaced />

        <q-item-label
          header
          class="text-uppercase text-black q-pa-md font-bold"
        >
          Cadastros
        </q-item-label>

        <EssentialLink
          v-for="link in cadastroLinks"
          :key="link.title"
          v-bind="link"
        />

        <!-- LOGOUT SEPARADO -->
        <q-separator spaced />
        <EssentialLink v-bind="logoutLink" />

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

const leftDrawerOpen = ref(false)

const mainLinks = [
  { title: 'Home',        to: '/',            icon: 'home' },
  { title: 'Aptos Vagos', to: '/aptos-vagos', icon: 'holiday_village' },
  { title: 'Agua',        to: '/agua',        icon: 'water_drop' },
  { title: 'Caixa',       to: '/caixa',       icon: 'account_balance_wallet' },
  { title: 'Boletos',     to: '/boletos',     icon: 'receipt_long' }
]

const cadastroLinks = [
  { title: 'Apartamento',      to: '/apartamento',      icon: 'apartment' },
  { title: 'Morador',          to: '/morador',          icon: 'people' },
  { title: 'Despesa Fixa',     to: '/despesa-fixa',     icon: 'payments' },
  { title: 'Despesa Variavel', to: '/despesa-variavel', icon: 'trending_up' },
  { title: 'Fatura',           to: '/fatura',           icon: 'request_quote' }
]

const logoutLink = {
  title: 'Logout',  to: '/',  icon: 'logout'
}
</script>
