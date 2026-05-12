<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5">{{ route.path.toUpperCase().replace('/', ' ') }}</span>
      <span v-if="role == 'sarpras'" class="float-end">
        <NuxtLink to="/inventaris/bahan" class="btn btn-dark me-2">Kembali</NuxtLink>
      </span>
      <div class="fw-normal text-muted">Tambah baru</div>
    </div>

    <div class="card-body">
      <div class="row">
        <div class="col-md-4">

          <form @submit.prevent="buatBaru">
            <div class="mb-3">
              <label for="kode_ring" class="fw-bold">Kode Ring</label>
              <input class="form-control" id="kode_ring" type="text" required />
            </div>
            <div class="mb-3">
              <label for="nama" class="fw-bold">Nama</label>
              <input class="form-control" id="nama" type="text" required />
            </div>
            <div class="mb-3">
              <label for="tanggal" class="fw-bold">Tanggal</label>
              <input class="form-control" id="tanggal" type="datetime-local" required />
            </div>
            <div class="mb-3">
              <label for="tahun" class="fw-bold">Tahun</label>
              <select class="form-select" name="tahun" id="tahun" required>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            <button class="btn btn-primary">Kirim</button>
            <NuxtLink to="/inventaris/bahan" class="btn btn-outline-dark ms-2">Kembali</NuxtLink>
          </form>

        </div>
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
  middleware: 'auth'
})

useHead({
  title: "Tambah Barang — SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})
const user = usePbUser()
const role = user?.user.value.role
const route = useRoute()

if(role != 'sarpras') navigateTo('/barang')

function buatBaru() {
  console.log("buat baru....")
}
</script>


<style scoped>
table.table {
  height: 100%;
}
</style>
