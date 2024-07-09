<template>
  <div class="flex-1 overflow-auto p-4">
    <woot-button
      color-scheme="success"
      class-names="button--fixed-top"
      icon="add-circle"
      @click="openAddPopup()"
    >
      {{ $t("CANNED_MGMT.HEADER_BTN_TXT") }}
    </woot-button>

    <!-- List Canned Response -->
    <div class="flex flex-row gap-4">
      <div class="w-[60%]">
        <p
          v-if="!uiFlags.fetchingList && !records.length"
          class="flex h-full items-center flex-col justify-center"
        >
          {{ $t("CANNED_MGMT.LIST.404") }}
        </p>
        <woot-loading-state
          v-if="uiFlags.fetchingList"
          :message="$t('CANNED_MGMT.LOADING')"
        />

        <table
          v-if="!uiFlags.fetchingList && records.length"
          class="woot-table"
        >
          <thead>
            <!-- Header -->
            <th
              v-for="thHeader in $t('CANNED_MGMT.LIST.TABLE_HEADER')"
              :key="thHeader"
            >
              {{ thHeader }}
            </th>
          </thead>
          <tbody>
            <tr
              v-for="(cannedItem, index) in records"
              :key="cannedItem.short_code"
            >
              <!-- Short Code  -->
              <td class="w-[8.75rem]">
                {{ cannedItem.short_code }}
              </td>
              <!-- Content -->
              <td class="break-all whitespace-normal">
                {{ cannedItem.content }}
              </td>
              <!-- Action Buttons -->
              <td class="button-wrapper">
                <woot-button
                  v-tooltip.top="$t('CANNED_MGMT.EDIT.BUTTON_TEXT')"
                  variant="smooth"
                  size="tiny"
                  color-scheme="secondary"
                  icon="edit"
                  @click="openEditPopup(cannedItem)"
                />
                <woot-button
                  v-tooltip.top="$t('CANNED_MGMT.DELETE.BUTTON_TEXT')"
                  variant="smooth"
                  color-scheme="alert"
                  size="tiny"
                  icon="dismiss-circle"
                  class-names="grey-btn"
                  :is-loading="loading[cannedItem.id]"
                  @click="openDeletePopup(cannedItem, index)"
                />

                <!-- Andrés Liverio 100823 **Wintook** -->
                <woot-button
                  v-show="cannedItem.trained"
                  v-tooltip.top="'Eliminar Entrenamiento!'"
                  variant="smooth"
                  color-scheme="success"
                  size="tiny"
                  icon="chat-multiple"
                  class-names="grey-btn"
                  :is-loading="loading[cannedItem.id]"
                  @click="setTraining(cannedItem, index)"
                />
                <woot-button
                  v-show="!cannedItem.trained"
                  v-tooltip.top="'Generar Entrenamiento'"
                  variant="smooth"
                  color-scheme="alert"
                  size="tiny"
                  icon="chat-multiple"
                  class-names="grey-btn"
                  :is-loading="loading[cannedItem.id]"
                  @click="setTraining(cannedItem, index)"
                />
                <!-- Andrés Liverio 100823 **Wintook** -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="w-[34%]">
        <span v-dompurify-html="$t('CANNED_MGMT.SIDEBAR_TXT')" />
      </div>
    </div>
    <!-- Add Agent -->
    <woot-modal :show.sync="showAddPopup" :on-close="hideAddPopup">
      <add-canned :on-close="hideAddPopup" />
    </woot-modal>

    <!-- Edit Canned Response -->
    <woot-modal :show.sync="showEditPopup" :on-close="hideEditPopup">
      <edit-canned
        v-if="showEditPopup"
        :id="selectedResponse.id"
        :edshort-code="selectedResponse.short_code"
        :edcontent="selectedResponse.content"
        :edcontent-prompts="selectedResponse.content_prompts"
        :on-close="hideEditPopup"
      />
    </woot-modal>

    <!-- Delete Canned Response -->
    <woot-delete-modal
      :show.sync="showDeleteConfirmationPopup"
      :on-close="closeDeletePopup"
      :on-confirm="confirmDeletion"
      :title="$t('CANNED_MGMT.DELETE.CONFIRM.TITLE')"
      :message="$t('CANNED_MGMT.DELETE.CONFIRM.MESSAGE')"
      :message-value="deleteMessage"
      :confirm-text="deleteConfirmText"
      :reject-text="deleteRejectText"
    />
  </div>
