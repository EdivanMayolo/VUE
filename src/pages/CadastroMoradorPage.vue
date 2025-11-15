<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMoradorStore } from 'src/stores/morador-store'

const $q = useQuasar()
const router = useRouter()
const moradorStore = useMoradorStore()
const nome = ref('')
const cpf = ref('')
const telefone = ref('')
const email = ref('')
const inquilino = ref(false)
const proprietario = ref(false)

function resetForm () {
  nome.value = ''
  cpf.value = ''
  telefone.value = ''
  email.value = ''
  inquilino.value = false
  proprietario.value = false
}
function validarFormMorador (dados) {
  if (!dados.nome || !dados.cpf || !dados.telefone) {
    $q.notify({
      type: 'negative',
      message: 'Nome, CPF e Telefone são obrigatórios'
    })
    return false
  }
  if (!dados.inquilino && !dados.proprietario) {
    $q.notify({
      type: 'negative',
      message: 'Selecione se o morador é Inquilino ou Proprietário'
    })
    return false
  }
  return true
}
async function salvarMorador () {
  const payload = {
    nome: nome.value,
    cpf: cpf.value,
    telefone: telefone.value,
    email: email.value,
    inquilino: inquilino.value,
    proprietario: proprietario.value
  }
  if (!validarFormMorador(payload)) {
    return
  }
  try {
    await moradorStore.criar(payload)
    $q.notify({ type: 'positive', message: 'Morador cadastrado com sucesso' })
    resetForm()
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: err?.response?.data?.message || 'Erro ao cadastrar morador'
    })
  }
}
function voltarMenu () {
  router.push('/dashboard')
}
const editingId = ref(null)
const editForm = ref({})

const columns = [
  //{ name: 'id', label: 'ID', field: 'id' },
  { name: 'nome', label: 'Nome', field: 'nome' },
  { name: 'cpf', label: 'CPF', field: 'cpf' },
  { name: 'telefone', label: 'Telefone', field: 'telefone' },
  { name: 'email', label: 'E-mail', field: 'email' },
  { name: 'tipo', label: 'Tipo', field: 'tipo' },
  { name: 'actions', label: 'Ações', field: 'actions', sortable: false }
]

onMounted(() => {
  moradorStore.carregarTodos()
})
function habilitarEdicao (row) {
  editingId.value = String(row.id)
  editForm.value = {
    id: row.id,
    nome: row.nome,
    cpf: row.cpf,
    telefone: row.telefone,
    email: row.email ?? '',
    inquilino: row.inquilino ?? false,
    proprietario: row.proprietario ?? false
  }
}
function cancelarEdicao () {
  editingId.value = null
  editForm.value = {}
}
async function salvarEdicao (row) {
  const payload = { ...editForm.value }

  if (!validarFormMorador(payload)) {
    return
  }
  try {
    await moradorStore.atualizar(row.id, payload)
    $q.notify({ type: 'positive', message: 'Morador atualizado com sucesso' })
    cancelarEdicao()
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: err?.response?.data?.message || 'Erro ao atualizar morador'
    })
  }
}
function removerMorador (row) {
  $q.dialog({
    title: 'Remover morador',
    message: `Deseja realmente remover o morador ${row.nome}?`,
    cancel: true,
    persistent: true,
    ok: {
      label: 'Sim, remover',
      color: 'negative'
    },
    cancelLabel: 'Cancelar'
  }).onOk(async () => {
    try {
      await moradorStore.remover(row.id)
      $q.notify({
        type: 'positive',
        message: 'Morador removido com sucesso'
      })
    } catch (err) {
      console.error(err)
      $q.notify({
        type: 'negative',
        message: err?.response?.data?.message || 'Erro ao remover morador'
      })
    }
  })
}
</script>

