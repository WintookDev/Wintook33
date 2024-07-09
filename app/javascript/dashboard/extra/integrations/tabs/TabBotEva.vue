<template>
  <div v-if="selectedTabIndex === 1" class="flex flex-col">
    <div class="bg-white dark:bg-slate-800 border border-solid border-slate-75 dark:border-slate-700/50 rounded-sm mb-4 p-4">

      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div class="flex items-center justify-start m-0 mx-4 flex-1">
          <img src="https://api-dev.wintook.com/img/wintook/logo_thumbnail.svg" class="p-2 h-16 w-16 mr-4" />
          <div>
            <h3 class="text-xl text-slate-800 dark:text-slate-100">
              {{ "Bot Eva" }}
            </h3>
            <p>
              {{ "Permite gestionar consultas por medio de palabras reservadas a sistemas administrativos y palabras no reservadas a blogs, todo esto por medio de los canales de comunicación Web y Telegram."}}
            </p>
          </div>
        </div>
        <div class="flex justify-center items-center mb-0 w-[15%]">
          <button @click="conectarEva" class="button nice" ref="conectorEva">
            {{ this.estadoEva }}
          </button>
        </div>
      </div>

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div class="flex items-center justify-start m-0 mx-4 flex-1">
          <div>
            <p>
              <BlogsEva />
            </p>
          </div>
          <div class="flex justify-center items-center mb-0 w-[15%]">
            <button @click="conectarEva" class="button nice" ref="conectorEva">
              {{ 'Guardar Etiquetas' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
import BlogsEva from "./BlogsEva";
// import AppTokenApi from "./AppTokenApi.vue";

export default {
  data() {
    return {
      conectadoEva: false,
      cuentasBlog: {},
      estadoEva: "Iniciar",
      catalogoBlogs: {},

      api_key_gpt: "",
      modelo_gpt: "",
      maxtoken_gpt: 50,
      modelos_gpt: {},
    };
  },

  components: {
    BlogsEva,
    // AppTokenApi,
  },

  props: {
    selectedTabIndex: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    ...mapGetters({
      currentUser: "getCurrentUser",
    }),
  },

  mounted() {
    this.getCuentasBlog();
    this.getModelosGPT();
    this.initializeData();
  },

  methods: {
    async initializeData() {
      // this.getCuentasBlog();
      this.getChatGTP();
      let token = this.currentUser.access_token;
      let conectado = await axios
        .get(process.env.URL_WEBHOOK + "/api/getConexionEva", {
          params: { token: token },
        })
        .then(function (resp) {
          return resp.data;
        })
        .catch(function (error) {
          return error;
        });
      this.conectadoEva = conectado.status;

      if (this.conectadoEva) {
        this.estadoEva = "Detener";
      } else {
        this.estadoEva = "Iniciar";
      }

      this.cuenta_blog_url = "";
      this.submitCuentaBlog = "Iniciar";
      this.activoSubmitCuentaBlog = false;
      this.activoInputCuentaBlogUrl = false;

      let result = await axios
        .get(process.env.URL_WEBHOOK + "/api/getCatalogoBlogs", {})
        .then(function (resp) {
          return resp.data;
        })
        .catch(function (error) {
          return error;
        });
      this.catalogoBlogs = result;
    },

    async getCuentasBlog() {
      const token = this.currentUser.access_token;
      const response = await axios
        .get(process.env.URL_WEBHOOK + "/api/getCuentasBlog", {
          params: { token: token },
        })
        .then(function (resp) {
          return resp.data;
        })
        .catch(function (error) {
          return error;
        });
      if (response.status === 200) {
        this.cuentasBlog = response.data;
      }
    },

    async setChatGTP() { },

    async conectarEva() {
      const token = this.currentUser.access_token;
      const conectado = await axios
        .get(process.env.URL_WEBHOOK + "/api/setConexionEva", {
          params: { token: token },
        })
        .then(function (resp) {
          return resp.data;
        })
        .catch(function (error) {
          return error;
        });
      this.conectadoEva = conectado.status;

      if (this.conectadoEva) {
        this.estadoEva = "Detener";
      } else {
        this.estadoEva = "Iniciar";
      }
    },

    async setChatGTP() {
      const { access_token, account_id } = this.currentUser;
      const api_key_gpt = this.api_key_gpt;
      const modelo_gpt = this.modelo_gpt;
      const maxtoken_gpt = this.maxtoken_gpt;
      const result = await axios
        .post(process.env.URL_WEBHOOK + "/api/setChatGTP", {
          params: {
            access_token,
            account_id,
            api_key_gpt,
            modelo_gpt,
            maxtoken_gpt,
          },
        })
        .then(function (resp) {
          return resp.data;
        })
        .catch(function (error) {
          return error;
        });

      if (result.status === 200) {
        bus.$emit("newToastMessage", result.toastMessage);
      }
    },

    async getChatGTP() {
      const { access_token, account_id } = this.currentUser;

      const result = await axios
        .get(process.env.URL_WEBHOOK + "/api/getChatGTP", {
          params: { access_token, account_id },
        })
        .then(function (resp) {
          return resp.data;
        })
        .catch(function (error) {
          return error;
        });

      if (result.status === 200) {
        this.api_key_gpt = result.api_key_gpt;
        this.modelo_gpt = result.modelo_gpt;
        this.maxtoken_gpt = result.maxtoken_gpt;
      }
    },

    async getModelosGPT() {
      const { access_token, account_id } = this.currentUser;

      const result = await axios
        .get(process.env.URL_WEBHOOK + "/api/getModelosGPT", {
          params: { access_token, account_id },
        })
        .then(function (resp) {
          return resp.data;
        })
        .catch(function (error) {
          return error;
        });

      if (result.status === 200) {
        this.modelos_gpt = result.models;
      }
    },
  },
};
</script>
