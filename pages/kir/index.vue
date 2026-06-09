<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5 text-muted">{{ route.path.toUpperCase().replace('/', ' ') }}</span>
      <div class="fw-normal text-muted">Kartu Inventaris Ruang</div>
    </div>

    <div class="card-body">
      <ul>
        <li>bentuk card</li>
        <li>preview modal aset didalam unit kerja / ruangan tersebut</li>
        <ul>
          <li>pada preview jika ada ruangan dalam unit kerja, maka tampilkan</li>
          <li>kalo engga, unti kerja saja (ruangan)</li>
        </ul>
      </ul>
    </div>

  </div>
</template>


<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "KIR — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const route = useRoute()
</script>
