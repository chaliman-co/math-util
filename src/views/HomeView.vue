<template lang="pug">
header.container.primaryheader
  |
  h1 WELCOME TO THE MATH UTILITY PAGE.
  |
  p.instruction Please select one of the options to the left to begin.
  .navigator
    button.navicon.animated(role="button" @click="navToggle")
      span
      span
      span

section.floated-info
  aside.col-1-3.animated.optionbox
    ul#options(data-default_color = `orange` data-active_color = `#8080C0`)
      li.option-item(v-for = "option in options" v-bind:class = "option === activeOption ? 'is-active-option-item' : null")
        a.option-link(v-on:click.prevent = `activateOption(option), navToggle()`)
          | {{option.description}}
    |
    hr
    |
    button.navigate: a(data-action = `showMore` href = `javascript:void(0)`) More&gt;&gt;
  |
  #display.col-2-3()
    component(v-for = "(output, index) in display", v-bind:is = "output.type", v-bind:key = "index", v-bind = "output.content")
  |
  #instructions.col-1-3 Please read the instructions carefully and take care to input your arguments according to the format specified.
section.container
  section.argument-forms
    keep-alive
      component(v-bind:is = "activeOption.inputComponent")
footer.container
  small
    p &copy; Chaluchukwu Utility Functions
        
</template>

<script lang="ts">
import { defineComponent } from "vue";
import inputComponents from "../components/inputs";
import outputComponents from "@/components/outputs";
export default defineComponent({
  data() {
    return {
      options: {
        base: {
          name: "base",
          description: "Perform base conversions",
          inputComponent: "base-input"
        },
        polynomial: {
          name: "polynomial",
          description: "Expand a polynomial expression",
          inputComponent: "polynomial-input"
        },
        prime: {
          name: "prime",
          description: "Calculate the nth prime number",
          inputComponent: "prime-input"
        },
        quadratic: {
          name: "quadratic",
          description: "Evaluate roots of quadratic function",
          inputComponent: "quadratic-input"
        },
        vector: {
          name: "vector",
          description: "Manipulate vectors"
        },
      },
      activeOption: {
        name: "default",
      },
      worker: null
    };
  },
  computed: {
    display(): any {
      return (this?.$store.state.display[this.activeOption.name])
    }
  },
  methods: {
    activateOption(option: { name: string, description: string, inputComponent: string }) {
      this.activeOption = option;
    },
    navToggle() {
      var nav = document.getElementsByClassName("optionbox")[0], navToggle = document.getElementsByClassName("navicon")[0];
      nav.classList.toggle("showing");
      navToggle.classList.toggle("showing");
    }
  },
  components: { ...inputComponents, ...outputComponents },
})


</script>
