<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="q-pa-md" style="width: 400px; max-width: 92vw">
          <div class="text-h5 q-mb-md">{{ $t('login.title') }}</div>

          <q-form @submit.prevent="onSubmit">
            <q-input
              v-model="user"
              :label="$t('login.userOrEmail')"
              outlined
              dense
              class="q-mb-sm"
              lazy-rules
              :rules="[(val) => !!val || requiredMsg]"
            />

            <q-input
              v-model="pass"
              :label="$t('login.password')"
              type="password"
              outlined
              dense
              lazy-rules
              :rules="[(val) => !!val || requiredMsg]"
            />

            <div class="q-mt-xs text-right">
              <q-btn flat color="secondary" :label="$t('login.forgot')" @click="$router.push('/redefinir-senha')" />
            </div>

            <q-btn
              class="q-mt-md full-width"
              color="primary"
              :label="$t('login.submit')"
              type="submit"
            />
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const user = ref('')
const pass = ref('')
const requiredMsg = computed(() => $q.lang.label.required || 'Obrigatório')

const onSubmit = () => {
  // aqui depois você chama o $api do boot/axios
  // ex: const { data } = await $api.post('/auth/login', { user: user.value, pass: pass.value })

  // por enquanto só navega para testar o fluxo:
  router.push('/dashboard')
}
</script>
