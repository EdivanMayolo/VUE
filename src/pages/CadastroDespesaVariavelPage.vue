<template>
  <q-page class="bg-green-3 text-black cadastro-despesa-page">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">

        <!-- TÍTULO -->
        <div class="text-h4 q-mt-xl q-mb-lg text-center text-weight-light">
          Cadastro de Despesa
        </div>

        <!-- FORMULÁRIO -->
        <q-form @submit.prevent="onSubmit">
          <div class="q-gutter-md">

            <!-- DESCRIÇÃO -->
            <div>
              <div class="text-subtitle2 q-mb-xs">Descrição da Despesa</div>
              <q-input
                v-model="form.descricao"
                outlined
                dense
                :rules="[val => !!val || 'Informe a descrição da despesa']"
              >
                <template #append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </div>

            <!-- VALOR -->
            <div>
              <div class="text-subtitle2 q-mb-xs">Valor</div>
              <q-input
                v-model="form.valor"
                outlined
                dense
                prefix="R$"
                :rules="[
                  val => !!val || 'Informe o valor',
                  val => isValorValido(val) || 'Informe um valor numérico válido'
                ]"
              >
                <template #append>
                  <q-icon name="edit" />
                </template>
              </q-input>
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
  descricao: '',
  valor: '' 
})

const isValorValido = (val) => {
  if (!val) return false
  // troca vírgula por ponto e testa se é número
  const normalizado = String(val).replace('.', '').replace(',', '.')
  return !isNaN(normalizado) && Number(normalizado) >= 0
}

const onSubmit = () => {
  const normalizado = String(form.value.valor).replace('.', '').replace(',', '.')
  const payload = {
    descricao: form.value.descricao,
    valor: Number(normalizado)
  }

  console.log('Despesa variavel (mock, sem API ainda):', payload)

  $q.notify({
    type: 'positive',
    message: 'Despesa variavel cadastrada (mock, sem API).',
    position: 'top'
  })
   form.value = { descricao: '', valor: '' }
}

const voltarMenu = () => {
  router.push({ path:'/' })
}
</script>

<style scoped>
.cadastro-despesa-page {
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
  .cadastro-despesa-page {
    align-items: stretch;
  }

  .botoes-container {
    flex-direction: column;
  }
}
</style>
