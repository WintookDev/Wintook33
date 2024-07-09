<template>
    <div class="profile--settings--row row">
        <div class="columns small-3">
          <h4 class="block-title">
            Tipo de Licenciamiento
          </h4>
        </div>
        <div class="columns small-9 medium-5">
          <label>Plan              : {{ this.detalleCuenta.plan_licenciamiento_descripcion }}</label>
          <label>Fecha Inicio      : {{ this.detalleCuenta.fecha_inicio }}</label>
          <label>Fecha Vencimiento : {{ this.detalleCuenta.fecha_vencimiento }}</label>
        </div>
      </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            detalleCuenta: {},
        };
    },
    computed: {
        ...mapGetters({
            currentUser: 'getCurrentUser',
        }),
    },
    mounted() {
        this.initialize();
    },
    methods: {
        async initialize() {
            const detalle = await axios.get(process.env.URL_LICENCIAS+'/api/detalle-cuenta-plan', {
                params: { usuario_token : this.currentUser.access_token }
            })
            .then(function (resp) { return resp.data[0]; })
            .catch(function (error) { return error; });
            this.detalleCuenta = detalle;
        }
    }
}

</script>


<style lang="scss">
    @import '~dashboard/assets/scss/variables.scss';
    @import '~dashboard/assets/scss/mixins.scss';
    
    .profile--settings {
        padding: 24px;
        overflow: auto;
    }

    .profile--settings--row {
        @include border-normal-bottom;
        padding: $space-normal;
        .small-3 {
            padding: $space-normal $space-medium $space-normal 0;
        }
        .small-9 {
            padding: $space-normal;
        }
    }

    .current-version {
        font-size: var(--font-size-small);
        text-align: center;
        padding: var(--space-normal);
    }
</style>
