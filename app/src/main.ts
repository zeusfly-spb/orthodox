import './assets/css/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);


app.use(createPinia());



app.config.errorHandler = (err, instance, info) => {
  console.error('Global error handler:', err)
  console.error('Vue instance:', instance)
  console.error('Error info:', info)
}
app.use(router);
app.mount('#app');
