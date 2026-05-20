<template>
  <div class="card mt-2">
    <div class="card-body">
      <h5>hola, <strong>{{ nama }}</strong>!</h5>

      <ul>
        <li>statistik assets</li>
        <li>realtime total belanja tahun ini (Rp)</li>
        <li>daftar issue</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "Sarpras — SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const user = usePbUser()
const nama = user?.user.value.nama
const role = user?.user.value.role
</script>


<style scoped>
table.table {
  height: 100%;
}
</style>
