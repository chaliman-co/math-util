<template lang="pug">
//- span
//-   span(v-if="terms.length == 0") 0
//-   math-term(v-else, v-bind = "terms[0]")
//-   math-term(v-for = "term, index in terms.slice(1)", v-bind:key = "index", v-bind = "term") {{ term.coefficient > 0 ? "+" : "" }}
span(v-html="katexRender")
</template>

<script>
import { Polynomial } from "@/scripts/utils";
import katex from "katex";
const mathTerm = require("./mathTerm.vue").default;
export default {
  props: {
    "terms": { type: Array }
  },
  components: {
    "math-term": mathTerm
  },
  data() {
    return {
      rawOutput: formatPolynomial(this.terms)
    };
  },
  computed: {
    katexRender() {
      return katex.renderToString(String.raw`${this.rawOutput}`, { /*output: "mathml",*/ displayMode: false, trust: true });
    }
  },
}
function formatPolynomial(terms) {
  return terms.length == 0 ? "0" : [(terms[0].coefficient < 0? "-": "") + formatTerm(terms[0]), ...terms.slice(1).map(term => term.coefficient > 0 ? " + " + formatTerm(term) : " - " + formatTerm(term))].join(" ")
}
function formatTerm(term) {
  const coefficient = Math.abs(term.coefficient);
  const variables = term.variables;
  const formattedVariables = variables.map(exponential => formatExponential(exponential)).join("");
  return (coefficient == 1 && variables.length > 0 ? "" :  String(coefficient)) + (!isNaN(Number(formattedVariables[0])) && coefficient != 1? `(${formattedVariables})`: formattedVariables);
}
function formatExponential(exponential) {
  let base = exponential.base instanceof Polynomial ? formatPolynomial(exponential.base.terms) : String(exponential.base);
  const power = exponential.power instanceof Polynomial ? formatPolynomial(exponential.power.terms) : exponential.power != 1 ? String(exponential.power) : "";
  if (base.length > 1 && exponential.power != 1) {
    base = `(${base})`;
  }
  return base + (power.length ? `^{${power}}` : "");
}
</script>
