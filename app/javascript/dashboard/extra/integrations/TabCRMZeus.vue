<template>
    <div class="row" v-if="selectedTabIndex === 3">
        <div class="small-12 columns integrations-wrap">
            <div class="row integrations">
                <div class="small-12 columns integration">
                    
                    <div class="row">
                        <div class="column">
                        <form @submit.prevent="updateUser('profile')">
                            <label>
                            {{ 'Dirección URL Base' }}
                                <input type="url" v-model="crmzeus_url"
                                :placeholder=" 'Introduzca dirección url base de CRMZeus' "/>
                            </label>
                            <label>
                            {{ 'Token CRMZeus' }}
                            <input type="text" v-model="crmzeus_token"
                                :placeholder=" 'Introduzca token generado en CRMZeus' " />
                            </label>
                            <woot-button @click="setCuentaApi()">{{ 'Guardar Token' }}</woot-button>   
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
                const crmzeus_token = this.crmzeus_token;
                const crmzeus_url  = this.crmzeus_url;
                const result = await axios.post(process.env.URL_WEBHOOK+'/api/setCuentasApi', {
                    access_token, account_id, crmzeus_token, crmzeus_url,  
                })
                .then(function (resp) { return resp.data; })
                .catch(function (error) { return error; });
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
                    this.crmzeus_token  = result.crmzeus_token;
                    this.crmzeus_url = result.crmzeus_url;
                }
            },

        }
    }
</script>