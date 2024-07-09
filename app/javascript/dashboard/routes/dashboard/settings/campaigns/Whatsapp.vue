<template>
    <div class="flex-1 overflow-auto p-4">
      <woot-button
        color-scheme="success"
        class-names="button--fixed-top"
        icon="add-circle"
        @click="openAddPopup"
      >
        {{ buttonText }}
      </woot-button>
      <whatsapp-campaign type="MM_WA"/>
      <woot-modal :show.sync="showAddPopup" :on-close="hideAddPopup">
        <whatsapp-add-campaign @on-close="hideAddPopup" />
      </woot-modal>
    </div>
  </template>
  
  <script>
  import campaignMixin from 'shared/mixins/campaignMixin';
  import WhatsappCampaign from './WhatsappCampaign.vue';
  import WhatsappAddCampaign from './WhatsappAddCampaign.vue';
  
  export default {
    components: {
        WhatsappCampaign,
        WhatsappAddCampaign,
    },
    mixins: [campaignMixin],
    data() {
      return { showAddPopup: false };
    },
    computed: {
      buttonText() {
        return this.$t('CAMPAIGN.HEADER_BTN_TXT.MM_WA');
      },
    },
    mounted() {
      this.$store.dispatch('campaigns/get');
    },
    methods: {
      openAddPopup() {
        this.showAddPopup = true;
      },
      hideAddPopup() {
        this.showAddPopup = false;
      },
    },
  };
  </script>
  