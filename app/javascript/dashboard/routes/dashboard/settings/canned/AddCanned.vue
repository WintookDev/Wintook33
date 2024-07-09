<template>
  <modal :show.sync="show" :on-close="onClose">
    <div class="h-auto overflow-auto flex flex-col">
      <woot-modal-header
        :header-title="$t('CANNED_MGMT.ADD.TITLE')"
        :header-content="$t('CANNED_MGMT.ADD.DESC')"
      />
      <form class="flex flex-col w-full" @submit.prevent="addCannedResponse()">
        <div class="w-full">
          <label :class="{ error: $v.shortCode.$error }">
            {{ $t('CANNED_MGMT.ADD.FORM.SHORT_CODE.LABEL') }}
            <input
              v-model.trim="shortCode"
              type="text"
              :placeholder="$t('CANNED_MGMT.ADD.FORM.SHORT_CODE.PLACEHOLDER')"
              @input="$v.shortCode.$touch"
            />
          </label>
        </div>

        <div class="w-full">
          <label :class="{ error: $v.content.$error }">
            {{ $t('CANNED_MGMT.ADD.FORM.CONTENT.LABEL') }}
          </label>
          <div class="editor-wrap">
            <woot-message-editor
              v-model="content"
              class="message-editor"
              :class="{ editor_warning: $v.content.$error }"
              :enable-variables="true"
              :enable-canned-responses="false"
              :placeholder="$t('CANNED_MGMT.ADD.FORM.CONTENT.PLACEHOLDER')"
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
            {{ "Número de opción del  menú." }}
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
              addCanned.showLoading
            "
            :button-text="$t('CANNED_MGMT.ADD.FORM.SUBMIT')"
            :loading="addCanned.showLoading"
          />
          <button class="button clear" @click.prevent="onClose">
            {{ $t('CANNED_MGMT.ADD.CANCEL_BUTTON_TEXT') }}
          </button>
        </div>
      </form>
    </div>
  </modal>
</template>

<script>

// **Wintook** 100823
import axios from "axios";
import { mapGetters } from "vuex";
// **Wintook** 100823

import { required, minLength } from 'vuelidate/lib/validators';

import WootSubmitButton from '../../../../components/buttons/FormSubmitButton.vue';
import Modal from '../../../../components/Modal.vue';
import WootMessageEditor from 'dashboard/components/widgets/WootWriter/Editor.vue';
import alertMixin from 'shared/mixins/alertMixin';

export default {
  components: {
    WootSubmitButton,
    Modal,
    WootMessageEditor,
  },
  mixins: [alertMixin],
  props: {
    responseContent: {
      type: String,
      default: '',
    },
    onClose: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      shortCode: '',
      content: this.responseContent || '',

      // <!-- Andrés Liverio 020822  **Wintook**-->
      urlShortCode: "",
      contentFull: false,
      urlContent: false,
      opcMenu: false,
      noOptionMenu: 0,
      existsOption: false,
      insert: {},
      // <!-- Andrés Liverio 020822 **Wintook**-->

      addCanned: {
        showLoading: false,
        message: '',
      },
      show: true,
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

  // <!-- Andrés Liverio 020822  **Wintook**-->
  computed: {
    ...mapGetters({
      currentUser: "getCurrentUser",
    }),
  },
  // <!-- Andrés Liverio 020822  **Wintook**-->


  methods: {
    resetForm() {
      this.shortCode = '';
      this.content = '';
      this.$v.shortCode.$reset();
      this.$v.content.$reset();
    },
    addCannedResponse() {
      // Show loading on button
      this.addCanned.showLoading = true;
      // Make API Calls
      this.$store
        .dispatch('createCannedResponse', {
          short_code: this.shortCode,
          content: this.content,
        })
        .then(() => {
          // Reset Form, Show success message

          // <!-- Andrés Liverio 020822 **Wintook** -->

          console.log("Respuesta despues de guardar:");
          console.log(response);
          
          this.setCannedReponse(response);
          // <!-- Andrés Liverio 020822 **Wintook** -->

          this.addCanned.showLoading = false;
          this.showAlert(this.$t('CANNED_MGMT.ADD.API.SUCCESS_MESSAGE'));
          this.resetForm();
          this.onClose();
        })
        .catch(error => {
          this.addCanned.showLoading = false;
          const errorMessage =
            error?.message || this.$t('CANNED_MGMT.ADD.API.ERROR_MESSAGE');
          this.showAlert(errorMessage);
        });
    },

    // <!-- Andrés Liverio 020822 **Wintook**-->
    setCannedReponse(data) {
      let id = data.id;
      let account_id = data.account_id;
      let url_short_code = this.urlShortCode;
      let content_full = this.contentFull;
      let url_content = this.urlContent;
      let opcMenu = this.opcMenu;
      let noOptionMenu = this.noOptionMenu;

      let response = axios
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
      return response;
    },
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
