import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Vuetify
import 'vuetify/styles';
import createVuetify from './plugins/vuetify';

const vuetify = createVuetify();

const app = createApp(App).use(vuetify);

app.use(router);

app.mount('#app');
