<template>
    <div class="row" v-if="selectedTabIndex === 4">
        <div class="bg-white dark:bg-slate-800 border border-solid border-slate-75 dark:border-slate-700/50 rounded-sm mb-4 p-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div class="flex items-center justify-start m-0 mx-4 flex-1">

                    <div class="small-12 columns integration">
                        <sinonimos-index />
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import SinonimosIndex from '../sinonimos/SinonimosIndex';
export default {
    data() {
        return {
            catalogo_blog_id: 0,
            cuenta_blog_id: 0,
            cuenta_blog_url: '',
            showCuentaBlog: false,
            cuentasBlog: {},
        }
    },
    components: {
        SinonimosIndex,
    },
    props: {
        selectedTabIndex: {
            type: Number,
            default: 0
        }
    },
    methods: {
        agregarCuentaBlog() {
            this.catalogo_blog_id = 0;
            this.cuenta_blog_id = 0;
            this.cuenta_blog_url = '';
            this.showCuentaBlog = true;
        },
        async editarCuentaBlog(id) { },
        openDeletePopup(response) { }

    }
}
</script>