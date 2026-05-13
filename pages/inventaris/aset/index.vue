<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5">{{ route.path.toUpperCase().replace('/', ' ') }}</span>
      <span v-if="role == 'sarpras'" class="float-end">
        <NuxtLink to="/inventaris/aset/tambah" class="btn btn-primary me-2"><i class="bi bi-plus"></i> Tambah baru</NuxtLink>
      </span>
      <div class="fw-normal text-muted">Inventaris Aset</div>
    </div>

    <div class="card-body">

      <FilterBar :role="role" :assets="assets" @filter-change="handleFilterChange" />

      <LoadingPlaceholder v-if="isLoading" :col="12" :n="10" />

      <div v-else-if="!isLoading && isActiveSearch && assets?.totalItems < 1" class="text-center text-muted p-5 fw-bold">
        <i class="bi bi-search fs-2"></i>
        <div class="fs-5">Pencarian tidak ditemukan.</div>
      </div>

      <div v-else-if="!isLoading && assets?.totalItems < 1" class="text-center text-muted p-5 fw-bold">
        <i class="bi bi-database fs-2"></i>
        <div class="fs-5">Belum Tersedia.</div>
      </div>

      <div v-else class="mb-3">
        <ol v-for="aset in assets.items" :key="aset.id" class="list-group list-group-flush">
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="text-muted">Nama Barang</div>
              <div class="fs-5 fw-bold mb-2">{{ aset.expand.rincian_aset.nama_barang }} <span class="text-muted fw-normal">({{ aset.nama_aset_barang }})</span></div>

              <div class="text-muted">Unit Kerja</div>
              <div class="fw-bold text-muted mb-2">{{ aset.expand.unit_kerja.ruangan }}</div>

              <button @click="setModalBarang(aset)" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#rincian">Lihat</button>
              <NuxtLink :to="`/inventaris/aset/edit/${aset.id}`" class="btn btn-outline-dark btn-sm ms-2">Edit</NuxtLink>
            </div>
            <span class="badge fs-6 text-bg-dark rounded-pill me-2">{{ aset.expand.sumber_aset.nama_sumber }}</span>
            <span class="badge fs-6 text-bg-dark rounded-pill me-2">{{ aset.expand.tahun_pengadaan.tahun }}</span>
            <span class="badge fs-6 text-bg-dark rounded-pill">{{ aset.triwulan.toUpperCase() }}</span>
          </li>
        </ol>
      </div>

      <!-- <div v-else class="table-responsive sticky-top"> -->
      <!--   <table class="table table-hover"> -->
      <!--     <thead> -->
      <!--       <tr> -->
      <!--         <th width="2%">#</th> -->
      <!--         <th width="13%">KODERING BELANJA</th> -->
      <!--         <th>NAMA</th> -->
      <!--         <th width="10%">SUMBER</th> -->
      <!--         <th width="5%">TAHUN</th> -->
      <!--         <th width="4%">TW</th> -->
      <!--         <th width="13%">UNIT</th> -->
      <!--       </tr> -->
      <!--     </thead> -->
      <!---->
      <!--     <tbody> -->
      <!--       <tr v-for="(aset, i) in assets.items" :key="aset.id"> -->
      <!--         <td>{{ i+1 }}.</td> -->
      <!--         <td>{{ aset.kodering_belanja }}</td> -->
      <!--         <td> -->
      <!--           <div data-bs-toggle="modal" data-bs-target="#rincian" class="fw-bold hand-cursor">{{ aset.nama_aset_barang }}</div> -->
      <!--           <div>{{ aset.expand.rincian_aset.nama_barang }}</div> -->
      <!--         </td> -->
      <!--         <td>{{ aset.expand.sumber_aset.nama_sumber }}</td> -->
      <!--         <td>{{ aset.expand.tahun_pengadaan.tahun }}</td> -->
      <!--         <td>{{ aset.triwulan.toUpperCase() }}</td> -->
      <!--         <td>{{ aset.expand.unit_kerja.ruangan }}</td> -->
      <!--       </tr> -->
      <!--     </tbody> -->
      <!--   </table> -->
      <!-- </div> -->

      <div class="modal" id="rincian" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
          <div class="modal-content">
            <div class="modal-header fw-bold">
              {{ asset?.triwulan }}
              <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <div class="mb-3">
                <label>Tahun</label>
                <div class="fw-bold">2026</div>
              </div>
              <div class="mb-3">
                <label>Kode Ring</label>
                <div class="fw-bold">123.098.9.567</div>
              </div>
              <div class="mb-3">
                <label>Lokasi</label>
                <div class="fw-bold">Perpustakaan</div>
              </div>
              <div class="mb-3">
                <label>Tahun</label>
                <div class="fw-bold">2026</div>
              </div>
              <div class="mb-3">
                <label>Tahun</label>
                <div class="fw-bold">2026</div>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn btn-danger">Hapus</button>
            </div>

          </div>
        </div>
      </div>

      <div v-if="!isLoading" class="text-center">
        <button v-if="assets.totalItems" :disabled="isMovingPage || assets.page >= assets.totalPages" @click="fetchOrLoadMoreData(currentFilter, assets.page + 1, true)" class="btn btn-primary">
          <span v-if="assets.page >= assets.totalPages">Semua sudah dimuat</span>
          <span v-else>Muat lagi <i class="bi bi-arrow-down"></i></span>
        </button>
      </div>
    </div>

    <div class="card-footer bg-transparent">
      <div v-if="assets?.items" class="text-center">
        <span class="float-end text-muted fw-bold">{{ assets.items.length }} / {{ assets.totalItems }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Inventaris — SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya.",
});

