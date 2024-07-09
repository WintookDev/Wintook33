<template>
  <div>
    <LinkCompany compact :title="$t('CONTACT_FORM.FORM.COMPANY_NAME.LABEL')">
      <template v-slot:button>
        <woot-button icon="arrow-right" variant="link" size="small" @click="onSelfAssign">
            {{ $t('CONVERSATION_SIDEBAR.SELF_ASSIGN') }}
        </woot-button>
      </template>
    </LinkCompany>
    
    <woot-input v-model="companyName"  @input="updateValue"
      class="columns"
      :placeholder="$t('CONTACT_FORM.FORM.COMPANY_NAME.PLACEHOLDER')"
    />
  </div>
</template>

<script>
import LinkCompany from './LinkCompany';
export default {
  components: {
    LinkCompany,
  },
  props: {
    companyName: {
      type: String,
      default: '',
    },
    getCompanyName: {
      type: String,
      default: '',
    },
  },
  setup(props, context ){
      function updateValue(event) {
        context.emit("update:companyName", event.target.value);
      }
      return {
        updateValue
      };
  },
};
</script>


  


<style scoped lang="scss">

.columns {
    padding: 0 0;
}

.contact--form {
  padding: var(--space-normal) var(--space-large) var(--space-large);

  .columns {
    padding: 0 0;
  }
}

.input-group-label {
  font-size: var(--font-size-small);
}
</style>

  