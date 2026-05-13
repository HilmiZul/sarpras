import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('Multiselect', Multiselect);
});

