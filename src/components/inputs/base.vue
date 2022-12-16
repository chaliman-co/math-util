<template lang="pug">
form#baseForm(accept-charset = `utf-8` v-on:submit.prevent = "submit")
    fieldset
        legend Base Converter 
        |
        label Number: 
            input(type = `text` name = `number` v-model = `number` v-bind:disabled = "waiting"  v-bind:readonly = "waiting" pattern = `^[\\-\\+]?((\\w+)|[\\-\\+]?((\\w+)?(\\.\\w+)))$`  required)
        |
        label Base : 
            input(type = `number` name = `base` v-model = `base` v-bind:disabled = "waiting"  v-bind:readonly = "waiting" max = 36 min = 2  required)
        |
        label New Base : 
            input(type = `number` name = `newbase` v-model = `newBase` v-bind:disabled = "waiting"  v-bind:readonly = "waiting" max = 36 min = 2  required)
        |
        button.evaluator(v-bind:disabled = "waiting"  v-bind:readonly = "waiting" v-bind:style = "waiting? 'is-button-waiting': null") Convert
</template>
<script>
import { runAsync } from '@/scripts/app_util'
export default {
    data() {
        return {
            active: false,
            waiting: false,
            errors: [],
            number: null,
            base: null,
            newBase: null
        }
    },
    computed: {
        display: {
            get: function () {
                return this.$store.state.display.base
            },
            set: function (payload) {
                this.$store.commit("display", { base: payload })
            }
        }
    },
    methods: {
        async submit() {
            this.waiting = true;
            try {
                const answer = await runAsync([this.number, this.base, this.newBase], "convertToBase");
                this.display = [{ type: "plain-text", content: { text: answer } }];
            } catch(error) {console.log("error caught: " , error)
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