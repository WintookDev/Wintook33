<template>
    <div class="flex items-center flex-col">
      <div v-if="isLoading" class="items-center flex text-base justify-center">
        <spinner color-scheme="primary" />
        <span>{{ $t('CAMPAIGN.LIST.LOADING_MESSAGE') }}</span>
      </div>
      <div v-else class="w-full">
        <empty-state v-if="showEmptyResult" :title="emptyMessage" />
        <div v-else class="w-full">
          <campaign-card
            v-for="campaign in campaigns"
            :key="campaign.id"
            :campaign="campaign"
            :is-ongoing-type="isOngoingType"
            @edit="campaign => $emit('edit', campaign)"
            @delete="campaign => $emit('delete', campaign)"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mixin as clickaway } from 'vue-clickaway';
  import Spinner from 'shared/components/Spinner.vue';
  import EmptyState from 'dashboard/components/widgets/EmptyState.vue';
  import campaignMixin from 'shared/mixins/campaignMixin';
  import CampaignCard from './CampaignCard.vue';
  
  export default {
    components: {
      EmptyState,
      Spinner,
      CampaignCard,
    },
  
    mixins: [clickaway, campaignMixin],
  
    props: {
      campaigns: {
        type: Array,
        default: () => [],
      },
      showEmptyResult: {
        type: Boolean,
        default: false,
      },
      isLoading: {
        type: Boolean,
        default: false,
      },
    },
  
    computed: {
      currentInboxId() {
        return this.$route.params.inboxId;
      },
      inbox() {
        return this.$store.getters['inboxes/getInbox'](this.currentInboxId);
      },
      inboxes() {
        if (this.isOngoingType) {
          return this.$store.getters['inboxes/getWebsiteInboxes'];
        }
        return this.$store.getters['inboxes/getTwilioInboxes'];
      },
      emptyMessage() {
        return this.inboxes.length
          ? this.$t('CAMPAIGN.MM_WA.404')
          : this.$t('CAMPAIGN.MM_WA.INBOXES_NOT_FOUND');
      },
    },
  };
  </script>
  