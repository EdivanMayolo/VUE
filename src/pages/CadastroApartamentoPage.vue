<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useApartamentoStore } from 'src/stores/apartamento-store'

const $q = useQuasar()
const router = useRouter()
const apartamentoStore = useApartamentoStore()

// ---------- FORMULÁRIO DE CADASTRO ----------
const numero = ref('')
const andar = ref('')
const bloco = ref('')

function resetForm () {
  numero.value = ''
  andar.value = ''
  bloco.value = ''
}

async function salvarApartamento () {
  try {
    await apartamentoStore.criar({
      numero: numero.value,
      andar: andar.value,
      bloco: bloco.value
    })
    $q.notify({ type: 'positive', message: 'Apartamento cadastrado com sucesso' })
    resetForm()
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: err?.response?.data?.message || 'Erro ao cadastrar apartamento'
    })
  }
}

function voltarMenu () {
  router.push('/') // ajuste se o path do menu principal for outro
}

// ---------- GRID / EDIÇÃO INLINE ----------
const editingId = ref(null)
const editForm = ref({})

const columns = [
  { name: 'id', label: 'ID', field: 'id' },
  { name: 'numero', label: 'Número', field: 'numero' },
  { name: 'andar', label: 'Andar', field: 'andar' },
  { name: 'bloco', label: 'Bloco', field: 'bloco' },
  { name: 'actions', label: 'Ações', field: 'actions', sortable: false }
]

onMounted(() => {
  apartamentoStore.carregarTodos()
})

function habilitarEdicao (row) {
  editingId.value = String(row.id)
  editForm.value = {
    id: row.id,
    numero: row.numero,
    andar: row.andar,
    bloco: row.bloco
  }
}

function cancelarEdicao () {
  editingId.value = null
  editForm.value = {}
}

async function salvarEdicao (row) {
  try {
    await apartamentoStore.atualizar(row.id, { ...editForm.value })
    $q.notify({ type: 'positive', message: 'Apartamento atualizado com sucesso' })
    cancelarEdicao()
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: err?.response?.data?.message || 'Erro ao atualizar apartamento'
    })
  }
}

// ---------- DELETE REAL ----------
function removerApartamento (row) {
  $q.dialog({
    title: 'Remover apartamento',
    message: `Deseja realmente remover o apartamento ${row.numero}?`,
    cancel: true,
    persistent: true,
    ok: {
      label: 'Sim, remover',
      color: 'negative'
    },
    cancelLabel: 'Cancelar'
  }).onOk(async () => {
    try {
      await apartamentoStore.remover(row.id)
      $q.notify({
        type: 'positive',
        message: 'Apartamento removido com sucesso'
      })
      // não precisa mexer na lista aqui:
      // o store.remover já faz this.lista = this.lista.filter(...)
    } catch (err) {
      console.error(err)
      $q.notify({
        type: 'negative',
        message: err?.response?.data?.message || 'Erro ao remover apartamento'
      })
    }
  })
}
</script>

<template>
  <q-page class="q-pa-lg" style="background-color: #a5d6a7">
    <div class="row q-col-gutter-xl">
      <!-- COLUNA ESQUERDA: FORM "SOLTO" NO FUNDO VERDE -->
      <div class="col-12 col-md-5">
        <div class="text-h4 q-mr-sm">
          Cadastre o APTO
        </div>

        <div class="q-gutter-md" style="max-width: 275px">
          <q-input
            v-model="numero"
            label="Número do APTO"
            filled
            dense
            clearable
            append-inner-icon="edit"
          />

          <q-input
            v-model="andar"
            label="Andar"
            filled
            dense
            clearable
            append-inner-icon="edit"
          />

          <q-input
            v-model="bloco"
            label="Bloco"
            filled
            dense
            clearable
            append-inner-icon="edit"
          />
        </div>

        <div class="q-mt-xl">
          <q-btn
            label="SALVAR"
            color="positive"
            text-color="black"
            class="q-mr-lg"
            unelevated
            @click="salvarApartamento"
          />
          <q-btn
            label="VOLTAR AO MENU"
            color="positive"
            text-color="black"
            class="btn-acao"
            @click="voltarMenu"/>
          
        </div>
      </div>

      <!-- COLUNA DIREITA: CARD COM A TABELA -->
      <div class="col-12 col-md-7">
        <q-card flat bordered>
          <q-card-section>
            <div class="q-pa-lg" style="background-color: #a5d6a7">Apartamentos</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="bg-green-4">
            <q-table              
              :rows="apartamentoStore.lista"
              :columns="columns"
              row-key="id"
              color="green" 
              table-header-class="bg-green-2" >
              <!-- NUMERO -->
              <template #body-cell-numero="props">
                <q-td :props="props">
                  <template v-if="editingId === String(props.row.id)">
                    <q-input v-model="editForm.numero" dense outlined />
                  </template>
                  <template v-else>
                    {{ props.row.numero }}
                  </template>
                </q-td>
              </template>

              <!-- ANDAR -->
              <template #body-cell-andar="props">
                <q-td :props="props">
                  <template v-if="editingId === String(props.row.id)">
                    <q-input v-model="editForm.andar" dense outlined />
                  </template>
                  <template v-else>
                    {{ props.row.andar }}
                  </template>
                </q-td>
              </template>

              <!-- BLOCO -->
              <template #body-cell-bloco="props">
                <q-td :props="props">
                  <template v-if="editingId === String(props.row.id)">
                    <q-input v-model="editForm.bloco" dense outlined />
                  </template>
                  <template v-else>
                    {{ props.row.bloco }}
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
                      @click="removerApartamento(props.row)"
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
