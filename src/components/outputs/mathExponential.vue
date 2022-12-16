<template lang="pug">
span.exponential-container( :class="{'has-exponent': power != 1}")
    span.base(v-if = "base instanceof Polynomial") (#[math-polynomial(:terms="base.terms")])
    span.base(v-else) {{ base.length===1 || power==1 ? base : `(${base})` }}
    span.power(v-if = "power instanceof Polynomial") #[math-polynomial(:terms="power.terms")]
    span.power(v-else-if =  "power  != 1", ) {{power}}
</template>

<style scoped>
.exponential-container {
    display: inline-block;
}
.exponential-container.has-exponent {
    
}


.power {
    line-height: 0;
    vertical-align: top;
    font-size: 0.8em;
    margin-top: -10px;
    display: inline-block;
}
</style>

<script>
import {Polynomial} from "../../scripts/utils";
import poly from "./mathPolynomial";
export default {
    props: {
        power: {
            required: true
        },
        base: {
            required: true
        },
    },
    data() {
        return {
            Polynomial
        }
    },
    components: {
        "math-polynomial": poly
    },
    created() {
    }
}
</script>

