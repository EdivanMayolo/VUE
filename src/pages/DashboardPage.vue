<template>
  <q-page class="q-pa-lg" style="background-color: #A5D6A7">
    <div class="row q-col-gutter-lg">

      <!-- Coluna esquerda (gráficos grandes) -->
      <div class="col-12 col-md-8">
        <!-- Apartamentos Vagos -->
        <q-card class="q-pa-md q-mb-lg card-dark">
          <div class="text-h5 q-mb-md">Apartamentos Vagos</div>
          <div class="row justify-center">
            <div class="donut-placeholder">
              90%
            </div>
          </div>
        </q-card>

        <!-- Boletos em Aberto -->
        <q-card class="q-pa-md card-dark">
          <div class="text-h5 q-mb-md">Boletos em Aberto</div>
          <div class="row justify-center">
            <div class="pie-placeholder" />
          </div>
        </q-card>
      </div>

      <!-- Coluna direita (cards menores) -->
      <div class="col-12 col-md-4">
        <!-- Valor em Caixa -->
        <q-card class="q-pa-md q-mb-lg card-dark">
          <div class="text-subtitle1">Valor em Caixa</div>
          <div class="text-caption text-grey-4">$ 8900,70</div>

          <div class="bar-placeholder q-mt-md" />
        </q-card>

        <!-- Gasto de Água -->
        <q-card class="q-pa-md card-dark">
          <div class="text-subtitle1 q-mb-md">Gasto de Água</div>
          <div class="bar-vertical-placeholder" />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
</script>

<style scoped>
.bg-dark {
  background: #212121;
}

.card-dark {
  background: #333;
  border-radius: 16px;
}

/* Donut fake só pra layout */
.donut-placeholder {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  border: 40px solid #66e0a3;
  border-top-color: #ff9ca2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: bold;
  color: #66e0a3;
}

/* Pizza fake */
.pie-placeholder {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: conic-gradient(
    #4c6fff 0 150deg,
    #36d1c4 150deg 240deg,
    #ffd54f 240deg 300deg,
    #ff8a80 300deg 360deg
  );
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

/* Barras horizontais fake */
.bar-placeholder {
  width: 100%;
  height: 120px;
  border-radius: 12px;
  background: linear-gradient(180deg, #ffffff33, #ffffff11);
}

/* Barras verticais fake */
.bar-vertical-placeholder {
  width: 100%;
  height: 200px;
  border-radius: 50px;
  background:
    repeating-linear-gradient(
      to right,
      #1e3cff,
      #1e3cff 20px,
      transparent 12px,
      transparent 36px
    );
  opacity: 0.9;
}
</style>
