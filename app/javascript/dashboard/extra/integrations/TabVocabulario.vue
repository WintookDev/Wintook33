<template>
    <div class="row" v-if="selectedTabIndex === 4">
        <div class="small-12 columns integrations-wrap">
            <div class="row integrations">
                <div class="small-12 columns integration">

                    <div class="row">
                        <vocabulario-index/>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import VocabularioIndex from '../vocabulario/VocabularioIndex';
    export default {
        components: {
            VocabularioIndex,
        },
        props: {
            selectedTabIndex: {
                type: Number,
                default: 0
            }
        },
        methods: {}
    }
</script>