import { createRouter, createWebHashHistory } from 'vue-router';
import Map from '../views/MapView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/', component: Map }],
});

export default router;
