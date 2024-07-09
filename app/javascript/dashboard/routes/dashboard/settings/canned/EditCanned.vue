<template>
  <modal :show.sync="show" :on-close="onClose">
    <div class="h-auto overflow-auto flex flex-col">
      <woot-modal-header :header-title="pageTitle" />
      <form class="flex flex-col w-full" @submit.prevent="editCannedResponse()">
        <div class="w-full">
          <label :class="{ error: $v.shortCode.$error }">
            {{ $t("CANNED_MGMT.EDIT.FORM.SHORT_CODE.LABEL") }}
            <input
              v-model.trim="shortCode"
              type="text"
              :placeholder="$t('CANNED_MGMT.EDIT.FORM.SHORT_CODE.PLACEHOLDER')"
              @input="$v.shortCode.$touch"
            />
          </label>
        </div>

        <div class="w-full">
          <label :class="{ error: $v.content.$error }">
            {{ $t("CANNED_MGMT.EDIT.FORM.CONTENT.LABEL") }}
          </label>
          <div class="editor-wrap">
            <woot-message-editor
              v-model="content"
              class="message-editor"
              :class="{ editor_warning: $v.content.$error }"
              :enable-variables="true"
              :enable-canned-responses="false"
              :placeholder="$t('CANNED_MGMT.EDIT.FORM.CONTENT.PLACEHOLDER')"
              @blur="$v.content.$touch"
            />
          </div>
        </div>

        <div class="w-full">
          <label>
            {{'Prompts de Contenido'}}
            <textarea
              v-model.trim="content_prompts"
              type="text"
              rows="5"
              :placeholder="'Describe los prompts de contenido...'"
            />
          </label>
        </div>

        <!-- Andrés Liverio 020822 **Wintook** -->
        <div class="medium-12 columns">
          <input v-model="opcMenu" type="checkbox" :checked="opcMenu" />
          <label>
            {{ "Mostrar como opción de Menú." }}
          </label>
        </div>

        <div class="medium-12 columns">
          <label>
            {{ "Número de opción del menú." }}
          </label>
          <input
            type="number"
            step="1"
            min="3"
            max="99"
            v-model="noOptionMenu"
            style="width: 150px"
            :disabled="!opcMenu"
          />
        </div>

        <div class="medium-12 columns">
          <input v-model="contentFull" type="checkbox" :checked="contentFull" />
          <label>
            {{ "Mostrar el contenido completo en el resultado de la búsqueda" }}
          </label>
        </div>

        <div class="medium-12 columns">
          <input v-model="urlContent" type="checkbox" :checked="urlContent" />
          <label>
            {{ "Agregar link de dirección web alternativa" }}
          </label>
        </div>

        <div class="medium-12 columns" v-show="urlContent">
          <label>
            {{ "Link de direccón web alternativa" }}
            <input
              v-model.trim="urlShortCode"
              type="url"
              placeholder="'Por favor, Introduzca una dirección web'"
            />
          </label>
        </div>
        <!-- Andrés Liverio 020822 **Wintook** -->

        <div class="flex flex-row justify-end gap-2 py-2 px-0 w-full">
          <woot-submit-button
            :disabled="
              $v.content.$invalid ||
              $v.shortCode.$invalid ||
              editCanned.showLoading
            "
            :button-text="$t('CANNED_MGMT.EDIT.FORM.SUBMIT')"
            :loading="editCanned.showLoading"
          />
          <button class="button clear" @click.prevent="onClose">
            {{ $t("CANNED_MGMT.EDIT.CANCEL_BUTTON_TEXT") }}
          </button>
        </div>
      </form>
    </div>
  </modal>
</template>

<script>
// <!-- Andrés Liverio 020822 **Wintook** -->
import axios from "axios";
// <!-- Andrés Liverio 020822 **Wintook** -->

/* eslint no-console: 0 */
import { required, minLength } from "vuelidate/lib/validators";
import WootMessageEditor from "dashboard/components/widgets/WootWriter/Editor.vue";
import WootSubmitButton from "../../../../components/buttons/FormSubmitButton.vue";
import alertMixin from "shared/mixins/alertMixin";
import Modal from "../../../../components/Modal.vue";

