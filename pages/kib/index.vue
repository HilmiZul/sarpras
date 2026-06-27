<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5 text-muted">{{ route.path.toUpperCase().replace('/', ' ') }}</span>
      <div class="fw-normal text-muted">Kartu Inventaris Barang</div>
    </div>

    <div class="card-body">
      <div class="text-center text-muted p-5">
        <i class="bi bi-cone-striped fs-2"></i>
        <div class="fs-5 fw-bold">Sedang dalam pengembangan.</div>
      </div>
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

const route = useRoute()
</script>
