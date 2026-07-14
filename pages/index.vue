<template>
  <div class="card mt-2 pb-4">
    <div class="card-body">
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
</script>


<style scoped>
table.table {
  height: 100%;
}
</style>
