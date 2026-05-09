<template>
  <div class="row mt-5 justify-content-center">
    <div class="col-md-3 fs-3 fst-italic text-center">
      Loggin out
    </div>
  </div>
</template>


<script setup>
const client = usePbClient()

function handleLogout() {
  client.authStore.clear()
  client.realtime.unsubscribe()
  navigateTo('/login')
}

onMounted(() => handleLogout())
</script>
