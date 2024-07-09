<template>
  <div class="h-auto overflow-auto flex flex-col">
    <woot-modal-header
      :header-title="$t('CAMPAIGN.ADD.TITLE')"
      :header-content="$t('CAMPAIGN.ADD.DESC')"
    />
    <form class="flex flex-col w-full" @submit.prevent="addCampaign">
      <div class="w-full">
        <woot-input
          v-model="title"
          :label="$t('CAMPAIGN.ADD.FORM.TITLE.LABEL')"
          type="text"
          :class="{ error: $v.title.$error }"
          :error="$v.title.$error ? $t('CAMPAIGN.ADD.FORM.TITLE.ERROR') : ''"
          :placeholder="$t('CAMPAIGN.ADD.FORM.TITLE.PLACEHOLDER')"
          @blur="$v.title.$touch"
        />

        <div class="editor-wrap">
          <label>
            {{ $t("CAMPAIGN.ADD.FORM.MESSAGE.LABEL") }}
          </label>
          <div>
            <woot-message-editor
              v-model="message"
              class="message-editor"
              :class="{ editor_warning: $v.message.$error }"
              :placeholder="$t('CAMPAIGN.ADD.FORM.MESSAGE.PLACEHOLDER')"
              @blur="$v.message.$touch"
            />
            <span v-if="$v.message.$error" class="editor-warning__message">
              {{ $t("CAMPAIGN.ADD.FORM.MESSAGE.ERROR") }}
            </span>
          </div>
        </div>

        <label :class="{ error: $v.selectedInbox.$error }">
          {{ $t("CAMPAIGN.ADD.FORM.INBOX.LABEL") }}
          <select v-model="selectedInbox" @change="onChangeInbox($event)">
            <option v-for="item in inboxes" :key="item.name" :value="item.id">
              {{ item.name }}
            </option>
          </select>
          <span v-if="$v.selectedInbox.$error" class="message">
            {{ $t("CAMPAIGN.ADD.FORM.INBOX.ERROR") }}
          </span>
        </label>

        <label
          class="multiselect-wrap--small"
          :class="{ error: $v.selectedAudience.$error }"
        >
          {{ $t("CAMPAIGN.ADD.FORM.AUDIENCE.LABEL") }}
          <multiselect
            v-model="selectedAudience"
            :options="audienceList"
            track-by="id"
            label="title"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :hide-selected="true"
            :placeholder="$t('CAMPAIGN.ADD.FORM.AUDIENCE.PLACEHOLDER')"
            selected-label
            :select-label="$t('FORMS.MULTISELECT.ENTER_TO_SELECT')"
            :deselect-label="$t('FORMS.MULTISELECT.ENTER_TO_REMOVE')"
            @blur="$v.selectedAudience.$touch"
            @select="$v.selectedAudience.$touch"
          />
          <span v-if="$v.selectedAudience.$error" class="message">
            {{ $t("CAMPAIGN.ADD.FORM.AUDIENCE.ERROR") }}
          </span>
        </label>

        <label>
          {{ $t("CAMPAIGN.ADD.FORM.SCHEDULED_AT.LABEL") }}
          <woot-date-time-picker
            :value="scheduledAt"
            :confirm-text="$t('CAMPAIGN.ADD.FORM.SCHEDULED_AT.CONFIRM')"
            :placeholder="$t('CAMPAIGN.ADD.FORM.SCHEDULED_AT.PLACEHOLDER')"
            @change="onChange"
          />
        </label>
      </div>

      <div class="flex flex-row justify-end gap-2 py-2 px-0 w-full">
        <woot-button :is-loading="uiFlags.isCreating">
          {{ $t("CAMPAIGN.ADD.CREATE_BUTTON_TEXT") }}
        </woot-button>
        <woot-button variant="clear" @click.prevent="onClose">
          {{ $t("CAMPAIGN.ADD.CANCEL_BUTTON_TEXT") }}
        </woot-button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios"; // Andres Liverio 230524
import { required } from "vuelidate/lib/validators";
import alertMixin from "shared/mixins/alertMixin";
import WootMessageEditor from "dashboard/components/widgets/WootWriter/Editor.vue";
import campaignMixin from "shared/mixins/campaignMixin";
import WootDateTimePicker from "dashboard/components/ui/DateTimePicker.vue";
import { URLPattern } from "urlpattern-polyfill";
import { CAMPAIGNS_EVENTS } from "../../../../helper/AnalyticsHelper/events";

