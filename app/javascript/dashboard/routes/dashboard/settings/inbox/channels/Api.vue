<template>
  <div class="wizard-body w-[75%] flex-shrink-0 flex-grow-0 max-w-[75%]">
    <page-header
      :header-title="$t('INBOX_MGMT.ADD.API_CHANNEL.TITLE')"
      :header-content="$t('INBOX_MGMT.ADD.API_CHANNEL.DESC')"
    />
    <form class="mx-0 flex flex-wrap" @submit.prevent="createChannel()">
      <div class="w-[65%] flex-shrink-0 flex-grow-0 max-w-[65%]">
        <label :class="{ error: $v.channelName.$error }">
          {{ $t('INBOX_MGMT.ADD.API_CHANNEL.CHANNEL_NAME.LABEL') }}
          <input
            v-model.trim="channelName"
            type="text"
            :placeholder="
              $t('INBOX_MGMT.ADD.API_CHANNEL.CHANNEL_NAME.PLACEHOLDER')
            "
            @blur="$v.channelName.$touch"
          />
          <span v-if="$v.channelName.$error" class="message">{{
            $t('INBOX_MGMT.ADD.API_CHANNEL.CHANNEL_NAME.ERROR')
          }}</span>
        </label>
      </div>

      <div class="w-[65%] flex-shrink-0 flex-grow-0 max-w-[65%]">
        <label :class="{ error: $v.webhookUrl.$error }">
          {{ $t('INBOX_MGMT.ADD.API_CHANNEL.WEBHOOK_URL.LABEL') }}
          <input
            v-model.trim="webhookUrl"
            type="text"
            :placeholder="
              $t('INBOX_MGMT.ADD.API_CHANNEL.WEBHOOK_URL.PLACEHOLDER')
            "
            @blur="$v.webhookUrl.$touch"
          />
        </label>
        <p class="help-text">
          {{ $t('INBOX_MGMT.ADD.API_CHANNEL.WEBHOOK_URL.SUBTITLE') }}
        </p>
      </div>

      <div class="w-[65%] flex-shrink-0 flex-grow-0 max-w-[65%]">
        <label class="w-full">
          {{ 'Market Place' }}
          <select v-model="marketPlace" @change="onChangeMarketPlace()">
            <option value="NA">
              {{ 'Deshabilitado' }}
            </option>
            <option value="ML">
              {{ 'Mercado Libre' }}
            </option>
          </select>
          <p class="help-text">
            {{
              'Canal que permite dar respuesta a las preguntas hechas por los usuarios de la plataforma de E-Commerce.'
            }}
          </p>
        </label>
      </div>

      <div
        class="w-[65%] flex-shrink-0 flex-grow-0 max-w-[65%]"
        v-if="marketPlace === 'ML'"
      >
        <div class="w-[100%] flex-shrink-0 flex-grow-0 max-w-[100%]">
          <label>
            {{ 'Client Secret Mercado Libre' }}
            <input
              v-model.trim="mlclient_secret"
              type="text"
              :placeholder="'Client Secret Mercado Libre'"
            />
          </label>
          <p class="help-text">
            {{ 'Client Secret de Aplicación de Mercado Libre' }}
          </p>
        </div>

        <div class="flex justify-between items-center min-w-[10rem]">
          <div class="w-[70%] flex-shrink-0 flex-grow-0 max-w-[100%]">
            <label class="w-full">
              {{ 'App ID Mercado Libre' }}
              <input
                v-model.trim="mlapplication_id"
                type="text"
                :placeholder="'App Id Mercado Libre'"
              />
            </label>
            <p class="help-text">
              {{ 'App Id de Aplicación de Mercado Libre' }}
            </p>
          </div>
          <div class="flex items-center mb-3 gap-2">
            <woot-button @click.prevent="abrirEnNuevaVentana">
              {{ 'Obtener Refresh Tokem' }}
            </woot-button>
          </div>
        </div>

        <div class="flex justify-between items-center min-w-[10rem]">
          <div class="w-[70%] flex-shrink-0 flex-grow-0 max-w-[100%]">
            <label class="w-full">
              {{ 'Refresh API Token' }}
              <input
                v-model.trim="mlrefresh_token"
                type="text"
                :placeholder="'Refresh API Token'"
              />
            </label>
            <p class="help-text">
              {{ 'Refresh API Token de la Aplicación de Mercado Libre' }}
            </p>
          </div>
          <div class="flex items-center mb-3 gap-2">
            <woot-button @click.prevent="getTokenAppMercadoLibre">
              {{ 'Generar Tokem' }}
            </woot-button>
          </div>
        </div>

        <div class="w-[100%] flex-shrink-0 flex-grow-0 max-w-[100%]">
          <label>
            {{ 'API Token Mercado Libre' }}
            <input
              v-model.trim="mlaccess_token"
              type="text"
              :placeholder="'API Token'"
            />
          </label>
          <p class="help-text">
            {{ 'API Token de la Aplicación de Mercado Libre' }}
          </p>
        </div>
      </div>

      <div class="w-full">
        <woot-submit-button
          :disable="disabledSave"
          :loading="uiFlags.isCreating"
          :button-text="$t('INBOX_MGMT.ADD.API_CHANNEL.SUBMIT_BUTTON')"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import alertMixin from 'shared/mixins/alertMixin';
