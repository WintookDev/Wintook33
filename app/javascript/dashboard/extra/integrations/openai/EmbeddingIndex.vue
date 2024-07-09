<template>
  <div>
    <div class="small-12 columns integrations-wrap">
      <div class="row integrations">
        <div class="small-12 columns integration">
          <div class="row">
            <div class="column">
              <embedding-header
                :search-query="searchQueryEmbedding"
                :search-trained="searchTrainedEmbedding"
                :on-input-search="onInputSearchEmbedding"
                :on-search-submit="onSearchSubmitEmbedding"
                :on-toggle-create="onToggleCreateEmbedding"
                :on-toggle-pages="onTogglePages"
                :on-toggle-trained-filter="onToggleTrainedFilter"
                :on-toggle-origen-filter="onToggleOrigenFilter"
                :on-toggle-update="onToggleUpdateEmbedding"
                :on-toggle-update-foro="onToggleUpdateForo"
                :similarity="similarity"
              />
            </div>
          </div>

          <div class="row">
            <div class="column">
              <table-footer
                @page-change="onPageChangeEmbedding"
                :current-page="Number(metaEmbedding.current_page)"
                :total-count="metaEmbedding.count"
                :page-size="metaEmbedding.page_size"
              />
            </div>
          </div>

          <div class="row">
            <div class="column" v-show="!showLoading">
              <embedding-table
                :data-table="dataEmbedding"
                :on-toggle-edit="onToggleTrained"
                :on-toggle-update="onToggleUpdate"
              />
            </div>
            <div class="column" style="padding: 3.2rem" v-show="showLoading">
              <div class="custom-loader"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <woot-modal :show.sync="showPrompts" :on-close="hidePrompts">
      <div class="h-auto overflow-auto flex flex-col">
        <woot-modal-header header-title="Titulo de Modal" />
        <form class="flex flex-col w-full" @submit.prevent="setContentPrompts()">
          <div class="w-full">
            <label>
              {{ "Prompts de Contenido" }}
              <textarea
                v-model.trim="dataSelectResponse.content_prompts"
                type="text"
                rows="8"
                :placeholder="'Describe los prompts de contenido...'"
              />
            </label>
          </div>
          <div class="flex flex-row justify-end gap-2 py-2 px-0 w-full">
            <woot-submit-button
              :button-text="$t('CANNED_MGMT.EDIT.FORM.SUBMIT')"
            />
            <button class="button clear" @click.prevent="onClose">
              {{ $t("CANNED_MGMT.EDIT.CANCEL_BUTTON_TEXT") }}
            </button>
          </div>
        </form>
      </div>
    </woot-modal>

  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

import Integration from "../../../routes/dashboard/settings/integrations/Integration";

import EmbeddingTable from "./EmbeddingTable";
import EmbeddingHeader from "./EmbeddingHeader";
import TableFooter from "dashboard/components/widgets/TableFooter";
import Modal from "../../../components/Modal.vue";
import WootSubmitButton from "../../../components/buttons/FormSubmitButton.vue";

const DEFAULT_PAGE = 1;