const client = usePbClient()
const user = usePbUser();
const role = user?.user.value.role;
const route = useRoute()
const isLoading = ref(true)
const perPage = 30
const assets = ref([])
const isMovingPage = ref(false)
const isActiveSearch = ref(false)
const currentFilter = ref()
const asset = ref({})

async function fetchOrLoadMoreData(filter="", page="", loading=true) {
  isLoading.value = loading
  isActiveSearch.value = false

  // check role dan advance filter/search
  if(role == 'unit') {
    if(filter) {
      filter = filter + ` && unit_kerja="${user?.user.value.unit_kerja}"` 
      isActiveSearch.value = true
    } else {
      filter = `unit_kerja="${user?.user.value.unit_kerja}"`
      isActiveSearch.value = false
    }
  }

  else if(role == 'sarpras' || role == 'pimpinan') {
    if(filter) isActiveSearch.value = true
    else isActiveSearch.value = false
  }

  let currentPage
  if(page) currentPage = page

  let res = await client.collection('aset').getList(currentPage, perPage, {
    filter: filter,
    expand: `tahun_pengadaan, sumber_aset, rincian_aset, satuan_aset, unit_kerja`,
    sort: `-tahun_pengadaan.tahun, triwulan`
  })

  if(res) {
    if(page) {
      assets.value.page = res.page
      assets.value.perPage = res.perPage
      assets.value.totalPages = res.totalPages
      assets.value.totalItems = res.totalItems
      assets.value.items = assets.value.items.concat(res.items)

      isMovingPage.value = false
      isLoading.value = false
    }
    else {
      assets.value = res
      isLoading.value = false
    }
  }
}

async function loadMore(page, loading=true) {
  isLoading.value = loading
  isMovingPage.value = true
  isActiveSearch.value = false

  // formFilter menyimpan value dari opsi dan saerch type
  // queryFilter: query clause. defaulnya kosong untuk role sarpras. dan diisi unit_kerja sesuai role unit_kerja
  let queryFilter = ``

  // check role dan advance filter/search
  if(role == 'unit') {
    queryFilter = `unit_kerja="${user?.user.value.unit_kerja}"` 
  }

  if(role == 'sarpras' || role == 'pimpinan') {
    queryFilter = ``
  }

  let res = await client.collection('aset').getList(page, perPage, {
    filter: queryFilter,
    expand: `tahun_pengadaan, sumber_aset, rincian_aset, satuan_aset, unit_kerja`,
    sort: `-tahun_pengadaan.tahun, triwulan`
  })

  if(res) {
    assets.value.page = res.page
    assets.value.perPage = res.perPage
    assets.value.totalPages = res.totalPages
    assets.value.totalItems = res.totalItems
    assets.value.items = assets.value.items.concat(res.items)

    isMovingPage.value = false
  }
}

// handle fetch data saat filter bar aktif
const handleFilterChange = (filterStr) => {
  fetchOrLoadMoreData(filterStr)
  currentFilter.value = filterStr // ngasih tau kalo sedang difilter, ini akan dilempar ke tombol loadmore
}

function setModalBarang(aset) {
  asset.value = aset
}

onMounted(() => {
  fetchOrLoadMoreData()
})
</script>

<style scoped>
table.table {
  height: 100%;
}
</style>
