<template lang="pug">
form#polynomialForm(accept-charset = `utf-8`, v-on:submit.prevent = "submit")
    fieldset   
        legend Polynomial Expressions Expander
        |
        label Enter function: 
        input(type = `text`, name = `argument`, v-model = "argument", v-bind:disabled = "waiting"
        /* pattern = `\\([\\+\\-]?\\d*[a-zA-Z]*[\\+\\-]\\d*[a-zA-Z]*\\)(\\^\\(?[\\+]?\\d)?[\\+]?\\d*\\)?` */
        placeholder = `e.g. (4x+6)^2` required)
        |
        button.evaluator(v-bind:disabled = "waiting") Expand
</template>
<script>
import { runAsync } from '@/scripts/app_util'
export default {
    data() {
        return {
            errors: [],
            argument: "",
            waiting: false
        }
    },
    computed: {
        display: {
            get: function () {
                return this.$store.state.display.binomial
            },
            set: function (payload) {
                this.$store.commit("display", { polynomial: payload })
            }
        }
    },
    methods: {
        async submit() {
            this.waiting = true;
            try {
                const terms = await runAsync([this.argument], "polynomialExpand");
                this.display = [{ type: "math-polynomial", content: { terms } }];
            } catch(error) {
                this.errors.push(error);
                this.display = [{ type: "error-message", content: { error } }];
            }
            this.waiting = false;
        }
    },
    watch: {
        waiting(value) {
            if (value) {
                this.display = [{ type: "delay-message", content: { message: "Processing please wait" } }]
            }
        }
    }
}
</script>

