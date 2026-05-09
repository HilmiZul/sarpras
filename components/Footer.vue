<template>
  <footer class="text-center text-muted m-4 p-2">
    <div>v{{ version }}</div>
    &copy; 2026 - {{ currYear }}. Sarpras SMKN 4 Tasikmalaya.
  </footer>
</template>

<script setup>
import { useRuntimeConfig } from 'nuxt/app';

const currYear = new Date().getFullYear()
const config = useRuntimeConfig()
const version = config.public.appVersion
</script>


<style scoped>
footer {
  font-size: .85rem;
  /* border: 1px solid #dfdfdf; */
}
</style>