</template>
<script>
// <!-- Andrés Liverio 100823 **Wintook** -->
import axios from "axios";
// <!-- Andrés Liverio 100823 **Wintook** -->
import { mapGetters } from "vuex";
import AddCanned from "./AddCanned.vue";
import EditCanned from "./EditCanned.vue";

export default {
  components: {
    AddCanned,
    EditCanned,
  },
  data() {
    return {
      loading: {},
      showAddPopup: false,
      showEditPopup: false,
      showDeleteConfirmationPopup: false,
      selectedResponse: {},
      cannedResponseAPI: {
        message: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      records: "getCannedResponses",
      uiFlags: "getUIFlags",
      currentUser: "getCurrentUser", // <!-- Andrés Liverio 100823 **Wintook** -->
    }),
    // Delete Modal
    deleteConfirmText() {
      return `${this.$t("CANNED_MGMT.DELETE.CONFIRM.YES")} ${
        this.selectedResponse.short_code
      }`;
    },
    deleteRejectText() {
      return `${this.$t("CANNED_MGMT.DELETE.CONFIRM.NO")} ${
        this.selectedResponse.short_code
      }`;
    },
    deleteMessage() {
      return ` ${this.selectedResponse.short_code}?`;
    },
  },
  mounted() {
    // Fetch API Call
    this.$store.dispatch("getCannedResponse");
  },
  methods: {
    showAlert(message) {
      // Reset loading, current selected agent
      this.loading[this.selectedResponse.id] = false;
      this.selectedResponse = {};
      // Show message
      this.cannedResponseAPI.message = message;
      bus.$emit("newToastMessage", message);
    },
    // Edit Function
    openAddPopup() {
      this.showAddPopup = true;
    },
    hideAddPopup() {
      this.showAddPopup = false;
    },

    // Edit Modal Functions
    openEditPopup(response) {
      this.showEditPopup = true;
      this.selectedResponse = response;
    },
    hideEditPopup() {
      this.showEditPopup = false;
    },

    // Delete Modal Functions
    openDeletePopup(response) {
      this.showDeleteConfirmationPopup = true;
      this.selectedResponse = response;
    },
    closeDeletePopup() {
      this.showDeleteConfirmationPopup = false;
    },
    // Set loading and call Delete API
    confirmDeletion() {
      this.loading[this.selectedResponse.id] = true;
      this.closeDeletePopup();
      this.deleteCannedResponse(this.selectedResponse.id);
    },
    deleteCannedResponse(id) {
      this.$store
        .dispatch("deleteCannedResponse", id)
        .then(() => {
          this.showAlert(this.$t("CANNED_MGMT.DELETE.API.SUCCESS_MESSAGE"));
        })
        .catch((error) => {
          const errorMessage =
            error?.message || this.$t("CANNED_MGMT.DELETE.API.ERROR_MESSAGE");
          this.showAlert(errorMessage);
        });
    },

    // <!-- Andrés Liverio 100823 **Wintook** -->
    async setTraining(data) {
      const { access_token } = this.currentUser;
      const { id } = data;
      const url = "https://devopenai.wintook.com";
      const options = {
        method: "POST",
        url: `${url}/v1/responses/setTraining/${id}`,
        headers: {
          "access-token": access_token,
        },
      };

      try {
        const response = await axios.request(options);
        console.log(response.data);
        data.trained = response.data.trained;
        return response.data;
      } catch (error) {
        console.error("Error occurred:", error.message || error);
        throw error;
      }
    },
    // <!-- Andrés Liverio 100823 **Wintook** -->
  },
};
</script>
