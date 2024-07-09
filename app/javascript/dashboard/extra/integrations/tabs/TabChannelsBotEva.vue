<template>
    <div v-if="selectedTabIndex === 2" class="flex flex-col">
        <div
      class="bg-white dark:bg-slate-800 border border-solid border-slate-75 dark:border-slate-700/50 rounded-sm mb-4 p-4">

        <div class="small-12 columns integrations-wrap">
            <div class="row integrations">
                <div class="row">
                    <div class="small-12 columns integration">

                        <MsgChannel/>

                    </div>
                </div>
            </div>
        </div>

        <div class="small-12 columns integrations-wrap">
            <div class="row integrations">
                <div class="small-12 columns integration">
                    <div class="row">
                        <!-- <div class="row">
                            <div class="column"> -->
                                <table class="woot-table">
                                    <thead>
                                        <th>
                                            <woot-button v-tooltip=" 'Bot EVAi' " title=" 'Bot Eva' "
                                                icon-size="14" variant="smooth" size="small expanded"
                                                :color-scheme="this.colorSchemeI" @click="setBotAccount">
                                                {{ this.textButtonI }}
                                            </woot-button>
                                        </th>
                                    </thead>
                                    <thead>
                                    <th>{{ 'Nombre de Canal' }}</th>
                                    <th>{{ 'Aplicación' }}</th>
                                    <th>{{ 'Bot EVA' }}</th>
                                    </thead>
                                    <tbody>
                                    <tr v-for="inbox in this.listInboxes" :key="inbox.id">
                                        <td>{{ inbox.name }}</td>
                                        <td>
                                        <span v-if="inbox.channel_type === 'Channel::FacebookPage'">  Facebook</span>
                                        <span v-if="inbox.channel_type === 'Channel::WebWidget'">     Website </span>
                                        <span v-if="inbox.channel_type === 'Channel::TwitterProfile'">Twitter</span>
                                        <span v-if="inbox.channel_type === 'Channel::TwilioSms'">     Whatsapp</span>
                                        <span v-if="inbox.channel_type === 'Channel::Whatsapp'">      Whatsapp</span>
                                        <span v-if="inbox.channel_type === 'Channel::Email'">         Email   </span>
                                        <span v-if="inbox.channel_type === 'Channel::Telegram'">      Telegram </span>
                                        <span v-if="inbox.channel_type === 'Channel::Line'">          Line</span>
                                        </td>
                                        <td class="button-wrapper">
                                        <woot-button v-if="inbox.bot" v-tooltip=" 'Bot EVAi' "
                                            title=" 'Bot Eva' " color-scheme="primary"
                                            icon-size="14" variant="smooth"
                                            size="small expanded" @click="setBotInbox(inbox.id)">
                                            {{ 'Encendido' }}
                                        </woot-button>
                                        <woot-button v-if="!inbox.bot" v-tooltip=" 'Bot EVAi' "
                                            title=" 'Bot Eva' " color-scheme="alert"
                                            icon-size="14" variant="smooth"
                                            size="small expanded" @click="setBotInbox(inbox.id)">
                                            {{ 'Apagado' }}
                                        </woot-button>
                                        </td>
                                                    <!-- @click="editarCuentaBlog(cuentaBlog.cuenta_blog_id)" -->
                                    </tr>
                                    </tbody>
                                </table>

                            <!-- </div>
                        </div> -->
                        
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
import MsgChannel from './MsgChannel'

    export default {
        data() {
            return {
                listInboxes: {},
                textButtonI: '',
                colorSchemeI: '',
                botI: false,
                cuentasBlog: {},
            }
        },
        components: {
            MsgChannel,
        },
        props: {
            selectedTabIndex: {
                type: Number,
                default: 0
            }
        },
        computed: {
            ...mapGetters({
                currentUser: 'getCurrentUser',
                inboxesList: 'inboxes/getInboxes',
            }),
        },
        mounted() {
            this.getListInboxes();
            this.getBotAccount();
        },
        methods: {
            async getListInboxes(){
                this.listInboxes = null;
                let access_token     = this.currentUser.access_token;
                let reponse = await axios.get(process.env.URL_WEBHOOK+'/api/getListInboxes', {
                    params: { 
                    access_token : access_token
                    }
                })
                .then(function (resp) { return resp.data; })
                .catch(function (error) { return error; });
                if (reponse.status == 200) {
                    this.listInboxes = reponse.data;
                    // console.log(this.listInboxes);
                }
            },

            async setBotInbox(inboxId){
                let access_token = this.currentUser.access_token;
                let result = await axios.get(process.env.URL_WEBHOOK+'/api/setBotInbox', {
                        params: {
                    access_token : access_token,
                    inbox_id     : inboxId,  
                    }
                })
                .then(function (resp) { return resp.data; })
                .catch(function (error) { return error; });
                if (result.status == 200) {
                    this.getListInboxes();
                    bus.$emit('newToastMessage', result.toastMessage);
                }
            },

            async setBotAccount(){
                const { access_token, account_id } = this.currentUser;
                const result = await axios.get(process.env.URL_WEBHOOK+'/api/setBotAccount', {
                    params: { access_token, account_id }
                })
                .then(function (resp) { return resp.data; })
                .catch(function (error) { return error; });
                console.log(result);
                if (result.status === 200) {
                    this.textButtonI  = result.textButton;
                    this.colorSchemeI = result.colorScheme;
                    this.botI = result.bot;
                    bus.$emit('newToastMessage', result.toastMessage);
                }
            },

            async getBotAccount(){
                const { access_token, account_id } = this.currentUser;
                const result = await axios.get(process.env.URL_WEBHOOK+'/api/getBotAccount', {
                    params: { access_token, account_id }
                })
                .then(function (resp) { return resp.data; })
                .catch(function (error) { return error; });
                if (result.status === 200) {
                    this.textButtonI  = result.textButton;
                    this.colorSchemeI = result.colorScheme;
                    this.botI = result.bot;
                }
            },

        }
    }
</script>