import { createStore } from 'vuex';

export default createStore({
  state: {
    display: {
        default: [{ type: "plain-text", content: { text: "Result Goes Here"}}],
        base: [{ type: "plain-text", content: { text: "Please Enter Number, Its Base And The Target Base" } }],
        prime: [{ type: "plain-text", content: { text: "Please Enter A Number" } }],
        quadratic: [{ type: "plain-text", content: { text: "Please Enter A Function" } }],
        polynomial: [{ type: "plain-text", content: { text: "Please Enter A Function" } }],
        vector: [{ type: "error-message", content: {error: new Error("Not yet implemented!")} }]
    }
},
mutations: {
    display(state, displayState) {
        Object.assign(state.display, displayState);
    }
}
})
