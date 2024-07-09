<template>
  <div class="flex actions--container relative items-center gap-2">
    
    <woot-button
      v-if="chatBot.inbox_bot && chatBot.account_bot"
            v-tooltip=" 'Bot EVAi' "
            title=" 'Bot Eva' "
            :color-scheme="chatBot.colorScheme" 
            icon-size="14"
            variant="smooth"
            size="small expanded"
            @click="setBotConversation">
            {{ chatBot.textButton }}
    </woot-button>

    <woot-button
      v-if="!currentChat.muted"
      v-tooltip="$t('CONTACT_PANEL.MUTE_CONTACT')"
      variant="clear"
      color-scheme="secondary"
      icon="speaker-mute"
      @click="mute"
    />
    <woot-button
      v-else
      v-tooltip.left="$t('CONTACT_PANEL.UNMUTE_CONTACT')"
      variant="clear"
      color-scheme="secondary"
      icon="speaker-1"
      @click="unmute"
    />
    <woot-button
      v-tooltip="$t('CONTACT_PANEL.SEND_TRANSCRIPT')"
      variant="clear"
      color-scheme="secondary"
      icon="share"
      @click="toggleEmailActionsModal"
    />
    <resolve-action
      :conversation-id="currentChat.id"
      :status="currentChat.status"
    />
    <email-transcript-modal
      v-if="showEmailActionsModal"
      :show="showEmailActionsModal"
      :current-chat="currentChat"
      @cancel="toggleEmailActionsModal"
    />
  </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from 'vuex';
import { mixin as clickaway } from 'vue-clickaway';
import alertMixin from 'shared/mixins/alertMixin';
import EmailTranscriptModal from './EmailTranscriptModal.vue';
import ResolveAction from '../../buttons/ResolveAction.vue';
import {
  CMD_MUTE_CONVERSATION,
  CMD_SEND_TRANSCRIPT,
  CMD_UNMUTE_CONVERSATION,
} from '../../../routes/dashboard/commands/commandBarBusEvents';

export default {
  components: {
    EmailTranscriptModal,
    ResolveAction,
  },
  mixins: [alertMixin, clickaway],
  data() {
    return {
      showEmailActionsModal: false,
      textButtonMA: '',
      colorSchemeMA: '',
      botMA: null,
    };
  },
  props: {
    chatBot: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({ 
      currentChat: 'getSelectedChat',
      currentUser: 'getCurrentUser',
    }),
  },
  mounted() {
    bus.$on(CMD_MUTE_CONVERSATION, this.mute);
    bus.$on(CMD_UNMUTE_CONVERSATION, this.unmute);
    bus.$on(CMD_SEND_TRANSCRIPT, this.toggleEmailActionsModal);
  },
  destroyed() {
    bus.$off(CMD_MUTE_CONVERSATION, this.mute);
    bus.$off(CMD_UNMUTE_CONVERSATION, this.unmute);
    bus.$off(CMD_SEND_TRANSCRIPT, this.toggleEmailActionsModal);
  },
  methods: {

    async setBotConversation(){
      let access_token = this.currentUser.access_token;
      let account_id  = this.currentChat.account_id;
      let display_id  = this.currentChat.id;
      let inbox_id    = this.currentChat.inbox_id;
      let result =  await axios.get(process.env.URL_WEBHOOK+'/api/setBotConversation', {
		    params: {
          access_token : access_token,
          account_id   : account_id,
          display_id   : display_id,
          inbox_id     : inbox_id,
        }
      })
      .then(function (resp) { return resp.data; })
      .catch(function (error) { return error; });
      if (result.status === 200) {
            this.chatBot = result;
            bus.$emit('newToastMessage', result.toastMessage);
      }
    },

    mute() {
      this.$store.dispatch('muteConversation', this.currentChat.id);
      this.showAlert(this.$t('CONTACT_PANEL.MUTED_SUCCESS'));
    },
    unmute() {
      this.$store.dispatch('unmuteConversation', this.currentChat.id);
      this.showAlert(this.$t('CONTACT_PANEL.UNMUTED_SUCCESS'));
    },
    toggleEmailActionsModal() {
      this.showEmailActionsModal = !this.showEmailActionsModal;
    },
  },
};
</script>
<style scoped lang="scss">
.more--button {
  @apply items-center flex ml-2 rtl:ml-0 rtl:mr-2;
}

.dropdown-pane {
  @apply -right-2 top-12;
}

.icon {
  @apply mr-1 rtl:mr-0 rtl:ml-1 min-w-[1rem];
}
</style>
