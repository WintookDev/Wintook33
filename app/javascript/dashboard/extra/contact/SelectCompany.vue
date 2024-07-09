<template>
  <!-- <woot-modal :show.sync="showOrg" :on-close="onClose">
          <div class="column content-box">
            <woot-modal-header :header-title="'Listado de Organizaciones'"/>
                
            
                    <header class="header">
                        <div class="table-actions-wrap">
                            <div class="left-aligned-wrap">
                                <div class="search-wrap">
                                    <fluent-icon icon="search" class="search-icon" />
                                    @keyup.enter="onSearchSubmit"
                                        @input="onInputSearch"
                                    <input
                                        type="text"
                                        :placeholder="'Buscar'"
                                        class="contact-search"
                                        :value="searchQuery"
                                        
                                    />
                                    @click="onSearchSubmit"
                                    <woot-button
                                        :is-loading="false"
                                        class="clear"
                                        :class-names="searchButtonClass"
                                        
                                    >
                                        {{ 'Buscar' }}
                                    </woot-button>
                                </div>
                            </div>
                        </div>
                    </header>
                    <section class="org-table-wrap">
                        :fixed-header="true"
                        <ve-table 
                            
                            max-height="calc(100vh - 34.2rem)"
                            :columns="columns"
                            :table-data="dataTable"
                            :border-around="false"
                        />
                    </section>
                
          </div>
        </woot-modal> -->
  <woot-modal :show.sync="showOrg" :on-close="onClose" modal-type="centered">
    <div class="column content-box">
      
      <woot-modal-header :header-title="'Lista de Organizaciones'"
        :header-content="'Lista de organizaciones para asignación al contacto.'" />
      
        <header class="header">
        <div class="table-actions-wrap">
          <div class="left-aligned-wrap">
            <div class="search-wrap">
              <fluent-icon icon="search" class="search-icon" />
              <input type="text" :placeholder="'Buscar'" class="contact-search" :value="searchQuery" 
                @keyup.enter="onSearchSubmit" @input="onInputSearch" />
              <woot-button :is-loading="false" class="clear" :class-names="searchButtonClass" @click="onSearchSubmit">
                {{ "Buscar" }}
              </woot-button>
            </div>
          </div>
        </div>
      </header>

      <section class="table-actions-wrap">
        <ve-table :fixed-header="true" max-height="calc(100vh - 34.2rem)" :columns="columns" :table-data="dataTable"
          :border-around="false" />
      </section>
    </div>
  </woot-modal>
</template>

<script>
import { VeTable } from "vue-easytable";

export default {
  data() {
    return {
      sortConfig: {},
    };
  },
  components: {
    VeTable,
  },
  props: {
    dataTable: { type: Array, default: () => [] },
    showOrg: { type: Boolean, default: false },
    searchQuery: { type: String, default: '',},
    onClose: { type: Function, default: () => { } },
    onSelected: { type: Function, default: () => { } },
    onSearchSubmit: { type: Function, default: () => { } },
    onInputSearch: { type: Function, default: () => { } },
  },

  computed: {
    columns() {
      return [
        // {
        //       field: 'RAZON_SOCIAL',
        //       key: 'RAZON_SOCIAL',
        //       title: 'Razón Social',
        //       width: 300,
        //       align: 'left',
        //       sortBy: this.sortConfig.RAZON_SOCIAL || '',
        //   },
        {
          field: "RAZON_SOCIAL",
          key: "RAZON_SOCIAL",
          title: "Razón Social",
          width: 350,
          align: "left",
          renderBodyCell: ({ row }) => (
            <div class="button-wrapper">
              <woot-button
                variant="link"
                color-scheme="secondary"
                class-names="grey-btn"
                icon="building-bank"
                onClick={() => this.onSelected(row)}
              >
                {`${row.RAZON_SOCIAL}`}
              </woot-button>
            </div>
          ),
        },
      ];
    },
  },

  // watch: {
  //     showOrg(newShowOrg, oldShowOrg) {
  //         if(newShowOrg) {
  //             this.getOrganizaciones();
  //         }
  //     },
  // },

  methods: {
    onClose() {
      this.showOrg = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~dashboard/assets/scss/mixins";

.org-table-wrap {
  flex: 1 1;
  height: 100%;
  overflow: hidden;
}

.org-table-wrap::v-deep {
  .ve-table {
    padding-bottom: var(--space-large);
    margin: var(--space-large);
  }

  .row--user-block {
    align-items: center;
    display: flex;
    text-align: left;

    .user-block {
      min-width: 0;
    }

    .user-thumbnail-box {
      margin-right: var(--space-small);
    }

    .user-name {
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-medium);
      margin: 0;
      text-transform: capitalize;
    }

    .view-details--button {
      color: var(--color-body);
    }

    .user-email {
      margin: 0;
    }
  }

  .ve-table-header-th {
    padding: var(--space-small) var(--space-two) !important;
  }

  .ve-table-body-td {
    padding: var(--space-small) var(--space-two) !important;
  }

  .ve-table-header-th {
    font-size: var(--font-size-mini) !important;
  }

  .ve-table-sort {
    top: -4px;
  }
}

.filters-wrap {
  padding: var(--space-normal);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--color-border);
  background: var(--color-background-light);
  margin-bottom: var(--space-normal);
}

.filter-actions {
  margin-top: var(--space-normal);
}

.table-actions-wrap {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-small) var(--space-normal) var(--space-small) var(--space-normal);
  // padding: var(--space-small) var(--space-zero) var(--space-small) var(--space-zero);
}

.left-aligned-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-aligned-wrap {
  display: flex;
}

.search-wrap {
  width: 250px;
  display: flex;
  align-items: center;
  position: relative;
  margin-right: var(--space-small);

  .search-icon {
    position: absolute;
    top: 1px;
    left: var(--space-one);
    height: 3.8rem;
    line-height: 3.6rem;
    font-size: var(--font-size-medium);
    color: var(--b-700);
  }

  .contact-search {
    margin: 0;
    height: 3.8rem;
    width: 100%;
    padding-left: var(--space-large);
    padding-right: 6rem;
    border-color: var(--s-100);
  }
}
</style>