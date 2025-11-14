<template>
  <q-page class="bg-green-3 text-black cadastro-fatura-page">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">

        <!-- TÍTULO -->
         
        <div class="text-h4 q-mt-xl q-mb-lg text-center text-weight-light">
          Cadastro Fatura Mensal
        </div>
        <!-- FORMULÁRIO -->
        <q-form @submit.prevent="onSubmit">
          <div class="column q-gutter-xs">
            <!-- NÚMERO DO APTO -->
            <div>
              <div class="q-gutter-xs">Número do Apto</div>
              <q-input
                v-model="form.apto"
                outlined
                dense
                :rules="[val => !!val || 'Informe o número do apartamento']"
              >
                <template #append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </div>

            <!-- MÊS -->
            <div>
              <div class="q-gutter-xs">Mês</div>
              <q-input
                v-model="form.mes"
                outlined
                dense
                :rules="[val => !!val || 'Informe o mês']"
              >
                <template #prepend>
                  <q-icon name="event" />
                </template>
                <template #append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </div>

            <!-- ANO -->
            <div>
              <div class="q-gutter-xs">Ano</div>
              <q-input
                v-model="form.ano"
                outlined
                dense
                :rules="[
                  val => !!val || 'Informe o ano',
                  val => String(val).length === 4 || 'Ano inválido'
                ]"
              >
                <template #prepend>
                  <q-icon name="event" />
                </template>
                <template #append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </div>

            <!-- VALOR FIXO -->
            <div>
              <div class="q-gutter-xs">Valor Fixo</div>
              <q-input
                v-model="form.valorFixo"
                outlined
                dense
                prefix="R$"
                :rules="[
                  val => !!val || 'Informe o valor fixo',
                  val => isValorValido(val) || 'Informe um valor numérico válido'
                ]"
              >
                <template #append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </div>

            <!-- VALOR VARIÁVEL -->
            <div>
              <div class="q-gutter-xs">Valor Variável</div>
              <q-input
                v-model="form.valorVariavel"
                outlined
                dense
                prefix="R$"
                :rules="[
                  val => !!val || 'Informe o valor variável',
                  val => isValorValido(val) || 'Informe um valor numérico válido'
                ]"
              >
                <template #append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </div>

          </div>

          <!-- BOTÕES SALVAR / VOLTAR -->
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

          <!-- BOTÃO FATURAS (CENTRALIZADO) -->
          <div class="botao-faturas-container">
            <q-btn
              label="FATURAS"
              color="green"
              text-color="black"
              class="btn-acao"
              @click="abrirFaturas"
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
  apto: '',
  mes: '',
  ano: '',
  valorFixo: '',
  valorVariavel: ''
})

const isValorValido = (val) => {
  if (!val) return false
  const normalizado = String(val).replace('.', '').replace(',', '.')
  return !isNaN(normalizado) && Number(normalizado) >= 0
}

const onSubmit = () => {
  const normalize = (v) =>
    Number(String(v).replace('.', '').replace(',', '.'))

  const payload = {
    apto: form.value.apto,
    mes: form.value.mes,
    ano: form.value.ano,
    valorFixo: normalize(form.value.valorFixo),
    valorVariavel: normalize(form.value.valorVariavel)
  }

  console.log('Fatura (mock, sem API ainda):', payload)

  $q.notify({
    type: 'positive',
    message: 'Fatura cadastrada (mock, sem API).',
    position: 'top'
  })

  // se quiser limpar:
  // form.value = { apto: '', mes: '', ano: '', valorFixo: '', valorVariavel: '' }
}

const voltarMenu = () => {
  router.push({ path:'/dashboard' })
}

const abrirFaturas = () => {
  // aqui no futuro você navega pra tela de listagem de faturas
  console.log('Clique em FATURAS - futura tela de listagem')
  $q.notify({
    type: 'info',
    message: 'Aqui futuramente vai abrir a listagem de faturas.',
    position: 'top'
  })
}
</script>

<style scoped>
.cadastro-fatura-page {
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

.botao-faturas-container {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.btn-acao {
  width: 250px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

@media (max-width: 600px) {
  .cadastro-fatura-page {
    align-items: stretch;
  }

  .botoes-container {
    flex-direction: column;
  }
}
</style>
