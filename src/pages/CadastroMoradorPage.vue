<template>
  <q-page class="bg-green-3 text-black cadastro-morador-page">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">

        <!-- TÍTULO -->
        <div class="text-h4 q-mt-xl q-mb-lg text-center text-weight-light">
          Cadastre o Morador
        </div>

        <!-- FORMULÁRIO -->
        <q-form @submit.prevent="onSubmit">
          <div class="q-gutter-md">

            <!-- NOME COMPLETO -->
            <div>
              <div class="text-subtitle2 q-mb-xs">Nome Completo</div>
              <q-input
                v-model="form.nome"
                outlined
                dense
                :rules="[val => !!val || 'Informe o nome completo']"
              >
                <template #append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </div>

            <!-- CPF -->
            <div>
              <div class="text-subtitle2 q-mb-xs">CPF</div>
              <q-input
                v-model="form.cpf"
                outlined
                dense
                :rules="[val => !!val || 'Informe o CPF']"
              >
                <template #append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </div>

            <!-- EMAIL -->
            <div>
              <div class="text-subtitle2 q-mb-xs">Email</div>
              <q-input
                v-model="form.email"
                outlined
                dense
                :rules="[
                  val => !!val || 'Informe o email',
                  val => /.+@.+\..+/.test(val) || 'Email inválido'
                ]"
              >
                <template #prepend>
                  <q-icon name="mail" />
                </template>
                <template #append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </div>

            <!-- TELEFONE -->
            <div>
              <div class="text-subtitle2 q-mb-xs">Telefone</div>
              <q-input
                v-model="form.telefone"
                outlined
                dense
                :rules="[val => !!val || 'Informe o telefone']"
              >
                <template #prepend>
                  <q-icon name="phone" />
                </template>
                <template #append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </div>

            <!-- TIPO (PROPRIETÁRIO / INQUILINO) -->
            <div class="row q-gutter-md q-mt-md">
              <div class="col-auto">
                <q-checkbox
                  v-model="form.proprietario"
                  label="Proprietário"
                  dense
                />
              </div>
              <div class="col-auto">
                <q-checkbox
                  v-model="form.inquilino"
                  label="Inquilino"
                  dense
                />
              </div>
            </div>

          </div>

          <!-- BOTÕES -->
          <div class="botoes-container">
            <q-btn
              label="SALVAR"
              color="green"
              text-color="black"
              class="btn-acao"
              type="submit"
            />

            <q-btn
              label="VOLTAR AO MENU"
              color="green"
              text-color="black"
              class="btn-acao"
              @click="voltarMenu"
            />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const form = ref({
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  proprietario: false,
  inquilino: false
})

const onSubmit = () => {
  console.log('Dados do morador (ainda só front):', form.value)

  $q.notify({
    type: 'positive',
    message: 'Morador cadastrado (mock, sem API ainda).',
    position: 'top'
  })

  // se quiser limpar:
  // form.value = { nome: '', cpf: '', email: '', telefone: '', proprietario: false, inquilino: false }
}

const voltarMenu = () => {
  router.push({ name: 'dashboard' }) // ou a rota que você usa como "menu"
}
</script>

<style scoped>
.cadastro-morador-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
}

.botoes-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
}

.btn-acao {
  width: 250px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

@media (max-width: 600px) {
  .cadastro-morador-page {
    align-items: stretch;
  }

  .botoes-container {
    flex-direction: column;
  }
}
</style>
