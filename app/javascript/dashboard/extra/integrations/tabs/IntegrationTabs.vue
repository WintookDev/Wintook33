<template>
        <div class="row">
            <div class="small-12 columns integrations-wrap">
                <woot-tabs :index="selectedTabIndex" @change="onClickTabChange">
                    <woot-tabs-item
                        v-for="tab in tabs"
                        :key="tab.key"
                        :name="tab.name"
                        :show-badge="false"
                    />
                </woot-tabs>
            </div>
        </div>
</template>

<script>
    export default {
        props: {
            selectedTabIndex: {
                type: Number,
                default: 0
            },
            onClickTabChange: {
                type: Function,
                default: () => {},
            },
        },
        computed: {
            tabs() {
                return [
                    { key: 0, name: "WebHooks" },
                    { key: 1, name: "Orígenes Bot Eva"  },
                    { key: 2, name: "Canales Bot Eva" },
                    { key: 3, name: "Vocabulario" },
                    { key: 4, name: "Sinónimos" },
                    { key: 5, name: "Entrenamiento EVaBotx" },
                ];
            },
        },

        methods: {
            async onClickTabChange(index) {
                this.selectedTabIndex = index;
                
                // if (index === 1) {
                //   this.getCuentaApi();
                // }
                // if (index === 2){
                //   this.getListInboxes();
                // }
            },
        },
    }
</script>
