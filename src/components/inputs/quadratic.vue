<template lang="pug">
form#quadraticForm(accept-charset = `utf-8`, v-on:submit.prevent = "submit")
    fieldset
        legend Quadratic functions root finder 
        label Enter function: 
            input(type =`text`, name = `argument`, v-bind:disabled = "waiting", v-model = "argument" required) 
        button.evaluator(v-bind:disabled = "waiting") Evaluate
</template>
<script>
import { runAsync } from '@/scripts/app_util';
export default {
    data() {
        return {
            errors: [],
            waiting: false,
            argument: ""
        }
    },
    methods: {
        async submit() {
            this.waiting = true;
            try {
                let answer = await runAsync([this.argument], 'quadraticRoots');
                let output;
                if (answer.type == "simple") {
                    output = [{ type: "plain-text", content: { text: `${answer.variable}  = ` } }, { type: "math-fraction", content: answer.ans1 }].concat(
                        answer.ans1.valueOf() === answer.ans2.valueOf() ? [] : [{ type: "plain-text", content: { text: ` , ${answer.variable}  = ` } }, { type: "math-fraction", content: answer.ans2 }]);
                }
                if (answer.type == "surd/complex") {
                    output = [{ type: "plain-text", content: { text: `${answer.variable}  = ` } }, { type: "math-fraction", content: answer.first }, { type: "plain-text", content: { text: " \u00B1 " } }, { type: "math-fraction", content: answer.determinant }];
                    if (answer.first == 0) output.splice(1, 1);
                }
                this.display = output;
            } catch (error) {
                this.errors.push(error);
                this.display = [{ type: "error-message", content: { error } }]; 
            }
            this.waiting = false;
        }
    },
    computed: {
        display: {
            get: function () {
                return this.$store.state.display.quadratic
            },
            set: function (payload) {
                this.$store.commit("display", { quadratic: payload })
            }
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
