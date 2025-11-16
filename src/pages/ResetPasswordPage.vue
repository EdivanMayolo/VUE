<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-green-3 text-black" style="min-height: 100vh">
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
              <q-input v-model="pwd2" :label="$t('reset.confirm')" type="password" outlined dense />

              <q-btn
                class="q-mt-md full-width"
                style="background-color: #66BB6A"
                :label="$t('reset.submit')"
                type="submit"
              />
            </q-form>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const pwd = ref('')
const pwd2 = ref('')

const onSubmit = () => {
  console.log('onSubmit foi chamado', pwd.value, pwd2.value)

  if (pwd.value !== pwd2.value) {
    alert('As senhas não são iguais!')
    return
  }

  alert('Senha redefinida com sucesso!')
  router.push('/')
}
</script>