<template>
  <q-page class="q-pa-lg" style="background-color: #81C784">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <div class="text-h4 q-mr-sm">
          Cadastre o Morador
        </div>

        <div class="q-gutter-md" style="max-width: 323px">
          <q-input
            v-model="nome"
            label="Nome do Morador *"
            filled
            dense
            clearable
            append-inner-icon="person"
          />
          <q-input
            v-model="cpf"
            label="CPF *"
            filled
            dense
            clearable
            mask="###.###.###-##"
            append-inner-icon="badge"
          />
          <q-input
            v-model="telefone"
            label="Telefone *"
            filled
            dense
            clearable
            mask="(##) #####-####"
            append-inner-icon="phone"
          />
          <q-input
            v-model="email"
            label="E-mail"
            type="email"
            filled
            dense
            clearable
            append-inner-icon="email"
          />

          <div class="row q-gutter-sm q-mt-sm">
            <div class="text-subtitle2"></div>
            <q-checkbox
              v-model="inquilino"
              label="Inquilino"
              @update:model-value="val => { if (val) proprietario = false }"
            />
            <q-checkbox
              v-model="proprietario"
              label="Proprietário"
              @update:model-value="val => { if (val) inquilino = false }"
            />
          </div>
        </div>

        <div class="q-mt-xl">
          <q-btn
            label="SALVAR"
            color="positive"
            text-color="black"
            class="q-mr-lg"
            unelevated
            @click="salvarMorador"
          />
          <q-btn
            label="VOLTAR AO MENU"
            color="positive"
            text-color="black"
            class="btn-acao"
            @click="voltarMenu"
          />
        </div>
      </div>

      <!-- COLUNA DIREITA: CARD COM A TABELA -->
      <div class="col-12 col-md-8">
        <q-card flat class="card-verde">
          <q-card-section>
            <div class="q-pa-lg" style="background-color: #a5d6a7">Moradores</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="bg-green-4">
            <q-table
              :rows="moradorStore.lista"
              :columns="columns"
              row-key="id"
              color="green"
              table-header-class="bg-green-2"
              class="full-width"            >
              <!-- NOME -->
              <template #body-cell-nome="props">
                <q-td :props="props">
                  <template v-if="editingId === String(props.row.id)">
                    <q-input v-model="editForm.nome" dense outlined />
                  </template>
                  <template v-else>
                    {{ props.row.nome }}
                  </template>
                </q-td>
              </template>

              <!-- CPF -->
              <template #body-cell-cpf="props">
                <q-td :props="props">
                  <template v-if="editingId === String(props.row.id)">
                    <q-input v-model="editForm.cpf" dense outlined />
                  </template>
                  <template v-else>
                    {{ props.row.cpf }}
                  </template>
                </q-td>
              </template>

              <!-- TELEFONE -->
              <template #body-cell-telefone="props">
                <q-td :props="props">
                  <template v-if="editingId === String(props.row.id)">
                    <q-input v-model="editForm.telefone" dense outlined />
                  </template>
                  <template v-else>
                    {{ props.row.telefone }}
                  </template>
                </q-td>
              </template>

              <!-- EMAIL -->
              <template #body-cell-email="props">
                <q-td :props="props">
                  <template v-if="editingId === String(props.row.id)">
                    <q-input v-model="editForm.email" dense outlined />
                  </template>
                  <template v-else>
                    {{ props.row.email }}
                  </template>
                </q-td>
              </template>

              <!-- TIPO (INQUILINO / PROPRIETÁRIO) -->
              <template #body-cell-tipo="props">
                <q-td :props="props">
                  <template v-if="editingId === String(props.row.id)">
                    <div class="row items-center q-gutter-sm">
                      <q-checkbox
                        v-model="editForm.inquilino"
                        label="Inquilino"
                        @update:model-value="val => { if (val) editForm.proprietario = false }"
                      />
                      <q-checkbox
                        v-model="editForm.proprietario"
                        label="Proprietário"
                        @update:model-value="val => { if (val) editForm.inquilino = false }"
                      />
                    </div>
                  </template>
                  <template v-else>
                    {{
                      props.row.inquilino
                        ? 'Inquilino'
                        : props.row.proprietario
                          ? 'Proprietário'
                          : ''
                    }}
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
                      @click="removerMorador(props.row)"
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
.card-verde {
  background-color: #43a047 !important; /* Verde igual aos botões */
  border: none !important;
}

/* Deixa o título sem aquele fundo branco */
.card-verde .q-card__section {
  background-color: #43a047 !important;
  color: black !important;
}
</style>
