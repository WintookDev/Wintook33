<template>
  <div v-if="selectedTabIndex === 5" class="flex flex-col">
    <div
      class="bg-white dark:bg-slate-800 border border-solid border-slate-75 dark:border-slate-700/50 rounded-sm mb-4 p-4"
    >
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center"
      >
        <div class="flex items-center justify-start m-0 mx-4 flex-1">
          <img
            src="https://api-dev.wintook.com/img/wintook/logo_thumbnail.svg"
            class="p-2 h-16 w-16 mr-4"
          />
          <div>
            <h3 class="text-xl text-slate-800 dark:text-slate-100">
              Entrenamiento de EvaBot
            </h3>
            <p>
              Una incrustación es un vector (lista) de números de coma flotante.
              La distancia entre dos vectores mide su relación. Las distancias
              pequeñas sugieren una relación alta y las distancias grandes
              sugieren una relación baja.
            </p>
          </div>

          <div class="flex justify-center items-center mb-0 w-[15%]">
            <button @click="addDataResource" class="button nice">
              Configurar Entrenamiento
            </button>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center"
      >
        <div class="flex items-center justify-start m-0 mx-4 flex-1">
          <div class="flex justify-center items-center mb-0">
            <embedding-index />
          </div>
        </div>
      </div>
    </div>
    <woot-modal :show.sync="showDataResource" :on-close="hideDataResource">
      <DataResourceForm
        :on-close="hideDataResource"
        :data-resource="dataResource"
        :forums-type="forumsType"
      />
    </woot-modal>
  </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
import DataResourceForm from "./DataResourceForm";
import EmbeddingIndex from "./EmbeddingIndex";

export default {
  data() {
    return {
      showDataResource: false,
      dataResource: {},
      forumsType: {},
    };
  },

  components: {
    DataResourceForm,
    EmbeddingIndex,
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
    this.getForumsType();
  },

  methods: {
    hideDataResource() {
      this.showDataResource = false;
    },

    addDataResource() {
      const { account_id } = this.currentUser;
      this.dataResource = {
        id: 0,
        account_id: account_id,
        forum_type_id: 0,
        forum_account: "",
        forum_url: "",
      };
      this.showDataResource = true;
    },

    onToggleShow(data) {
      this.showDataResource = data;
    },

    async getForumsType() {
      const { access_token } = this.currentUser;
      const options = {
        method: "GET",
        url: "https://devopenai.wintook.com/v1/responses/getForumsType",
        headers: {
          "access-token": access_token,
        },
      };

      try {
        const response = await axios.request(options);
        this.forumsType = response.data
      } catch (error) {
        console.error(
          "Error fetching forums type:",
          error.response ? error.response.data : error.message
        );
      }
    },
  },
  // computed: {
  //     ...mapGetters({
  //     integrationsList: 'integrations/getIntegrations',
  //     currentUser: 'getCurrentUser',
  //     }),

  // },

  // methods: {
  //     async setCuentaApi(){
  //         const { access_token, account_id } = this.currentUser;
  //         const api_type  = this.api_type;
  //         const api_access_token = this.api_access_token;
  //         const api_url_base  = this.api_url_base;
  //         const result = await axios.post(process.env.URL_WEBHOOK+'/api/setCuentasApi', {
  //             access_token, account_id, api_type, api_access_token, api_url_base,
  //         })
  //         .then(function (resp) { return resp.data; })
  //         .catch(function (error) { return error; });
  //         this.modoReadOnly = true;
  //         bus.$emit('newToastMessage', result.msg);
  //     },

  //     async getCuentaApi(){
  //         const { access_token, account_id } = this.currentUser;
  //         let result = await axios.get(process.env.URL_WEBHOOK+'/api/getCuentasApi', {
  //             params: {
  //                 access_token : access_token,
  //                 account_id     : account_id,
  //             }
  //         })
  //         .then(function (resp) { return resp.data; })
  //         .catch(function (error) { return error; });
  //         if (result.status === 200) {
  //             this.apps = result.apps;
  //             this.api_access_token  = result.api_access_token;
  //             this.api_url_base = result.api_url_base;
  //             this.api_type = result.api_type;
  //             this.modoReadOnly = true;
  //         }
  //     },

  //     async editCuentaApi(){
  //         this.modoReadOnly = false;
  //     },

  //     async deleteCuentaApi(){
  //         this.api_type =  0;
  //         this.api_url_base = "";
  //         this.api_access_token = "";
  //         this.setCuentaApi();
  //         this.modoReadOnly = false;

  //     },

  // }
};
</script>

<style scoped></style>
