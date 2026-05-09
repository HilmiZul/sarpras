<template>
  <div v-for="i in props.n" :key="i">
    <p class="placeholder-glow mb-2">
      <span :class="`placeholder col-${props.col} py-3`"></span>
    </p>
  </div>
</template>

<script setup>
let props = defineProps({
  "col": Number,
  "n": Number
})
</script>
