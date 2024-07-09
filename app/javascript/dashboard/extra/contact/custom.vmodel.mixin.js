// custom.vmodel.mixin.js
export default {
    props: {
      value: {}
    },
    data () {
      return {
        companyName: this.value
      }
    },  
    watch: {
        companyName (value) {
             this.$emit('input', value)
           },
      value (value) {
        this.companyName = value
      }
    }
}