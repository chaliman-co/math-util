<template lang="pug">
span(v-if = "coefficient != 0")
  slot
  span(v-if = "!variables.length || (coefficient !=  1 && coefficient != -1)") {{coefficient}}
  span(v-else-if = "coefficient == -1") -
  math-exponential(v-for = "variable, index in variables", v-bind:key = "index", :power="variable.power", :base= "variable.base")
</template>

<script>
const mathExponential = require("./mathExponential.vue").default;
export default {
  props: ["coefficient", "variables"],
  components: {
    "math-exponential": mathExponential
  },
  mounted() {
    console.log({coefficient: this.coefficient, variables: this.variables})
  }
}
</script>

