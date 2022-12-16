<template lang="pug">
form#primeForm(v-on:submit.prevent = "submit")
    fieldset
        legend Prime Number Finder
        |
        label Enter Number: 
            input(type = `number` name = `argument` v-bind:disabled = "waiting" v-model = "argument" max = 100000000 min = 1 required)
        |
        button.evaluator(v-bind:disabled = "waiting") Find
</template>
<script>
import { runAsync } from '@/scripts/app_util'
export default {
    data() {
        return {
            argument: 0,
            waiting: false,
            errors: []
        }
    },
    computed: {
        display: {
            get: function () {
                return this.$store.state.display.prime
            },
            set: function (payload) {
                this.$store.commit("display", { prime: payload })
            }
        }
    },
    methods: {
        async submit() {
            this.waiting = true;
            try {
                const answer = await runAsync([this.argument], 'findPrime');console.log("answer received: " , answer)
                this.display = [{ type: "plain-text", content: { text: answer } }];
            } catch(error) {
                this.display =  [{ type: "error-message", content: { error } }];console.log(error)
                this.errors.push(error);
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