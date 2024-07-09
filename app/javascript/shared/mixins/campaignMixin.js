import { CAMPAIGN_TYPES } from '../constants/campaign';

export default {
  computed: {
    campaignType() {
      const pageURL = window.location.href;
      return pageURL.substring(pageURL.lastIndexOf('/') + 1);
    },
    isOngoingType() {
      return this.campaignType === CAMPAIGN_TYPES.ONGOING;
    },
    isOnOffType() {
      return this.campaignType === CAMPAIGN_TYPES.ONE_OFF;
    },
    // Andres Liverio 160524
    isMmWaType() {
      return this.campaignType === CAMPAIGN_TYPES.MM_WA;
    },
  },
};
