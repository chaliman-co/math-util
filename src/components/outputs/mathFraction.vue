<template lang="pug">
span.fraction-container
    span.top(v-bind:class = "!denomIsVisible? 'is-whole-number': null") {{numeLength >= denomLength? nume: `${"&nbsp".repeat(((numeLength - denomLength)/2)+1)} ${nume} ${"&nbsp".repeat(((numeLength - denomLength)/2)+1)}`}}
    br(v-if = "denomIsVisible")
    span.bottom(v-if = "denomIsVisible") {{denom}}
</template>

<script>
export default {
    props: ["nume", "denom"],
    methods: {

    },
    computed: {
        denomIsVisible() {
            return !((this.denom == 1) || (this.nume == 0))
        },
        numeLength() {
            return String(this.nume).length
        },
        denomLength() {
            return String(this.denom).length
        }
    }
}
</script>

<style scoped>
.fraction-container {
    display: inline-block;
    line-height: 0.86em;
    vertical-align: -0.72em
}

.is-whole-number {
    text-decoration: none !important;
}

.top {
    text-decoration: underline;
}
</style>

