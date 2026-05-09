<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      MASTER RINCIAN ASET
      <div class="fw-normal text-muted">Rincian Kode dan Nama barang</div>
    </div>

    <div class="card-body">
      body konten
    </div>

  </div>
</template>


<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "KIB — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

</script>
