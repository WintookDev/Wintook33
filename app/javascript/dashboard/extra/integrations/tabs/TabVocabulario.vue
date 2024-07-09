<template>
    <div class="row" v-if="selectedTabIndex === 3">
        <div class="bg-white dark:bg-slate-800 border border-solid border-slate-75 dark:border-slate-700/50 rounded-sm mb-4 p-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div class="flex items-center justify-start m-0 mx-4 flex-1">

                    <div class="row">
                        <vocabulario-index />
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