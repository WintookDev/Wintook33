<template>
    <div class="row" v-if="selectedTabIndex === 1">
        <div class="row">
            <div class="small-12 columns integrations-wrap">    
                <div class="row integrations">

                    <div class="small-12 columns integration">
                        <div class="row">
                        <div class="integration--image">
                                <img src="https://app.wintook.com/dashboard/images/integrations/EVAi.svg"/>
                        </div>
                        <div class="column">
                            <div class="column">
                            <h3 class="integration--title">Bot Eva</h3>
                            <p class="integration--description">
                                Permite gestionar consultas por medio de palabras reservadas a sistemas administrativos y palabras no reservadas a blogs, todo esto  por medio de los canales de comunicación Web y Telegram.
                            </p>
                            </div>
                        </div>
                        <div class="small-2 column button-wrap">
                            <button @click="conectarEva" class="button nice" ref="conectorEva">{{ this.estadoEva }}</button>
                        </div>
                        </div>

                        <div class="row">
                        <div class="integration--image">
                        </div>
                        <div class="column">
                            <table class="woot-table">
                                <thead>
                                <th>{{ 'Direccion URL Blog' }}</th>
                                <th></th>
                                <th>
                                    <button @click="agregarCuentaBlog()" class="button nice" ref="conectorEva">
                                    {{ 'Agregar' }}
                                    </button>
                                </th>
                                </thead>
                                <tbody>
                                <tr v-for="cuentaBlog in this.cuentasBlog" :key="cuentaBlog.cuenta_blog_id">
                                    <td>{{ cuentaBlog.cuenta_blog_url }}</td>
                                    <td class="button-wrapper">
                                    <woot-button variant="link" color-scheme="secondary" 
                                        class-names="grey-btn" icon="edit"
                                        @click="editarCuentaBlog(cuentaBlog.cuenta_blog_id)">
                                        {{ 'Editar' }}
                                    </woot-button>
                                    <woot-button variant="link" color-scheme="secondary" 
                                        class-names="grey-btn" icon="dismiss-circle"
                                        @click="openDeletePopup(cuentaBlog)">
                                        {{ 'Eliminar' }}
                                    </woot-button>
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
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