export default {
  data() {
    return {
      searchQueryEmbedding: "",
      searchTrainedEmbedding: 2,
      dataEmbedding: {},
      metaEmbedding: {},
      perPages: 10,
      trainedFilter: 2,
      origenFilter: 0,
      currentPage: 1,
      similarity: 0.85,
      showLoading: false,
      showPrompts: false,
      dataSelectResponse: {},
    };
  },
  components: {
    Integration,
    EmbeddingTable,
    EmbeddingHeader,
    TableFooter,
    Modal,
    WootSubmitButton
  },
  computed: {
    ...mapGetters({
      currentUser: "getCurrentUser",
    }),
  },
  mounted() {
    this.getEmbedding(DEFAULT_PAGE);
  },
  methods: {
    hidePrompts() {
      this.showPrompts = false;
    },
    onSearchSubmitEmbedding() {
      if (this.searchQueryEmbedding) {
        this.getEmbedding(DEFAULT_PAGE);
      }
    },

    onInputSearchEmbedding(event) {
      const newQuery = event.target.value;
      const refetchAll = !!this.searchQueryEmbedding && newQuery === "";
      this.searchQueryEmbedding = newQuery;
      if (refetchAll) {
        this.getEmbedding(DEFAULT_PAGE);
      }
    },

    onPageChangeEmbedding(current_page) {
      this.getEmbedding(current_page);
    },

    onToggleUpdateEmbedding() {
      this.searchQueryEmbedding = "";
      this.getEmbedding(DEFAULT_PAGE);
    },

    async onToggleUpdateForo() {
      const { access_token, account_id } = this.currentUser;
      const data = {
        access_token,
        account_id,
      };
      const response = await axios
        .post(process.env.URL_WEBHOOK + "/api/updateForo", { data })
        .then(function (resp) {
          return resp.data;
        })
        .catch(function (error) {
          return error;
        });

      if (response.status === 200) {
        this.getEmbedding(DEFAULT_PAGE);
      }
      bus.$emit("newToastMessage", response.message);
      return true;
    },

    async setContentPrompts() {
      const { access_token } = this.currentUser;
      const data = this.dataSelectResponse;
      const response = await axios
        .post(
          "https://devopenai.wintook.com/v1/responses/setContentPrompts",
          { data },
          {
            headers: {
              "Content-Type": "application/json",
              "access-token": access_token,
            },
          }
        )
        .then(function (response) {
          return response;
        })
        .catch(function (error) {
          return error;
        });

      if (response.status === 200) {
        bus.$emit("newToastMessage", response.data.message);
        this.getEmbedding(this.currentPage);
        this.showPrompts = false;
        return true;
      }
      const message =
        "Ocurrió un error al actualizar <<ContentPrompts>>.";
      bus.$emit("newToastMessage", message);
      this.showPrompts = false;
      return true;
    },

    async onToggleTrained(data) {
      const { access_token } = this.currentUser;
      const response = await axios
        .post(
          "https://devopenai.wintook.com/v1/responses/onToggleTrained",
          { data },
          {
            headers: {
              "Content-Type": "application/json",
              "access-token": access_token,
            },
          }
        )
        .then(function (response) {
          return response;
        })
        .catch(function (error) {
          return error;
        });

      if (response.status === 200) {
        bus.$emit("newToastMessage", response.data.message);
        this.getEmbedding(this.currentPage);
        return true;
      }
      const message =
        "Este documento no es posible entrenar, tal vez contiene demasiadas imágenes.";
      bus.$emit("newToastMessage", message);
      return true;
    },

    async onToggleUpdate(data) {
      this.showPrompts = true;
      this.dataSelectResponse = data;
      // const access_token = this.currentUser.access_token;
      // const response = await axios
      //   .post(
      //     "https://devopenai.wintook.com/v1/responses/onToggleUpdate",
      //     { data },
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //         "access-token": access_token,
      //       },
      //     }
      //   )
      //   .then(function (resp) {
      //     return resp.data;
      //   })
      //   .catch(function (error) {
      //     return error;
      //   });

      // if (response.status === 200) {
      //   this.getEmbedding(this.currentPage);
      //   bus.$emit("newToastMessage", response.message);
      //   return true;
      // }
      // // bus.$emit('newToastMessage', message);
      // // return true;
    },

    async getEmbedding(current_page) {
      const { access_token, account_id } = this.currentUser;
      const searchQuery = this.searchQueryEmbedding;
      const searchTrained = this.searchTrainedEmbedding;
      const perPages = this.perPages;
      const trainedFilter = this.trainedFilter;
      const origenFilter = this.origenFilter;

      this.showLoading = true;
      try {
        const response = await axios
          .post(
            "https://devopenai.wintook.com/v1/responses/getEmbedding",
            {
              account_id,
              current_page,
              searchQuery,
              searchTrained,
              perPages,
              trainedFilter,
              origenFilter,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "access-token": access_token,
              },
            }
          )
          .then(function (resp) {
            return resp;
          })
          .catch(function (error) {
            return error;
          });

        if (response.status === 200) {
          this.dataEmbedding = response.data.data;
          this.metaEmbedding = response.data.meta;
          this.currentPage = this.metaEmbedding.current_page;
          this.showLoading = false;
        } else {
          this.metaEmbedding = {};
          this.currentPage = 1;
          this.dataEmbedding = null;
          this.similarity = 0.0;
        }
      } catch (error) {
        console.error(
          "Error fetching getEmbedding:",
          error.response ? error.response.data : error.message
        );
      }

      // const options = {
      //   method: "GET",
      //   url: `https://devopenai.wintook.com/v1/responses/getEmbedding`,
      //   headers: {
      //     "access-token": access_token,
      //   },
      //   data: {
      //     account_id: 287,
      //   },
      // };

      // try {
      //   const response = await axios.request(options);
      //   if (response.status === 200) {
      //     // this.metaEmbedding = result.meta;
      //     // this.currentPage = this.metaEmbedding.current_page;
      //     this.dataEmbedding = response.data;
      //     this.showLoading = false;
      //     // this.similarity = result.data[0].similarity;
      //   } else {
      //     this.metaEmbedding = {};
      //     this.currentPage = 1;
      //     this.dataEmbedding = {};
      //     this.similarity = 0.0;
      //   }
      // } catch (error) {
      //   console.error(
      //     "Error fetching forums type:",
      //     error.response ? error.response.data : error.message
      //   );
      // }
    },

    async onTogglePages(event) {
      this.perPages = event.target.value;
      this.searchQueryEmbedding = "";
      this.getEmbedding(DEFAULT_PAGE);
    },
    async onToggleTrainedFilter(event) {
      this.trainedFilter = event.target.value;
      this.searchQueryEmbedding = "";
      this.getEmbedding(DEFAULT_PAGE);
    },
    async onToggleOrigenFilter(event) {
      this.origenFilter = event.target.value;
      this.searchQueryEmbedding = "";
      this.getEmbedding(DEFAULT_PAGE);
    },
  },
};
</script>

<style scoped lang="scss">
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

@import "~dashboard/assets/scss/variables";
</style>