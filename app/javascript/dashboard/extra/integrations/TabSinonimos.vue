<template>
    <div class="row" v-if="selectedTabIndex === 5">
        <div class="row">
            <div class="small-12 columns integrations-wrap">    
                <div class="row integrations">
                    <div class="small-12 columns integration">
                        <sinonimos-index/>
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
            async editarCuentaBlog(id) {},
            openDeletePopup(response) {}

        }
    }
</script>