export default {
  components: {
    WootSubmitButton,
    Modal,
    WootMessageEditor,
  },
  mixins: [alertMixin],
  props: {
    id: { type: Number, default: null },
    edcontent: { type: String, default: "" },
    edshortCode: { type: String, default: "" },
    edcontentPrompts: { type: String, default: "" },
    onClose: { type: Function, default: () => {} },
  },
  data() {
    return {
      editCanned: {
        showAlert: false,
        showLoading: false,
      },
      shortCode: this.edshortCode,
      content: this.edcontent,
      show: true,

      // <!-- Andrés Liverio 020822 **Wintook** -->
      urlShortCode: "",
      content_prompts: this.edcontentPrompts,
      contentFull: false,
      urlContent: false,
      opcMenu: false,
      noOptionMenu: 0,
      // <!-- Andrés Liverio 020822 **Wintook** -->
    };
  },
  validations: {
    shortCode: {
      required,
      minLength: minLength(2),
    },
    content: {
      required,
    },
  },
  computed: {
    pageTitle() {
      return `${this.$t("CANNED_MGMT.EDIT.TITLE")} - ${this.edshortCode}`;
    },
  },

  mounted() {
    this.getCannedReponse();
  },

  methods: {
    setPageName({ name }) {
      this.$v.content.$touch();
      this.content = name;
    },
    resetForm() {
      this.shortCode = "";
      this.content = "";
      this.$v.shortCode.$reset();
      this.$v.content.$reset();
    },
    editCannedResponse() {
      // Show loading on button
      this.editCanned.showLoading = true;
      // Make API Calls
      this.$store
        .dispatch("updateCannedResponse", {
          id: this.id,
          short_code: this.shortCode,
          content: this.content,
          content_prompts: this.content_prompts,
        })
        .then(() => {
          // Reset Form, Show success message
          this.setCannedReponse(); // <!-- Andrés Liverio 020822 **Wintook** -->
          this.editCanned.showLoading = false;
          this.showAlert(this.$t("CANNED_MGMT.EDIT.API.SUCCESS_MESSAGE"));
          this.resetForm();
          setTimeout(() => {
            this.onClose();
          }, 10);
        })
        .catch((error) => {
          this.editCanned.showLoading = false;
          const errorMessage =
            error?.message || this.$t("CANNED_MGMT.EDIT.API.ERROR_MESSAGE");
          this.showAlert(errorMessage);
        });
    },

    // <!-- Andrés Liverio 020822 **Wintook** -->
    async setCannedReponse() {
      let id = this.id;
      let account_id = this.account_id;
      let url_short_code = this.urlShortCode;
      let content_full = this.contentFull;
      let url_content = this.urlContent;
      let opcMenu = this.opcMenu;
      let noOptionMenu = this.noOptionMenu;

      let response = await axios
        .post(process.env.URL_WEBHOOK + "/api/setCannedReponse", {
          params: {
            id: id,
            account_id: account_id,
            url_short_code: url_short_code,
            content_full: content_full,
            url_content: url_content,
            opcMenu: opcMenu,
            noOptionMenu: noOptionMenu,
          },
        })
        .then(function (resp) {
          return resp.data;
        })
        .catch(function (error) {
          return error;
        });

      if (response.status === 400) {
        bus.$emit("newToastMessage", response.status.message);
      }
    },

    async getCannedReponse() {
      let id = this.id;
      let response = await axios
        .get(process.env.URL_WEBHOOK + "/api/getCannedReponse", {
          params: {
            id: id,
          },
        })
        .then(function (resp) {
          return resp.data;
        })
        .catch(function (error) {
          return error;
        });
      if (response.status == 200) {
        this.urlShortCode = response.data.url_short_code;
        this.contentFull = response.data.content_full;
        this.urlContent = response.data.url_content;
        this.opcMenu = response.data.menu;
        this.noOptionMenu = response.data.opcion;
      }
    },

    onChange() {},
    // <!-- Andrés Liverio 020822 **Wintook**-->
  },
};
</script>
<style scoped lang="scss">
::v-deep {
  .ProseMirror-menubar {
    @apply hidden;
  }

  .ProseMirror-woot-style {
    @apply min-h-[12.5rem];

    p {
      @apply text-base;
    }
  }
}
</style>
