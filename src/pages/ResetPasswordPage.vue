<template>
  <q-page class="flex flex-center bg-green-3 text-black" style="min-height:100vh;">
    <div class="col-12 col-md-6"></div>

    <div class="col-12 col-md-6 flex flex-center">
      <div class="q-pa-md" style="width: 380px; max-width: 90vw">
        <div class="text-h5 q-mb-md">{{ $t('reset.title') }}</div>

        <q-form @submit.prevent="onSubmit">
          <q-input
            v-model="pwd"
            :label="$t('reset.new')"
            type="password"
            outlined
            dense
            class="q-mb-sm"
          />
          <q-input
            v-model="pwd2"
            :label="$t('reset.confirm')"
            type="password"
            outlined
            dense
          />

          <q-btn
            class="q-mt-md full-width"
            color="green"
            :label="$t('reset.submit')"
            type="submit"
          />

          <!-- <div class="q-mt-sm text-center">
            <q-btn flat color="secondary" :label="$t('reset.backToLogin')" @click="goLogin" />
          </div> -->
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const pwd = ref('')
const pwd2 = ref('')

const onSubmit = () => {
  // aqui no futuro você chama a API para redefinição
  // por enquanto só volta pro login
  router.push('/login')
}

//const goLogin = () => router.push('/login')
</script>
