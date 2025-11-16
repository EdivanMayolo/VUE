<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center " style="background-color: #A5D6A7">
        <div class="login-box">
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
      <q-btn
        flat
        color="green-9"
        :label="$t('login.forgot')"
        @click="$router.push('/redefinir-senha')"
      />
    </div>

    <q-btn
      class="q-mt-md full-width"
      style="background-color: #66BB6A"
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
const pass = ref('');

const requiredMsg = computed(() => $q.lang.label.required || 'Obrigatório')

const onSubmit = () => {
  router.push('/dashboard')
}
</script>
<style scoped>
.login-box {
  width: 420px;
  max-width: 90vw;

  background: #a5d6a7;
  padding: 32px;
  border-radius: 16px;
  border: 2px solid #66bb6a; /* borda */
  box-shadow: 0 8px 22px rgba(0,0,0,0.18);

  display: flex;
  flex-direction: column;
}
</style>

