<template>
  <woot-modal :show.sync="show" :on-close="onClose">
    <div class="column content-box">
      <woot-modal-header
        :header-title="'OpenAI - Origen de Datos'"
        :header-content="'Entrenamiento de origenes de datos para ChatGPT.'"
      />
      <form @submit.prevent="onSubmit" v-show="!showLoading">
        <label>
          <input type="hidden" v-model="dataResource.id" />
        </label>

        <label>
          {{ "Descripción de Origen de Datos" }}
          <input type="text" v-model="dataResource.forum_account" />
        </label>

        <label>
          {{ "Origen de Datos" }}
          <select v-model="dataResource.forum_type_id" id="optDataResourceType">
            <option :value="0">{{ "Seleccione Origen de Datos" }}</option>
            <option v-for="od in this.forumsType" :key="od.id" :value="od.id">
              {{ od.forum_type }}
            </option>
          </select>
          <!-- <input type="text" :value="od.path" /> -->
        </label>

        <label :class="{}">
          {{ "Dirección URL de Origen de Datos" }}
          <input type="url" v-model="dataResource.forum_url" />
        </label>

        <woot-button
          type="submit"
          :is-disabled="
            !dataResource.forum_url ||
            !dataResource.forum_account ||
            !dataResource.forum_type_id
          "
        >
          {{ " Guardar " }}
        </woot-button>

        <woot-button class="button clear" @click.prevent="onClose">
          {{ " Cancelar " }}
        </woot-button>
      </form>
    </div>
    <div class="column" style="padding: 3.2rem" v-show="showLoading">
      <label>
        {{ "Cargando información a la Base de Datos, espere por favor..." }}
      </label>
      <div class="custom-loader"></div>
    </div>
  </woot-modal>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      show: true,
      showLoading: false,
    };
  },

  props: {
    showDataResource: { type: Boolean, default: false },
    forumsType: { type: Array, default: () => [] },
    dataResource: { type: Array, default: () => [] },
    onToggleShow: { type: Function, default: (data) => {} },
    onClose: {
      type: Function,
      default: () => {},
    },
  },

  computed: {
    ...mapGetters({
      currentUser: "getCurrentUser",
    }),
  },

  methods: {
    async onSubmit() {
      const { access_token, account_id} = this.currentUser;
      const dataBody = this.dataResource;
      this.showLoading = true;
      const options = {
        method: "PUT",
        url: "https://devopenai.wintook.com/v1/responses/ForumAccount",
        headers: {
          "access-token": access_token,
          "Content-Type": "application/json",
        },
        data: dataBody,
      };

      try {
        const response = await axios.request(options);
        if (response.status === 500){
          bus.$emit('newToastMessage', response.data);
        }
        if (response.status === 200){
          this.showLoading = false;
          this.show = false;
          bus.$emit('newToastMessage', response.data);
        }
      } catch (error) {
        bus.$emit(
          "Error updating forum account:",
          error.response ? error.response.data : error.message
        );
      }

      // const response = await axios
      //   .post(process.env.URL_WEBHOOK + "/api/setResource", params)
      //   .then(function (response) {
      //     return response.data;
      //   })
      //   .catch(function (error) {
      //     return error;
      //   });
      // if (response.status === 400){
      //   bus.$emit('newToastMessage', response.message);
      // }
      // if (response.status === 200){
      //   this.showLoading = false;
      //   this.show = false;
      //   bus.$emit('newToastMessage', response.message);
      // }
    },

    // changeDataResource(event) {
    //   this.urlPath =
    //     event.target.options[event.target.options.selectedIndex].getAttribute(
    //       "data-path"
    //     );
    // },

    getDataPath() {
      let element = document.getElementById("optDataResourceType");
      return element.options[element.selectedIndex].getAttribute("data-path");
    },
  },
};
</script>

<style scoped>
.custom-loader {
  width: 100%;
  height: 20px;
  background: linear-gradient(90deg, #0000, #a722f4) left -50px top 0/50px 20px no-repeat
    #e4e4ed;
  animation: ct2 1s infinite linear;
}

@keyframes ct2 {
  100% {
    background-position: right -50px top 0;
  }
}
</style>