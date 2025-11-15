<template>
  <q-page class="bg-green-3 text-black cadastro-apto-page">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">

        <!-- Título -->
        <div class="text-h4 q-mt-xl q-mb-lg text-center text-weight-light">
          Cadastre o APTO
        </div>

        <!-- FORMULÁRIO -->
        <q-form @submit.prevent="onSubmit">
          <div class="q-gutter-md">

            <!-- Número do APTO -->
            <div>
              <div class="text-subtitle2 q-mb-xs">Número do APTO</div>
              <q-input
                v-model="form.numero"
                outlined
                dense
                :rules="[val => !!val || 'Informe o número do apartamento']"
              >
                <template #append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </div>

            <!-- Andar -->
            <div>
              <div class="text-subtitle2 q-mb-xs">Andar</div>
              <q-input
                v-model="form.andar"
                outlined
                dense
                type="number"
                :rules="[
                  val => !!val || 'Informe o andar',
                  val => Number(val) >= 0 || 'Andar não pode ser negativo'
                ]"
              >
                <template #append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </div>

            <!-- Bloco -->
            <div>
              <div class="text-subtitle2 q-mb-xs">Bloco</div>
              <q-input
                v-model="form.bloco"
                outlined
                dense
                :rules="[val => !!val || 'Informe o bloco']"
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
            type="submit"/>

          <q-btn
            label="VOLTAR AO MENU"
            color="green"
            text-color="black"
            class="btn-acao"
            @click="voltarMenu"/>
        </div>
        
        </q-form>
      </div>
    </div>
    <q-table
      title="Apartamentos"
      :rows="apartamentoStore.lista"
      :columns="columns"
      row-key="name"
    />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import { useApartamentoStore } from 'src/stores/apartamento-store'
const apartamentoStore = useApartamentoStore()
apartamentoStore.carregarTodos()

const router = useRouter()
const $q = useQuasar()


const form = ref({
  numero: '',
  andar: '',
  bloco: ''
})
const columns = [
  { name: 'ID', required: true, label: 'id', align: 'left', field: 'id' },
  { name: 'Numero', required: true, label: 'numero', align: 'left', field: 'numero'},
  { name: 'Andar', required: true, label: 'andar', align: 'left', field: 'andar'},
  { name: 'Bloco', required: true, label: 'bloco', align: 'left', field: 'bloco'}
];

const onSubmit = async () => {
  try {
    const payload = {
      numero: form.value.numero,
      andar: Number(form.value.andar),
      bloco: form.value.bloco
    }
    console.log('onSubmit FOI CHAMADO', form.value)

    await apartamentoStore.criar(payload)

    $q.notify({
      type: 'positive',
      message: 'Apartamento cadastrado com sucesso!',
      position: 'top'
    })

    form.value = { numero: '', andar: '', bloco: '' }
  } catch {
  $q.notify({
    type: 'negative',
    message: apartamentoStore.erro || 'Erro ao salvar apartamento.',
    position: 'top'
    })
  }
}
const voltarMenu = () => {
  router.push({ path:'/dashboard' })
}
</script>
<style scoped>
.cadastro-apto-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start00;
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
  .cadastro-apto-page {
    align-items: stretch;
  }
}
</style>

