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
    </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return { showAddPopup: false };
    },
    computed: {
      buttonText() {
        if (this.isMmWaType) {
          return this.$t('CAMPAIGN.HEADER_BTN_TXT.MM_WA');
        }
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
  