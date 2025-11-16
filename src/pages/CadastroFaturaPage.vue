<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import { useApartamentoStore } from 'src/stores/apartamento-store'
import { useDespesaFixaStore } from 'src/stores/despesa_fixa.store'
import { useDespesaVariavelStore } from 'src/stores/despesa_variavel-store'
import { useFaturaStore } from 'src/stores/fatura-store'

const router = useRouter()
const $q = useQuasar()

const apartamentoStore = useApartamentoStore()
const despesaFixaStore = useDespesaFixaStore()
const despesaVariavelStore = useDespesaVariavelStore()
const faturaStore = useFaturaStore()

// -------- FORM --------
const numeroApto = ref(null)
const mes = ref('')
const ano = ref('')
const dataVencimento = ref('')

// usado pelo q-date (escolha de mês/ano)
const mesAnoData = ref('')

function resetForm () {
  numeroApto.value = null
  mes.value = ''
  ano.value = ''
  dataVencimento.value = ''
  mesAnoData.value = ''
}

// quando escolher uma data no calendário, atualiza MÊS e ANO
function onPickMesAno (val) {
  mesAnoData.value = val
  // com mask="YYYY-MM-DD" o valor vem tipo "2025-11-15"
  const [year, month] = val.split('-')
  ano.value = year
  mes.value = month
}

// opções de apartamento para o select
const aptoOptions = computed(() =>
  apartamentoStore.lista.map(a => ({
    label: `APTO ${a.numero} - Bloco ${a.bloco ?? ''}`.trim(),
    value: a.numero
  }))
)

// -------- CÁLCULOS --------

// TOTAL do condomínio (soma de tudo que está cadastrado)
const totalFixas = computed(() =>
  despesaFixaStore.lista.reduce(
    (soma, d) => soma + Number(d.valor || 0),
    0
  )
)

const totalVariaveis = computed(() =>
  despesaVariavelStore.lista.reduce(
    (soma, d) => soma + Number(d.valor || 0),
    0
  )
)

const totalCondominio = computed(
  () => totalFixas.value + totalVariaveis.value
)

// QTD de apartamentos
const qtdAptos = computed(() =>
  apartamentoStore.lista.length > 0 ? apartamentoStore.lista.length : 1
)

// VALORES POR APTO (rateio)
const valorFixoPorApto = computed(() =>
  qtdAptos.value ? totalFixas.value / qtdAptos.value : 0
)

const valorVariavelPorApto = computed(() =>
  qtdAptos.value ? totalVariaveis.value / qtdAptos.value : 0
)

const valorTotalPorApto = computed(() =>
  valorFixoPorApto.value + valorVariavelPorApto.value
)

function formatMoeda (valor) {
  if (valor == null || isNaN(valor)) return ''
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// -------- GRID / EDIÇÃO --------
const editingId = ref(null)
const editForm = ref({})

const columns = [
  { name: 'numeroApto', label: 'Apto', field: 'numeroApto' },
  { name: 'mes', label: 'Mês', field: 'mes' },
  { name: 'ano', label: 'Ano', field: 'ano' },
  { name: 'valorFixo', label: 'Fixo por APTO', field: 'valorFixo' },
  { name: 'valorVariavel', label: 'Variável por APTO', field: 'valorVariavel' },
  { name: 'valorTotal', label: 'Total', field: 'valorTotal' },
  { name: 'dataVencimento', label: 'Vencimento', field: 'dataVencimento' },
  { name: 'actions', label: 'Ações', field: 'actions', sortable: false }
]

onMounted(async () => {
  await Promise.all([
    apartamentoStore.carregarTodos(),
    despesaFixaStore.carregarTodos(),
    despesaVariavelStore.carregarTodos(),
    faturaStore.carregarTodos?.()
  ])
})

function validarForm () {
  if (!numeroApto.value) {
    $q.notify({ type: 'negative', message: 'Selecione o apartamento' })
    return false
  }
  if (!mes.value) {
    $q.notify({ type: 'negative', message: 'Informe o mês' })
    return false
  }
  if (!ano.value || String(ano.value).length !== 4) {
    $q.notify({ type: 'negative', message: 'Informe um ano válido (4 dígitos)' })
    return false
  }
  if (!dataVencimento.value) {
    $q.notify({ type: 'negative', message: 'Informe a data de vencimento' })
    return false
  }
  return true
}

async function salvarFatura () {
  if (!validarForm()) return

  const payload = {
    numeroApto: numeroApto.value,
    mes: mes.value,
    ano: ano.value,
    // SEMPRE salva POR APTO
    valorFixo: Number(valorFixoPorApto.value.toFixed(2)),
    valorVariavel: Number(valorVariavelPorApto.value.toFixed(2)),
    valorTotal: Number(valorTotalPorApto.value.toFixed(2)),
    dataVencimento: dataVencimento.value
  }

  try {
    await faturaStore.criar(payload)
    $q.notify({
      type: 'secondary',
      message: 'Fatura cadastrada com sucesso'
    })
    resetForm()
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: err?.response?.data?.message || 'Erro ao cadastrar fatura'
    })
  }
}

function habilitarEdicao (row) {
  editingId.value = String(row.id)
  editForm.value = {
    id: row.id,
    numeroApto: row.numeroApto,
    mes: row.mes,
    ano: row.ano,
    dataVencimento: row.dataVencimento
  }
}

function cancelarEdicao () {
  editingId.value = null
  editForm.value = {}
}

