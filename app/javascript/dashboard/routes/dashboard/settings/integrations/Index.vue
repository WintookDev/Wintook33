<template>
  <div class="flex-shrink flex-grow overflow-auto p-4">
    <div class="flex flex-col">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div class="flex items-center justify-start m-0 mb-4 flex-1">
          <woot-tabs class="settings--tabs" :index="selectedTabIndex" :border="false" @change="onTabChange">
            <woot-tabs-item v-for="tab in tabs" :key="tab.key" :name="tab.name" :show-badge="false" />
          </woot-tabs>
        </div>
      </div>

      <div class="flex flex-col">
        <div v-if="selectedTabIndex === 0">
          <div v-for="item in integrationsList" :key="item.id"
            class="bg-white dark:bg-slate-800 border border-solid border-slate-75 dark:border-slate-700/50 rounded-sm mb-4 p-4">
            <integration :integration-id="item.id" :integration-logo="item.logo" :integration-name="item.name"
              :integration-description="item.description" :integration-enabled="item.enabled"
              :integration-action="item.action" />
          </div>

          <div
            class="bg-white dark:bg-slate-800 border border-solid border-slate-75 dark:border-slate-700/50 rounded-sm mb-4 p-4">
            <integration integration-id="dashboard-apps" integration-logo="dashboard-apps.svg" :integration-name="$t('INTEGRATION_SETTINGS.DASHBOARD_APPS.TITLE')
            " :integration-description="$t('INTEGRATION_SETTINGS.DASHBOARD_APPS.DESCRIPTION')
            " integration-enabled integration-action="/dashboard-apps" />
          </div>
        </div>
      </div>

      <TabBotEva :selectedTabIndex="selectedTabIndex" />
      <TabChannelsBotEva :selectedTabIndex="selectedTabIndex" />
      <!-- <TabCRMZeus         :selectedTabIndex = "selectedTabIndex"/> -->
      <TabVocabulario :selectedTabIndex="selectedTabIndex" />
      <TabSinonimos :selectedTabIndex="selectedTabIndex" />
      <OpenAi             :selectedTabIndex = "selectedTabIndex"/>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Integration from "./Integration.vue";
import IntegrationTabs from "../../../../extra/integrations/tabs/IntegrationTabs";

import TabBotEva from "../../../../extra/integrations/tabs/TabBotEva";
import TabChannelsBotEva from "../../../../extra/integrations/tabs/TabChannelsBotEva";
// import TabCRMZeus from '../../../../extra/integrations/tabs/TabCRMZeus';
import TabVocabulario from "../../../../extra/integrations/tabs/TabVocabulario";
import TabSinonimos from "../../../../extra/integrations/tabs/TabSinonimos";
import OpenAi from '../../../../extra/integrations/openai/OpenAi';

export default {
  data() {
    return {
      selectedTabIndex: 0,
    };
  },
  components: {
    Integration,
    IntegrationTabs,
    TabBotEva,
    TabChannelsBotEva,
    // TabCRMZeus,
    TabVocabulario,
    TabSinonimos,
    OpenAi,
  },
  computed: {
    ...mapGetters({
      integrationsList: "integrations/getIntegrations",
    }),
    tabs() {
      let optionsTabs = [
        { key: 0, name: "WebHooks" },
        { key: 1, name: "Orígenes Bot Eva" },
        { key: 2, name: "Canales Bot Eva" },
        { key: 3, name: "Vocabulario" },
        { key: 4, name: "Sinónimos" },
        { key: 5, name: "Entrenamiento de EvaBot" },
      ];
      return optionsTabs;
    },
  },
  mounted() {
    this.$store.dispatch("integrations/get");
  },
  methods: {
    async onTabChange(index) {
      this.selectedTabIndex = index;
    },

    async onClickTabChange(index) {
      this.selectedTabIndex = index;
    },
  },
};
</script>

<style scoped lang="scss">
.settings {
  .settings--tabs {
    ::v-deep .tabs {
      @apply p-0;
    }
  }
}
</style>