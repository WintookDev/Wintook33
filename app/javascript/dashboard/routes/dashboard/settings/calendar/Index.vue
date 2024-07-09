<template>
  <div class="overflow-auto p-6 w-full h-full">
      <loading-state
        v-if="iframeLoading"
        :message="$t('DASHBOARD_APPS.LOADING_MESSAGE')"
        class="dashboard-app_loading-container"
      />
      <iframe
        v-if="url"
        :id="getFrameId(100)"
        :src="url"
        @load="() => onIframeLoad(100)"
        style="width: 100%; height: 100%;"
      />
  </div>
</template>
  
  <script>
import LoadingState from "dashboard/components/widgets/LoadingState.vue";
export default {
  components: {
    LoadingState,
  },
  data() {
    return {
      hasOpenedAtleastOnce: false,
      iframeLoading: true,
      url: "https://devcalendar.wintook.com/",
    };
  },
  computed: {
    dashboardAppContext() {
      return {
        currentAgent: this.currentAgent,
      };
    },
    contactId() {
      return this.currentChat?.meta?.sender?.id;
    },
    currentAgent() {
      const { id, name, email } = this.$store.getters.getCurrentUser;
      return { id, name, email };
    },
  },
  watch: {
    isVisible() {
      if (this.isVisible) {
        this.hasOpenedAtleastOnce = true;
      }
    },
  },

  mounted() {
    window.onmessage = (e) => {
      if (
        typeof e.data !== "string" ||
        e.data !== "chatwoot-dashboard-app:fetch-info"
      ) {
        return;
      }
      this.onIframeLoad(0);
    };
  },
  methods: {
    getFrameId(index) {
      return `dashboard-app--frame-100`;
    },
    onIframeLoad(index) {
      // A possible alternative is to use ref instead of document.getElementById
      // However, when ref is used together with v-for, the ref you get will be
      // an array containing the child components mirroring the data source.
      const frameElement = document.getElementById(this.getFrameId(index));
      const eventData = { event: "appContext", data: this.dashboardAppContext };
      frameElement.contentWindow.postMessage(JSON.stringify(eventData), "*");
      this.iframeLoading = false;
    },
  },
};
</script>
  
  <style scoped>
.dashboard-app--container,
.dashboard-app--list,
.dashboard-app--list iframe {
  height: 100%;
  width: 100%;
}

.dashboard-app--list iframe {
  border: 0;
}
.dashboard-app_loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
</style>
  