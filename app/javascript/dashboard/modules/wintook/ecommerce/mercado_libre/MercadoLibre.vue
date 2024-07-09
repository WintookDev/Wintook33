<template>
    <div>
  
      <div class="w-[65%] flex-shrink-0 flex-grow-0 max-w-[65%]">
        <label>
          {{ 'App ID' }}
          <input
            v-model.trim="app_id"
            type="text"
            :placeholder=" 'App Id Mercado Libre' "
          />
        </label>
        <p class="help-text">
          {{ 'App Id de Aplicación de Mercado Libre' }}
        </p>
      </div>
  
      <div class="w-[65%] flex-shrink-0 flex-grow-0 max-w-[65%]">
        <label>
          {{ 'Client Secret' }}
          <input
            v-model.trim="client_secret"
            type="text"
            :placeholder=" 'Client Secret Mercado Libre' "
          />
        </label>
        <p class="help-text">
          {{ 'Client Secret de Aplicación de Mercado Libre' }}
        </p>
      </div>
  
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        app_id: "",
        client_secret: "",
      };
    },
  };
  </script>