<template>
  <div>
    <div class="w-[65%] flex-shrink-0 flex-grow-0 max-w-[65%]">
      <label class="w-full">
        {{ "E-Commerce API" }}
        <select v-model="commerce" @change="onChange()">
          <option value="NA">
            {{ "Deshabilitado" }}
          </option>
          <option value="ML">
            {{ "Mercado Libre" }}
          </option>
        </select>
        <p class="help-text">
          {{
            "Canal que permite dar respuesta a las preguntas hechas por los usuarios de la plataforma de E-Commerce."
          }}
        </p>
      </label>
    </div>

    <mercado-libre v-if="commerce === 'ML'"></mercado-libre>
  </div>
</template>
<script>
import MercadoLibre from "./mercado_libre/MercadoLibre.vue";

export default {
  components: {
    MercadoLibre,
  },
  data() {
    return {
      commerce: 'NA',
    };
  },
  methods: {
    onChange() {
      console.log(this.commerce);
    },
  },
};
</script>
