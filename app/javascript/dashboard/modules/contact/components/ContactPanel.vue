<template>
  <div class="panel">
    <contact-intro
      :contact="contact"
      @message="toggleConversationModal"
      @edit="toggleEditModal"
    />
    <contact-fields
      :contact="contact"
      @update="updateField"
      @create-attribute="toggleCustomAttributeModal"
    />
    <edit-contact
      v-if="showEditModal"
      :show="showEditModal"
      :contact="contact"
      @cancel="toggleEditModal"
    />
    <new-conversation
      v-if="enableNewConversation"
      :show="showConversationModal"
      :contact="contact"
      @cancel="toggleConversationModal"
    />
    <add-custom-attribute
      :show="showCustomAttributeModal"
      @cancel="toggleCustomAttributeModal"
      @create="createCustomAttribute"
    />
  </div>
</template>
<script>
import EditContact from 'dashboard/routes/dashboard/conversation/contact/EditContact.vue';
import NewConversation from 'dashboard/routes/dashboard/conversation/contact/NewConversation.vue';
import AddCustomAttribute from 'dashboard/modules/contact/components/AddCustomAttribute.vue';
import ContactIntro from './ContactIntro.vue';
import ContactFields from './ContactFields.vue';

import contactsMixin from "shared/mixins/contactsMixin";

export default {
  mixins: [contactsMixin],
  components: {
    AddCustomAttribute,
    ContactFields,
    ContactIntro,
    EditContact,
    NewConversation,
  },
  props: {
    contact: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      showCustomAttributeModal: false,
      showEditModal: false,
      showConversationModal: false,
    };
  },
  computed: {
    enableNewConversation() {
      return this.contact && this.contact.id;
    },
  },

  computed: {
    ...mapGetters({
      currentUser: "getCurrentUser",
    }),
  },

  methods: {
    toggleCustomAttributeModal() {
      this.showCustomAttributeModal = !this.showCustomAttributeModal;
    },
    toggleEditModal() {
      this.showEditModal = !this.showEditModal;
    },
    toggleConversationModal() {
      this.showConversationModal = !this.showConversationModal;
    },
    createCustomAttribute(data) {
      const { id } = this.contact;
      const { attributeValue, attributeName } = data;
      const updatedFields = {
        id,
        custom_attributes: {
          [attributeName]: attributeValue,
        },
      };
      this.updateContact(updatedFields);
    },
    updateField(data) {
      const { id } = this.contact;
      const updatedFields = {
        id,
        ...data,
      };
      this.updateContact(updatedFields);
    },
    updateContact(contactItem) {
      // const { account_id, access_token } = this.currentUser;
      // const contact_id = this.contact.id;
      // const { org_id } = contactItem;
      // const dataAccount =  { account_id, contact_id, org_id, access_token };
      // await this.dataSyncCRM( dataAccount );

      console.log("Actualización...");

      this.$store.dispatch('contacts/update', contactItem);
    },
  },
};
</script>

<style scoped lang="scss">
.panel {
  padding: var(--space-normal) var(--space-normal);
}
</style>
