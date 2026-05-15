<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5">PENGATURAN</span>
      <div class="fw-normal text-muted">Aplikasi dan Personalisasi</div>
    </div>

    <div class="card-body">
      <ul class="nav nav-tabs fw-bold" role="tablist">
        <li class="nav-item" role="presentation">
          <a class="nav-link active" data-bs-toggle="tab" href="#personalisasi" aria-selected="true" role="tab">Personalisasi</a>
        </li>

        <li class="nav-item" role="presentation">
          <a class="nav-link" data-bs-toggle="tab" href="#password" aria-selected="true" role="tab">Password</a>
        </li>
      </ul>

      <div id="myTabContent" class="tab-content">
        <div class="tab-pane active show" id="personalisasi" role="tabpanel">
          nama dan avatar
        </div>

        <div class="tab-pane show" id="password" role="tabpanel">
          Ubah password
        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "Pengaturan — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})
</script>
