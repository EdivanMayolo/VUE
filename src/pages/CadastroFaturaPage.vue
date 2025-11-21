<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import { useApartamentoStore } from 'src/stores/apartamento-store'
import { useDespesaFixaStore } from 'src/stores/despesa_fixa.store'
import { useDespesaVariavelStore } from 'src/stores/despesa_variavel-store'
import { useFaturaStore } from 'src/stores/fatura-store'
import { useMoradorStore } from 'src/stores/morador-store' // <-- para master-detail

const router = useRouter()
const $q = useQuasar()

const apartamentoStore = useApartamentoStore()
const despesaFixaStore = useDespesaFixaStore()
const despesaVariavelStore = useDespesaVariavelStore()
const faturaStore = useFaturaStore()
const moradorStore = useMoradorStore()

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

// quando escolher uma data no calendário,
// atualiza MÊS e ANO
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

// -------- CÁLCULOS POR APARTAMENTO --------
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

const qtdAptos = computed(() =>
  apartamentoStore.lista.length > 0 ? apartamentoStore.lista.length : 1
)

// valores TOTAIS (para o formulário da esquerda)
const valorFixoTotal = computed(() => totalFixas.value)
const valorVariavelTotal = computed(() => totalVariaveis.value)
const valorTotalGeral = computed(() => valorFixoTotal.value + valorVariavelTotal.value)