import { required } from 'vuelidate/lib/validators';
import router from '../../../../index';
import PageHeader from '../../SettingsSubPageHeader.vue';

const shouldBeWebhookUrl = (value = '') =>
  value ? value.startsWith('http') : true;

export default {
  components: {
    PageHeader,
  },
  mixins: [alertMixin],
  data() {
    return {
      channelName: '',
      webhookUrl: '',
      marketPlace: 'NA',

      disablewebhookUrl: false,

      /* Datos de Mercado Libre */
      mlapplication_id: '',
      mlclient_secret: '',
      mlrefresh_token: '',
      mlaccess_token: '',
    };
  },
  computed: {
    ...mapGetters({
      uiFlags: 'inboxes/getUIFlags',
    }),
    disabledSave() {
      if (this.marketPlace === 'NA') return false;
      if (
        this.marketPlace === 'ML' &&
        this.mlapplication_id &&
        this.mlclient_secret &&
        this.mlrefresh_token &&
        this.mlaccess_token
      )
        return true;
      return true;
    },
  },
  validations: {
    channelName: { required },
    webhookUrl: { shouldBeWebhookUrl },
  },
  methods: {
    async createChannel() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      try {
        const apiChannel = await this.$store.dispatch('inboxes/createChannel', {
          name: this.channelName,
          channel: {
            type: 'api',
            webhook_url: this.webhookUrl,
            additional_attributes: {
              mlapplication_id: this.mlapplication_id,
              mlclient_secret: this.mlclient_secret,
              mlrefresh_token: this.mlrefresh_token,
              mlaccess_token: this.mlaccess_token,
            },
          },
        });

        router.replace({
          name: 'settings_inboxes_add_agents',
          params: {
            page: 'new',
            inbox_id: apiChannel.id,
          },
        });
      } catch (error) {
        this.showAlert(this.$t('INBOX_MGMT.ADD.API_CHANNEL.API.ERROR_MESSAGE'));
      }
    },

    onChangeMarketPlace() {
      if (this.marketPlace === 'NA') {
        this.webhookUrl = ``;
        this.disablewebhookUrl = false;
      }

      if (this.marketPlace === 'ML') {
        this.webhookUrl = `https://api.wintook.com/v1/webhook/mercadolibre`;
        this.disablewebhookUrl = true;
      }

      this.mlapplication_id = '';
      this.mlclient_secret = '';
      this.mlrefresh_token = '';
      this.mlaccess_token = '';
    },

    abrirEnNuevaVentana() {
      // Reemplaza 'https://www.ejemplo.com' con tu enlace web
      const enlaceWeb = `https://auth.mercadolibre.com/authorization?response_type=code&client_id=${this.mlapplication_id}&redirect_uri=${this.webhookUrl}`;

      // Especifica el ancho y alto de la ventana (en píxeles)
      const anchoVentana = 800;
      const altoVentana = 600;

      // Calcula la posición centrada de la ventana en la pantalla
      const left = (window.innerWidth - anchoVentana) / 2;
      const top = (window.innerHeight - altoVentana) / 2;

      // Abre el enlace en una nueva ventana
      window.open(
        enlaceWeb,
        '_blank',
        `width=${anchoVentana},height=${altoVentana},left=${left},top=${top}`
      );
    },

    async getTokenAppMercadoLibre() {
      const options = {
        method: 'POST',
        url: 'https://api.mercadolibre.com/oauth/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
          grant_type: 'authorization_code',
          client_id: this.mlapplication_id,
          client_secret: this.mlclient_secret,
          code: this.mlrefresh_token,
          redirect_uri: this.webhookUrl,
        },
      };

      await axios
        .request(options)
        .then(function (response) {
          this.mlaccess_token = response.data.access_token;
          this.mlrefresh_token = response.data.refresh_token;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
};
</script>