async function salvarEdicao (row) {
  try {
    const payload = {
      ...editForm.value,
      // continua usando os valores POR APTO
      valorFixo: Number(valorFixoPorApto.value.toFixed(2)),
      valorVariavel: Number(valorVariavelPorApto.value.toFixed(2)),
      valorTotal: Number(valorTotalPorApto.value.toFixed(2))
    }

    await faturaStore.atualizar(row.id, payload)

    $q.notify({
      type: 'positive',
      message: 'Fatura atualizada com sucesso'
    })
    cancelarEdicao()
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: err?.response?.data?.message || 'Erro ao atualizar fatura'
    })
  }
}

function removerFatura (row) {
  $q.dialog({
    title: 'Remover fatura',
    message: `Deseja realmente remover a fatura do apto ${row.numeroApto} (${row.mes}/${row.ano})?`,
    cancel: true,
    persistent: true,
    ok: {
      label: 'Sim, remover',
      color: 'negative'
    },
    cancelLabel: 'Cancelar'
  }).onOk(async () => {
    try {
      await faturaStore.remover(row.id)
      $q.notify({
        type: 'positive',
        message: 'Fatura removida com sucesso'
      })
    } catch (err) {
      console.error(err)
      $q.notify({
        type: 'negative',
        message: err?.response?.data?.message || 'Erro ao remover fatura'
      })
    }
  })
}

function voltarMenu () {
  router.push('/dashboard')
}

function abrirFaturas () {
  $q.notify({
    type: 'info',
    message: 'Aqui futuramente vai abrir a fatura completa.',
    position: 'top'
  })
}
</script>

<template>
  <q-page class="q-pa-lg" style="background-color: #A5D6A7">
    <div class="row q-col-gutter-md">
      <!-- FORM ESQUERDA -->
      <div class="col-12 col-md-4">
        <div class="text-h4 q-mr-sm q-mb-md">
          Cadastro Fatura Mensal
        </div>

        <div class="q-gutter-md" style="max-width: 270px">
          <!-- APTO -->
          <q-select
            v-model="numeroApto"
            :options="aptoOptions"
            label="Número do Apto *"
            filled
            dense
            emit-value
            map-options
            clearable
            prepend-icon="home"
          />

          <!-- MÊS -->
          <q-input
            v-model="mes"
            label="Mês *"
            filled
            dense
            readonly            
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="mesAnoData"
                    mask="YYYY-MM-DD"
                    color="positive"
                    text-color="black"                    
                    @update:model-value="onPickMesAno"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- ANO -->
          <q-input
            v-model="ano"
            label="Ano *"
            filled
            dense
            readonly
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="mesAnoData"
                    mask="YYYY-MM-DD"
                    color="positive"
                    text-color="black"                    
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            v-model="dataVencimento"
            label="Data de Vencimento *"
            filled
            dense
            readonly
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="dataVencimento"
                    mask="DD/MM/YYYY"
                    color="positive"
                    text-color="black"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>


          <!-- TOTAIS DO CONDOMÍNIO -->
          <q-input
            :model-value="`R$ ${formatMoeda(totalFixas)}`"
            label="Valor Fixo TOTAL"
            filled
            dense
            readonly
          />

          <q-input
            :model-value="`R$ ${formatMoeda(totalVariaveis)}`"
            label="Valor Variável TOTAL"
            filled
            dense
            readonly
          />

          <q-input
            :model-value="`R$ ${formatMoeda(totalCondominio)}`"
            label="Valor TOTAL do Condomínio"
            filled
            dense
            readonly
          />
        </div>

        <div class="q-mt-xl">
          <q-btn
            label="SALVAR"
            style="background-color: #66BB6A"
            text-color="black"
            class="q-mr-lg"
            unelevated
            @click="salvarFatura"
          />
          <q-btn
            label="VOLTAR AO MENU"
            style="background-color: #66BB6A"
            text-color="black"
            class="q-mr-lg"
            @click="voltarMenu"
          />
        </div>

        <div class="botao-faturas-container">
          <q-btn
            label="FATURAS"
            style="background-color: #66BB6A"
            text-color="black"
            class="btn-acao"
            @click="abrirFaturas"
          />
        </div>
      </div>

      <!-- GRID DIREITA -->
      <div class="col-12 col-md-8">
        <q-card flat class="card-verde">
          <q-card-section>
            <div class="q-pa-lg" style="background-color: #a5d6a7">Faturas Cadastradas</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="bg-green-4">
            <q-table
              :rows="faturaStore.lista"
              :columns="columns"
              row-key="id"
              style="background-color: #E8F5E9"
              table-header-class="bg-green-2"
              class="full-width"
            >
              <!-- formato moeda (POR APTO) -->
              <template #body-cell-valorFixo="props">
                <q-td :props="props">
                  R$ {{ formatMoeda(Number(props.row.valorFixo || 0)) }}
                </q-td>
              </template>

              <template #body-cell-valorVariavel="props">
                <q-td :props="props">
                  R$ {{ formatMoeda(Number(props.row.valorVariavel || 0)) }}
                </q-td>
              </template>

              <template #body-cell-valorTotal="props">
                <q-td :props="props">
                  R$ {{ formatMoeda(Number(props.row.valorTotal || 0)) }}
                </q-td>
              </template>

              <!-- AÇÕES -->
              <template #body-cell-actions="props">
                <q-td :props="props">
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
                      @click="removerFatura(props.row)"
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

<style scoped>
.cadastro-fatura-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
}

.btn-acao {
  width: 250px;
  height: 45px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.card-verde {
  background-color: #66BB6A !important;
  border: none !important;
}
.card-verde .q-card__section {
  background-color: #66BB6A !important;
  color: black !important;
}
.botao-faturas-container {
  margin-top: 20px;  
  justify-content: left;
}
.q-date {
  --q-primary: #43a047 !important;
}
</style>
