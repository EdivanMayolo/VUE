<template>
  <q-page class="q-pa-lg" style="background-color: #c5f1c7">
    <div class="row q-col-gutter-md">
      <!-- COLUNA ESQUERDA: FORM -->
      <div class="col-12 col-md-4">
        <div class="text-h4 q-mr-sm q-mb-md">
          Cadastro de Despesa Fixa
        </div>

        <div class="q-gutter-md" style="max-width: 323px">
          <!-- DESCRIÇÃO -->
          <q-input
            v-model="descricao"
            label="Descrição da Despesa *"
            filled
            dense
            clearable
            append-inner-icon="edit"
          />

          <!-- VALOR -->
          <q-input
            v-model="valor"
            label="Valor *"
            filled
            dense
            clearable
            prefix="R$"
            append-inner-icon="payments"
          />
        </div>

        <div class="q-mt-xl">
          <q-btn
            label="SALVAR"
            style="background-color: #66BB6A"
            text-color="black"
            class="q-mr-lg"
            unelevated
            @click="salvarDespesa"
          />
          <q-btn
            label="VOLTAR AO MENU"
            style="background-color: #66BB6A"
            text-color="black"
            class="q-mr-lg"            
            @click="voltarMenu"
          />
        </div>
      </div>

      <!--GRID -->
      <div class="col-12 col-md-8">
        <q-card flat class="card-verde">
          <q-card-section>
            <div class="q-pa-lg" style="background-color: #a5d6a7">Despesas Cadastradas</div>
          </q-card-section>
          <q-separator />

          <q-card-section class="bg-green-4">
            <q-table
              :rows="despesaFixaStore.lista"
              :columns="columns"
              row-key="id"
              style="background-color: #d9f8db"
              table-header-class="bg-green-2"
              class="full-width"
            >
              <!-- DESCRIÇÃO -->
              <template #body-cell-descricao="props">
                <q-td :props="props">
                  <template v-if="editingId === String(props.row.id)">
                    <q-input v-model="editForm.descricao" dense outlined />
                  </template>
                  <template v-else>
                    {{ props.row.descricao }}
                  </template>
                </q-td>
              </template>

              <!-- VALOR -->
              <template #body-cell-valor="props">
                <q-td :props="props">
                  <template v-if="editingId === String(props.row.id)">
                    <q-input
                      v-model="editForm.valor"
                      dense
                      outlined
                      prefix="R$"
                    />
                  </template>
                  <template v-else>
                    R$ {{ Number(props.row.valor).toFixed(2) }}
                  </template>
                </q-td>
              </template>

              <!-- AÇÕES -->
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <!-- MODO EDIÇÃO -->
                  <template v-if="editingId === String(props.row.id)">
                    <q-btn
                      label="SALVAR"
                      size="sm"
                      flat
                      color="secondary"
                      class="q-mr-sm"
                      @click="salvarEdicao(props.row)"
                    />
                    <q-btn
                      label="CANCELAR"
                      size="sm"
                      flat
                      color="negative"
                      @click="cancelarEdicao"
                    />
                  </template>

                  <!-- MODO NORMAL -->
                  <template v-else>
                    <q-btn
                      icon="edit"
                      size="sm"
                      flat
                      color="primary"
                      class="q-mr-sm"
                      @click="habilitarEdicao(props.row)"
                    />
                    <q-btn
                      icon="delete"
                      size="sm"
                      flat
                      color="negative"
                      @click="removerDespesa(props.row)"
                    />
                  </template>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useDespesaFixaStore } from 'src/stores/despesa_fixa.store'

const router = useRouter()
const $q = useQuasar()
const despesaFixaStore = useDespesaFixaStore()

// FORMULÁRIO
const descricao = ref('')
const valor = ref('')

function resetForm () {
  descricao.value = ''
  valor.value = ''
}

function normalizarValor (val) {
  if (!val && val !== 0) return null
  const normalizado = String(val).replace(/\./g, '').replace(',', '.')
  const numero = Number(normalizado)
  return isNaN(numero) ? null : numero
}

function validarFormDespesa (dados) {
  if (!dados.descricao) {
    $q.notify({
      type: 'negative',
      message: 'Descrição é obrigatória'
    })
    return false
  }

  if (dados.valor === null || isNaN(dados.valor)) {
    $q.notify({
      type: 'negative',
      message: 'Informe um valor numérico válido'
    })
    return false
  }

  return true
}

async function salvarDespesa () {
  const payload = {
    descricao: descricao.value,
    valor: normalizarValor(valor.value)
  }

  if (!validarFormDespesa(payload)) {
    return
  }

  try {
    await despesaFixaStore.criar(payload)
    $q.notify({
      type: 'positive',
      message: 'Despesa fixa cadastrada com sucesso'
    })
    resetForm()
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: err?.response?.data?.message || 'Erro ao cadastrar despesa fixa'
    })
  }
}

function voltarMenu () {
  router.push('/dashboard')
}

// GRID / EDIÇÃO INLINE
const editingId = ref(null)
const editForm = ref({})

const columns = [
  { name: 'descricao', label: 'Descrição', field: 'descricao' },
  { name: 'valor', label: 'Valor', field: 'valor' },
  { name: 'actions', label: 'Ações', field: 'actions', sortable: false }
]

onMounted(() => {
  despesaFixaStore.carregarTodos()
})

function habilitarEdicao (row) {
  editingId.value = String(row.id)
  editForm.value = {
    id: row.id,
    descricao: row.descricao,
    valor: row.valor
  }
}

function cancelarEdicao () {
  editingId.value = null
  editForm.value = {}
}

async function salvarEdicao (row) {
  const payload = {
    ...editForm.value,
    valor: normalizarValor(editForm.value.valor)
  }

  if (!validarFormDespesa(payload)) {
    return
  }

  try {
    await despesaFixaStore.atualizar(row.id, payload)
    $q.notify({
      type: 'positive',
      message: 'Despesa fixa atualizada com sucesso'
    })
    cancelarEdicao()
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: err?.response?.data?.message || 'Erro ao atualizar despesa fixa'
    })
  }
}

function removerDespesa (row) {
  $q.dialog({
    title: 'Remover despesa fixa',
    message: `Deseja realmente remover a despesa "${row.descricao}"?`,
    cancel: true,
    persistent: true,
    ok: {
      label: 'Sim, remover',
      color: 'negative'
    },
    cancelLabel: 'Cancelar'
  }).onOk(async () => {
    try {
      await despesaFixaStore.remover(row.id)
      $q.notify({
        type: 'positive',
        message: 'Despesa fixa removida com sucesso'
      })
    } catch (err) {
      console.error(err)
      $q.notify({
        type: 'negative',
        message: err?.response?.data?.message || 'Erro ao remover despesa fixa'
      })
    }
  })
}
</script>

<style scoped>
.card-verde {
  background-color: #66BB6A !important; /* Verde igual aos botões */
  border: none !important;
}

/* Deixa o título sem aquele fundo branco */
.card-verde .q-card__section {
  background-color: #66BB6A !important;
  color: black !important;
}

.btn-acao {
  width: 250px;
  height: 48px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
</style>
