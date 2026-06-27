<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5 text-muted">{{ route.path.toUpperCase().replace('/', ' ') }}</span>
      <span v-if="role == 'sarpras'" class="float-end">
        <NuxtLink to="/inventaris/bahan/tambah" class="btn btn-primary me-2"><i class="bi bi-plus"></i> Tambah baru</NuxtLink>
      </span>
      <div class="fw-normal text-muted">Inventaris Bahan</div>
    </div>

    <div class="card-body">
      <div class="text-center text-muted p-5">
        <i class="bi bi-cone-striped fs-2"></i>
        <div class="fs-5 fw-bold">Sedang dalam pengembangan.</div>
      </div>
    </div>

    <div class="card-footer bg-transparent">
      <div class="text-center">
        <span class="float-end text-muted fw-bold">50 / 100</span>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Inventaris Aset — SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya.",
});
const user = usePbUser();
const role = user?.user.value.role;
const route = useRoute()

const filter = ref({
  keyword: "",
  jenis_aset: "",
  tahun: "",
  sumber: "",
  unit_kerja: "",
  lokasi: "",
});

function resetFilter() {
  filter.value.keyword = "";
  filter.value.jenis_aset = "";
  filter.value.tahun = "";
  filter.value.sumber = "";
  filter.value.unit_kerja = "";
  filter.value.lokasi = ""
}
</script>

<style scoped>
table.table {
  height: 100%;
}
</style>
