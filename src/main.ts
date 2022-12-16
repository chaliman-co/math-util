import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import "katex/dist/katex.min.css";

const app = createApp(App).use(store).use(router);
app.mount('#app');

