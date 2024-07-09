<template>
    <div class="row" v-if="selectedTabIndex === 3" v-show="false">
        <div class="small-12 columns integrations-wrap">
            <div class="row integrations">
                <div class="small-12 columns integration">
                    
                    <div class="row">
                        <div class="column">
                        <form @submit.prevent="updateUser('profile')">
                            <label :class="{}">
                                {{ 'Aplicación API' }}
                                <select v-model="api_type" :disabled="modoReadOnly">
                                    <option value="0">
                                        {{ 'Seleccione una opción' }}
                                    </option>
                                    <option value="1">
                                        {{ 'CRMZeus' }}
                                    </option>
                                </select>
                            </label>
                            <label>
                                {{ 'Dirección URL Base' }}
                                <input type="url" v-model="api_url_base"
                                :placeholder=" 'Introduzca dirección url base de la API' "
                                :disabled="modoReadOnly"/>
                            </label>
                            <label>
                            {{ 'Token API' }}
                            <input type="text" v-model="api_access_token"
                                :placeholder=" 'Introduzca token de la API' "
                                :disabled="modoReadOnly"/>
                            </label>
                            <woot-button @click="setCuentaApi()"    v-if="!modoReadOnly"
                                :is-disabled="!this.api_url_base || !this.api_access_token">{{ 'Guardar' }}</woot-button>
                            <woot-button @click="editCuentaApi()"   v-if="modoReadOnly">{{ 'Editar' }}</woot-button>   
                            <woot-button @click="deleteCuentaApi()" v-if="modoReadOnly">{{ 'Eliminar' }}</woot-button>   
                        </form>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                modoReadOnly: false,
                apps: {},
                api_type: 0,
                api_url_base: '',
                api_access_token: '',
            }
        },
        props: {
            selectedTabIndex: {
                type: Number,
                default: 0
            }
        },
        computed: {
            ...mapGetters({
            integrationsList: 'integrations/getIntegrations',
            currentUser: 'getCurrentUser',
            }),
            
        },
        mounted() {
            this.getCuentaApi();
        },
        methods: {
            async setCuentaApi(){
                const { access_token, account_id } = this.currentUser;
                const api_type  = this.api_type;
                const api_access_token = this.api_access_token;
                const api_url_base  = this.api_url_base;
                const result = await axios.post(process.env.URL_WEBHOOK+'/api/setCuentasApi', {
                    access_token, account_id, api_type, api_access_token, api_url_base,  
                })
                .then(function (resp) { return resp.data; })
                .catch(function (error) { return error; });
                this.modoReadOnly = true;
                bus.$emit('newToastMessage', result.msg);
            },

            async getCuentaApi(){
                const { access_token, account_id } = this.currentUser;
                let result = await axios.get(process.env.URL_WEBHOOK+'/api/getCuentasApi', {
                    params: {
                        access_token : access_token,
                        account_id     : account_id,  
                    }
                })
                .then(function (resp) { return resp.data; })
                .catch(function (error) { return error; });
                if (result.status === 200) {
                    this.apps = result.apps;
                    this.api_access_token  = result.api_access_token;
                    this.api_url_base = result.api_url_base;
                    this.api_type = result.api_type;
                    this.modoReadOnly = true;
                }
            },

            async editCuentaApi(){ 
                this.modoReadOnly = false;
            },

            async deleteCuentaApi(){ 
                this.api_type =  0;
                this.api_url_base = "";
                this.api_access_token = "";
                this.setCuentaApi();
                this.modoReadOnly = false;

            },

        }
    }
</script>