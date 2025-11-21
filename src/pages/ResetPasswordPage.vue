<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center " style="background-color: #5fa5c5">
        <div class="reset-box">
          <div class="text-h5 q-mb-md text-center text-weight-bold">
            REDEFINIR SENHA
          </div>

          <q-form @submit.prevent="onSubmit">
            <q-input
              v-model="novaSenha"
              label="Nova Senha"
              type="password"
              outlined
              dense
              class="q-mb-sm"
              lazy-rules
              :rules="[(val) => !!val || 'Informe a nova senha']"
            />

            <q-input
              v-model="confirmaSenha"
              label="Confirme sua Senha"
              type="password"
              outlined
              dense
              lazy-rules
              :rules="[
                (val) => !!val || 'Confirme a senha',
                (val) => val === novaSenha || 'As senhas não conferem'
              ]"
            />

            <q-btn
              class="q-mt-md full-width"
              style="background-color: #5fa5c5"
              text-color="black"
              label="ENVIAR"
              type="submit"
            />
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const novaSenha = ref('')
const confirmaSenha = ref('')

const onSubmit = () => {
  if (novaSenha.value !== confirmaSenha.value) {
    $q.notify({
      type: 'negative',
      message: 'As senhas não conferem'
    })
    return
  }

  // aqui depois você chama a API de redefinição de senha

  $q.notify({
    type: 'positive',
    message: 'Senha redefinida com sucesso'
  })

  router.push('/') // ajusta o caminho que você usa pro login
}
</script>

<style scoped>
.reset-box {
  width: 420px;
  max-width: 90vw;

  background: #7fa5bb;        /* verde claro, igual login */
  padding: 32px;
  border-radius: 16px;
  border: 2px solid #0c5f86;  /* borda verde */
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18);

  display: flex;
  flex-direction: column;
}
</style>
