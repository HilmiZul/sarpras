<template>
  <div class="card mt-2 pb-4">
    <div class="card-body">
      <div class="alert alert-secondary fs-4 fw-bold text-muted px-4 py-5 mb-5">
        Hallo, {{ nama }}!
      </div>

      <OverviewStatisticCard />

      <div class="row">
        <div class="col-md-6">
          <OverviewIssues />
        </div>

        <div class="col-md-6">
          <OverviewPengajuan />
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
  title: "Sarpras — SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const user = usePbUser()
const nama = user?.user.value.nama
</script>


<style scoped>
table.table {
  height: 100%;
}
</style>