export default {
  components: {
    WootDateTimePicker,
    WootMessageEditor,
  },

  mixins: [alertMixin, campaignMixin],
  data() {
    return {
      title: "",
      message: "",
      selectedSender: 0,
      selectedInbox: null,
      endPoint: "",
      timeOnPage: 10,
      show: true,
      enabled: true,
      triggerOnlyDuringBusinessHours: false,
      scheduledAt: null,
      selectedAudience: [],
      senderList: [],
    };
  },

  validations() {
    const commonValidations = {
      title: {
        required,
      },
      message: {
        required,
      },
      selectedInbox: {
        required,
      },
    };
    // if (this.isOngoingType) {
    //   return {
    //     ...commonValidations,
    //     selectedSender: {
    //       required,
    //     },
    //     endPoint: {
    //       required,
    //       shouldBeAValidURLPattern(value) {
    //         try {
    //           // eslint-disable-next-line
    //           new URLPattern(value);
    //           return true;
    //         } catch (error) {
    //           return false;
    //         }
    //       },
    //       shouldStartWithHTTP(value) {
    //         if (value) {
    //           return (
    //             value.startsWith("https://") || value.startsWith("http://")
    //           );
    //         }
    //         return false;
    //       },
    //     },
    //     timeOnPage: {
    //       required,
    //     },
    //   };
    // }
    return {
      ...commonValidations,
      selectedAudience: {
        isEmpty() {
          return !!this.selectedAudience.length;
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "getCurrentUser", // Andres Liverio 230524
      uiFlags: "campaigns/getUIFlags",
      audienceList: "labels/getLabels",
    }),
    inboxes() {
      return this.$store.getters["inboxes/getApiInboxes"];
    },
    sendersAndBotList() {
      return [
        {
          id: 0,
          name: "Bot",
        },
        ...this.senderList,
      ];
    },
  },

  watch: {
    selectedAudience(newValue, oldValue) {
      console.log(newValue);
    },
  },

  mounted() {
    // this.$track(CAMPAIGNS_EVENTS.OPEN_NEW_CAMPAIGN_MODAL, {
    //   type: this.campaignType,
    // });
  },

  methods: {
    onClose() {
      this.$emit("on-close");
    },
    onChange(value) {
      this.scheduledAt = value;
    },
    async onChangeInbox() {
      try {
        const response = await this.$store.dispatch("inboxMembers/get", {
          inboxId: this.selectedInbox,
        });
        const {
          data: { payload: inboxMembers },
        } = response;
        this.senderList = inboxMembers;
      } catch (error) {
        const errorMessage =
          error?.response?.message || this.$t("CAMPAIGN.ADD.API.ERROR_MESSAGE");
        this.showAlert(errorMessage);
      }
    },
    getCampaignDetails() {
      let campaignDetails = null;
      const audience = this.selectedAudience.map((item) => {
        return {
          id: item.id,
          type: "Label",
        };
      });
      campaignDetails = {
        title: this.title,
        message: this.message,
        inbox_id: this.selectedInbox,
        scheduled_at: this.scheduledAt,
        audience,
      };
      return campaignDetails;
    },
    async addCampaign() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      try {
        const campaignDetails = this.getCampaignDetails();
        this.setCampaign(campaignDetails);
        //const response = await this.$store.dispatch('campaigns/create', campaignDetails);
        // console.log(response);
        /// console.log("type.campaignType");
        // console.log(type.campaignType);
        // tracking this here instead of the store to track the type of campaign
        // this.$track(CAMPAIGNS_EVENTS.CREATE_CAMPAIGN, {
        //   type: type.campaignType,
        // });
        this.showAlert(this.$t("CAMPAIGN.ADD.API.SUCCESS_MESSAGE"));
        this.onClose();
      } catch (error) {
        const errorMessage =
          error?.response?.message || this.$t("CAMPAIGN.ADD.API.ERROR_MESSAGE");
        this.showAlert(errorMessage);
      }
    },

    async setCampaign(data) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const { access_token, account_id } = this.currentUser;
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/api/v1/accounts/${account_id}/campaigns`,
        headers: {
          "Content-Type": "application/json",
          api_access_token: access_token,
        },
        data,
      };

      await axios
        .request(config)
        .then((response) => {
          this.$store.dispatch("campaigns/get");
          this.cronTimeCampaign(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async cronTimeCampaign(campaign) {
      const { access_token, account_id } = this.currentUser;
      const baseUrl = "https://massive.wintook.com";
      const data = {
        api_access_token: access_token,
        campaign,
      };

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/v1/whatsapp/sendmass/cronTimeCampaign`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .ProseMirror-woot-style {
  height: 5rem;
}

.message-editor {
  @apply px-3;

  ::v-deep {
    .ProseMirror-menubar {
      @apply rounded-tl-[4px];
    }
  }
}
</style>