// valores POR APTO (os que vão pra fatura)
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
  return Number(valor).toLocaleString('pt-BR', {
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
  { name: 'valorFixo', label: 'Valor Fixo por Apto', field: 'valorFixo' },
  { name: 'valorVariavel', label: 'Valor Variável por Apto', field: 'valorVariavel' },
  { name: 'valorTotal', label: 'Total por Apto', field: 'valorTotal' },
  { name: 'dataVencimento', label: 'Vencimento', field: 'dataVencimento' },
  { name: 'actions', label: 'Ações', field: 'actions', sortable: false }
]

// -------- MASTER-DETAIL POPUP --------
const showFaturasDialog = ref(false)

const columnsDetalhe = [
  { name: 'numeroApto', label: 'Apto', field: 'numeroApto' },
  { name: 'nome', label: 'Nome Morador', field: 'nome' },
  { name: 'cpf', label: 'CPF', field: 'cpf' },
  { name: 'dataVencimento', label: 'Vencimento', field: 'dataVencimento' },
  { name: 'valorTotal', label: 'Valor Total', field: 'valorTotal' }
]

// join fatura + morador
const faturasDetalhadas = computed(() =>
  faturaStore.lista.map(f => {
    const morador = moradorStore.lista.find(
      m => String(m.numeroApartamento) === String(f.numeroApto)
    )

    return {
      id: f.id,
      numeroApto: f.numeroApto,
      nome: morador?.nome ?? 'N/A',
      cpf: morador?.cpf ?? 'N/A',
      dataVencimento: f.dataVencimento,
      valorTotal: f.valorTotal
    }
  })
)

onMounted(async () => {
  await Promise.all([
    apartamentoStore.carregarTodos(),
    despesaFixaStore.carregarTodos(),
    despesaVariavelStore.carregarTodos(),
    faturaStore.carregarTodos?.(),
    moradorStore.carregarTodos?.()
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
    valorFixo: Number(valorFixoPorApto.value.toFixed(2)),
    valorVariavel: Number(valorVariavelPorApto.value.toFixed(2)),
    valorTotal: Number(valorTotalPorApto.value.toFixed(2)),
    dataVencimento: dataVencimento.value
  }

  try {
    await faturaStore.criar(payload)
    $q.notify({
      type: 'positive',
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
    valorFixo: row.valorFixo,
    valorVariavel: row.valorVariavel,
    valorTotal: row.valorTotal,
    dataVencimento: row.dataVencimento
  }
}

function cancelarEdicao () {
  editingId.value = null
  editForm.value = {}
}

async function salvarEdicao (row) {
  try {
    await faturaStore.atualizar(row.id, { ...editForm.value })
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

// agora abre o popup de master-detail
function abrirFaturas () {
  showFaturasDialog.value = true
}
</script>

<template>
  <q-page class="q-pa-lg" style="background-color: #FAF9F6">
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
            label="Número do APTO *"
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
            clearable
            append-inner-icon="event"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="mesAnoData"
                    mask="YYYY-MM-DD"
                    color="positive"
                    text-color="black"
                    minimal
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
            clearable
            append-inner-icon="event"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="mesAnoData"
                    mask="YYYY-MM-DD"
                    color="positive"
                    text-color="black"
                    minimal
                    @update:model-value="onPickMesAno"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- DATA VENCIMENTO -->
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

          <!-- VALORES TOTAIS (condomínio inteiro) -->
          <q-input
            :model-value="`R$ ${formatMoeda(valorFixoTotal)}`"
            label="Total Despesas Fixas"
            filled
            dense
            readonly
          />
          <q-input
            :model-value="`R$ ${formatMoeda(valorVariavelTotal)}`"
            label="Total Despesas Variáveis"
            filled
            dense
            readonly
          />
          <q-input
            :model-value="`R$ ${formatMoeda(valorTotalGeral)}`"
            label="Total Geral"
            filled
            dense
            readonly
          />

          <!-- VALORES POR APTO (o que entra na fatura) -->
          <!-- <q-input
            :model-value="`R$ ${formatMoeda(valorFixoPorApto)}`"
            label="Valor Fixo por APTO"
            filled
            dense
            readonly
          />
          <q-input
            :model-value="`R$ ${formatMoeda(valorVariavelPorApto)}`"
            label="Valor Variável por APTO"
            filled
            dense
            readonly
          />
          <q-input
            :model-value="`R$ ${formatMoeda(valorTotalPorApto)}`"
            label="Valor Total por APTO"
            filled
            dense
            readonly
          /> -->
        </div>

        <div class="q-mt-xl">
          <q-btn
            label="SALVAR"
            style="background-color: #5b8193"
            text-color="black"
            class="q-mr-lg"
            unelevated
            @click="salvarFatura"
          />
          <q-btn
            label="VOLTAR AO MENU"
            style="background-color: #5b8193"
            text-color="black"  
            class="q-mr-lg"
            @click="voltarMenu"
          />
        </div>

        <div class="botao-faturas-container">
          <q-btn
            label="FATURAS"
            style="background-color: #5b8193"
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
            <div class="q-pa-lg" style="background-color: #FAF9F6">
              Faturas Cadastradas
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="" >
            <q-table
              :rows="faturaStore.lista"
              :columns="columns"
              row-key="id"
              color="black"
              style="background-color: #F5F5F5" 
              class="full-width"
            >
              <template #body-cell-valorFixo="props">
                <q-td :props="props">
                  R$ {{ formatMoeda(props.row.valorFixo) }}
                </q-td>
              </template>

              <template #body-cell-valorVariavel="props">
                <q-td :props="props">
                  R$ {{ formatMoeda(props.row.valorVariavel) }}
                </q-td>
              </template>

              <template #body-cell-valorTotal="props">
                <q-td :props="props">
                  R$ {{ formatMoeda(props.row.valorTotal) }}
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

    <!-- MASTER-DETAIL POPUP -->
<q-dialog v-model="showFaturasDialog">
  <q-card style="min-width: 800px; max-width: 80vw;">
    <q-card-section
      class="row items-center q-pb-none"
      style="background-color: #7fa8bb">
      <div class="text-h5">Faturas X Moradores</div> 
      <q-space />

      <q-btn
        icon="close"
        flat
        round
        dense
        v-close-popup
      />
    </q-card-section>

    <q-card-section>
      <q-table
        :rows="faturasDetalhadas"
        :columns="columnsDetalhe"
        row-key="id"
        flat
        bordered
        dense
        
      />
    </q-card-section>
  </q-card>
</q-dialog>
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
  background-color: #5c5c5c !important;
  border: none !important;
}

.card-verde .q-card__section {
  background-color: #7fa8bb !important;
  color: black !important;
}

.botao-faturas-container {
  margin-top: 20px;
  display: flex;
  justify-content: left;
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
