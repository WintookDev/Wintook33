<template>
  <form class="row" @submit.prevent="setWelcome">
    <div class="medium-12 columns">
      <label
        >{{ $t("INBOX_MGMT.ADD.WEBSITE_CHANNEL.CHANNEL_WELCOME_TITLE.LABEL") }}
        <input
          v-model.trim="welcomeTitle"
          type="text"
          :placeholder="'Saludo de bienvenida %nombre% (%nombre% - opcional).'"
        />
      </label>
    </div>

    <div class="medium-12 columns">
      <label
        >{{
          $t("INBOX_MGMT.ADD.WEBSITE_CHANNEL.CHANNEL_WELCOME_TAGLINE.LABEL")
        }}
        <input
          v-model.trim="welcomeTagline"
          type="text"
          :placeholder="
            $t(
              'INBOX_MGMT.ADD.WEBSITE_CHANNEL.CHANNEL_WELCOME_TAGLINE.PLACEHOLDER'
            )
          "
        />
      </label>
    </div>

    <div class="medium-12 columns">
      <label>{{ "Mensaje para encuesta de satisfacción del cliente" }}
        <input
          v-model.trim="message_csat" type="text"
          :placeholder="'Descripción del mensaje...'"
        />
      </label>
    </div>

    <div class="medium-12 columns">
      <label>{{ "Link de encuesta" }}
        <input
          v-model.trim="url_csat" type="url"
          :placeholder="'Link url de encuesta'"
        />
      </label>
    </div>

    <div class="modal-footer">
      <div class="medium-12 columns">
        <woot-button
          type="submit"
          :is-disabled="!welcomeTitle.length && !welcomeTagline.length && !message_csat.length && !url_csat.length"
        >
          {{ "Guardar" }}
        </woot-button>
        <woot-button class="button clear" @click.prevent="deleteWelcome">
          {{ "Eliminar" }}
        </woot-button>
      </div>
    </div>
  </form>
</template>
<script>

import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      welcomeTitle: "",
      welcomeTagline: "",
      message_csat: "",
      url_csat: ""
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "getCurrentUser",
    }),
  },

  mounted() {
    this.getWelcome();
  },

  methods: {
    async setWelcome() {
      const { access_token, account_id } = this.currentUser;
      const welcomeTitle = this.welcomeTitle;
      const welcomeTagline = this.welcomeTagline;
      const message_csat = this.message_csat;
      const url_csat = this.url_csat;

      const result = await axios
        .post(process.env.URL_WEBHOOK + "/api/setWelcome", {
          params: { access_token, account_id, welcomeTitle, welcomeTagline, message_csat, url_csat },
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

    async getWelcome() {
      const { access_token, account_id } = this.currentUser;

      const result = await axios
        .get(process.env.URL_WEBHOOK + "/api/getWelcome", {
          params: { access_token, account_id },
        })
        .then(function (resp) {
          return resp.data;
        })
        .catch(function (error) {
          return error;
        });

      // const data = JSON.stringify({
      //   access_token: access_token,
      //   account_id: account_id,
      // });

      // const config = {
      //   method: "get",
      //   url: process.env.URL_WEBHOOK + "/api/getWelcome",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   data: data,
      // };

      // const result = await axios(config)
      //   .then(function (response) {
      //     return response.data;
      //   })
      //   .catch(function (error) {
      //     return error;
      //   });

      if (result.status === 200) {
        this.welcomeTitle = result.welcomeTitle;
        this.welcomeTagline = result.welcomeTagline;
        this.message_csat = result.message_csat;
        this.url_csat = result.url_csat;
      }
    },

    async deleteWelcome() {
      this.welcomeTitle = "";
      this.welcomeTagline = "";
      this.message_csat = "";
      this.url_csat = "";
      this.setWelcome();
    },
  },
};
</script>
<style scoped lang="scss">
@import "~dashboard/assets/scss/variables";
@import "~dashboard/assets/scss/mixins";

.settings {
  background: $color-white;

  .settings--content {
    div:last-child {
      border-bottom: 0;
    }
  }

  .tabs {
    padding: 0;
    margin-bottom: -1px;
  }
}

.widget--feature-flag {
  padding-top: var(--space-small);
}

.settings-item {
  padding-bottom: var(--space-normal);

  .help-text {
    font-style: normal;
    color: var(--b-500);
    padding-bottom: var(--space-smaller);
  }
}
</style>