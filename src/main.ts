import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import outputs from "./components/outputs/index";
import "katex/dist/katex.min.css";

const app = createApp(App).use(store).use(router);
app.component("math-polynomial", outputs['math-polynomial'])
app.mount('#app');

