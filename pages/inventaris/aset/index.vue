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
      <div class="row mb-3">
        <!-- <div class="col-md-2"> -->
        <!--   <form @submit.prevent="fetchData"> -->
        <!--     <input @input="fetchData" v-model="formFilter.keyword" class="form-control" id="keyword" type="search" placeholder="ketik kata kunci..." /> -->
        <!--   </form> -->
        <!-- </div> -->

        <div class="col-md-1">
          <select @change="fetchData" v-model="formFilter.tahun" name="filterTahun" id="filterTahun" class="form-select">
            <option value="">Tahun</option>
            <option v-for="item in filterOption.tahun" :key="item.id" :value="item.id">{{ item.tahun }}</option>
          </select>
        </div>

        <div class="col-md-1">
          <select @change="fetchData" v-model="formFilter.triwulan" name="filterTriwulan" id="filterTriwulan" class="form-select">
            <option value="">Triwulan</option>
            <option value="tw-1">TW-1</option>
            <option value="tw-2">TW-2</option>
            <option value="tw-3">TW-3</option>
            <option value="tw-4">TW-4</option>
          </select>
        </div>

        <div class="col-md-1">
          <select @change="fetchData" v-model="formFilter.sumber" name="filterSumber" id="filterSumber" class="form-select">
            <option value="">Sumber</option>
            <option v-for="item in filterOption.sumber" :key="item.id" :value="item.nama_sumber">{{ item.nama_sumber }}</option>
          </select>
        </div>

        <div v-if="role == 'sarpras'" class="col-md-1 mb-3">
          <select @change="fetchData" v-model="formFilter.unit_kerja" name="filterUnitKerja" id="filterUnitKerja" class="form-select">
            <option value="">Unit Kerja</option>
            <option v-for="item in filterOption.unit_kerja" :key="item.id" :value="item.ruangan">{{ item.ruangan }}</option>
          </select>
        </div>

        <div v-if="role == 'unit'" class="col-md-1 mb-3">
          <select @change="fetchData" v-model="formFilter.lokasi" name="filterLokasi" id="filterLokasi" class="form-select">
            <option value="">Lokasi</option>
            <option v-for="item in filterOption.lokasi" :key="item.id" :value="item.nama_lokasi">{{ item.nama_lokasi }}</option>
          </select>
        </div>

        <div class="col-md-2">
          <!-- <button class="btn btn-dark">terapkan</button> -->
          <button @click="resetFilter" class="btn btn-dark ms-1">
            reset
          </button>
        </div>

        <div v-if="assets?.items" class="col-md">
          <div class="text-end text-muted fw-bold">{{ assets?.items?.length }} / {{ assets?.totalItems }}</div>
        </div>
      </div>

      <!-- <div v-if="formFilter.tahun || formFilter.triwulan || formFilter.sumber || formFilter.unit_kerja"> -->
      <!--   <ul class="list-group list-group-horizontal"> -->
      <!--     <li v-if="formFilter.tahun" class="list-group-item">{{ formFilter.tahun }}</li> -->
      <!--     <li v-if="formFilter.triwulan" class="list-group-item">{{ formFilter.triwulan.toUpperCase() }}</li> -->
      <!--     <li v-if="formFilter.sumber" class="list-group-item">{{ formFilter.sumber }}</li> -->
      <!--     <li v-if="formFilter.unit_kerja" class="list-group-item">{{ formFilter.unit_kerja }}</li> -->
      <!--   </ul> -->
      <!-- </div> -->

      <hr />

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
            <!-- <span class="px-2 border border-1 border-dark rounded-2">{{ i+1 }}</span> -->
            <div class="ms-2 me-auto">
              <div class="text-muted">Nama Barang</div>
              <div class="fs-5 fw-bold mb-2">{{ aset.expand.rincian_aset.nama_barang }} <span class="text-muted fw-normal">({{ aset.nama_aset_barang }})</span></div>

              <div class="text-muted">Unit Kerja</div>
              <div class="fw-bold text-muted mb-2">{{ aset.expand.unit_kerja.ruangan }}</div>
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
              AC Split
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

            <!-- <div class="modal-footer"> -->
            <!--   <button class="btn btn-dark">Buat berita acara</button> -->
            <!-- </div> -->
          </div>
        </div>
      </div>

      <div v-if="!isLoading" class="text-center">
        <button v-if="assets.totalItems" :disabled="isMovingPage || assets.page >= assets.totalPages" @click="loadMore(assets.page + 1, false)" class="btn btn-primary">
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

const filterOption = ref({
  keyword: "",
  tahun: "",
  sumber: "",
  unit_kerja: "",
  lokasi: "",
});

const formFilter = ref({
  keyword: "",
  triwulan: "",
  tahun: "",
  sumber: "",
  unit_kerja: "",
  lokasi: "",
})

function resetFilter() {
  formFilter.value.keyword = "";
  formFilter.value.triwulan = "";
  formFilter.value.tahun = "";
  formFilter.value.sumber = "";
  formFilter.value.unit_kerja = "";
  formFilter.value.lokasi = ""
  isActiveSearch.value = false
  fetchData()
}

async function fetchMasterByCollection(collection) {
  let fields = ``
  let sort = ``
  let queryFilter = ``

  if(collection == 'tahun_pengadaan') {
    fields = `id, tahun`
    sort = `-tahun`
  }
  else if(collection == 'sumber_aset') fields = `id, nama_sumber`
  else if(collection == 'unit_kerja') fields = `id, ruangan`
  else if(collection == 'lokasi_unit_kerja') queryFilter = `unit_kerja="${user?.user.value.unit_kerja}"`

  client.autoCancellation(false)
  let res = await client.collection(collection).getFullList({
    filter: queryFilter,
    fields: fields,
    sort: sort
  })

  if(res) {
    if(collection == 'tahun_pengadaan') filterOption.value.tahun = res
    else if(collection == 'sumber_aset') filterOption.value.sumber = res
    else if(collection == 'unit_kerja') filterOption.value.unit_kerja = res
    else if(collection == 'lokasi_unit_kerja') filterOption.value.lokasi = res
  }
}


async function fetchData() {
  isLoading.value = true
  isActiveSearch.value = false

  // formFilter menyimpan value dari opsi dan saerch type
  // queryFilter: query clause. defaulnya kosong untuk role sarpras. dan diisi unit_kerja sesuai role unit_kerja
  let queryFilter = ``

  // check role dan advance filter/search
  if(role == 'unit') {
    queryFilter = `unit_kerja="${user?.user.value.unit_kerja}"` 
    if(formFilter.value.tahun) {
      queryFilter += ` && tahun_pengadaan="${formFilter.value.tahun}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.triwulan) {
      queryFilter += ` && triwulan="${formFilter.value.triwulan}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.sumber) {
      queryFilter += ` && sumber_aset.nama_sumber="${formFilter.value.sumber}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.lokasi) {
      queryFilter += ` && lokasi_unit_kerja.nama_lokasi="${formFilter.value.lokasi}"`
      isActiveSearch.value = true
    }

  }

  if(role == 'sarpras' || role == 'pimpinan') {
    queryFilter = ``
    if(formFilter.value.keyword) {
      queryFilter = `nama_aset_barang~"${formFilter.value.keyword}" || rincian_aset.nama_barang~"${formFilter.value.keyword}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.tahun) {
      queryFilter = `tahun_pengadaan="${formFilter.value.tahun}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.triwulan) {
      queryFilter = `triwulan="${formFilter.value.triwulan}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.sumber) {
      queryFilter = `sumber_aset.nama_sumber="${formFilter.value.sumber}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.unit_kerja) {
      queryFilter = `unit_kerja.ruangan="${formFilter.value.unit_kerja}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.tahun && formFilter.value.triwulan) {
      queryFilter = `triwulan="${formFilter.value.triwulan}" && tahun_pengadaan="${formFilter.value.tahun}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.tahun && formFilter.value.unit_kerja) {
      queryFilter = `tahun_pengadaan="${formFilter.value.tahun}" && unit_kerja.ruangan="${formFilter.value.unit_kerja}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.tahun && formFilter.value.sumber) {
      queryFilter = `tahun_pengadaan="${formFilter.value.tahun}" && sumber_aset.nama_sumber="${formFilter.value.sumber}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.tahun && formFilter.value.triwulan && formFilter.value.sumber) {
      // console.log(formFilter.value.tahun)
      // console.log(formFilter.value.triwulan)
      // console.log(formFilter.value.sumber)
      queryFilter = `tahun_pengadaan="${formFilter.value.tahun}" && triwulan="${formFilter.value.triwulan}" && sumber_aset.nama_sumber="${formFilter.value.sumber}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.tahun && formFilter.value.triwulan && formFilter.value.sumber && formFilter.value.unit_kerja) {
      queryFilter = `triwulan="${formFilter.value.triwulan}" && tahun_pengadaan="${formFilter.value.tahun}" && sumber_aset.nama_sumber="${formFilter.value.sumber}" && unit_kerja.ruangan="${formFilter.value.unit_kerja}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.triwulan && formFilter.value.sumber) {
      queryFilter = `triwulan="${formFilter.value.triwulan}" && sumber_aset.nama_sumber="${formFilter.value.sumber}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.triwulan && formFilter.value.unit_kerja) {
      queryFilter = `triwulan="${formFilter.value.triwulan}" && unit_kerja.ruangan="${formFilter.value.unit_kerja}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.triwulan && formFilter.value.sumber && formFilter.value.unit_kerja) {
      queryFilter = `triwulan="${formFilter.value.triwulan}" && sumber_aset.nama_sumber="${formFilter.value.sumber}" && unit_kerja.ruangan="${formFilter.value.unit_kerja}"`
      isActiveSearch.value = true
    }

    if(formFilter.value.sumber && formFilter.value.unit_kerja) {
      queryFilter = `sumber_aset.nama_sumber="${formFilter.value.sumber}" && unit_kerja.ruangan="${formFilter.value.unit_kerja}"`
      isActiveSearch.value = true
    }
  }
 
  client.autoCancellation(false)
  let res = await client.collection('aset').getList(1, perPage, {
    filter: queryFilter,
    expand: `tahun_pengadaan, sumber_aset, rincian_aset, satuan_aset, unit_kerja`,
    sort: `-tahun_pengadaan.tahun, triwulan`
  })

  if(res) {
    assets.value = res

    isLoading.value = false
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
    if(formFilter.value.keyword) {
      queryFilter = `unit_kerja="${user?.user.value.unit_kerja}" && (nama_aset_barang~"${formFilter.value.keyword}" || rincian_aset.nama_barang~"${formFilter.value.keyword}")`
      isActiveSearch.value = true
    }
  }

  else {
    if(formFilter.value.keyword) {
      queryFilter = `nama_aset_barang~"${formFilter.value.keyword}" || rincian_aset.nama_barang~"${formFilter.value.keyword}"`
    }

    if(formFilter.value.tahun) {
      queryFilter = `tahun_pengadaan="${formFilter.value.tahun}"`
    }

    if(formFilter.value.triwulan) {
      queryFilter = `triwulan="${formFilter.value.triwulan}"`
    }

    if(formFilter.value.sumber) {
      queryFilter = `sumber_aset.nama_sumber="${formFilter.value.sumber}"`
    }

    if(formFilter.value.unit_kerja) {
      queryFilter = `unit_kerja.ruangan="${formFilter.value.unit_kerja}"`
    }

    if(formFilter.value.tahun && formFilter.value.triwulan) {
      queryFilter = `triwulan="${formFilter.value.triwulan}" && tahun_pengadaan="${formFilter.value.tahun}"`
    }

    if(formFilter.value.tahun && formFilter.value.unit_kerja) {
      queryFilter = `tahun_pengadaan="${formFilter.value.tahun}" && unit_kerja.ruangan="${formFilter.value.unit_kerja}"`
    }

    if(formFilter.value.tahun && formFilter.value.sumber) {
      queryFilter = `tahun_pengadaan="${formFilter.value.tahun}" && sumber_aset.nama_sumber="${formFilter.value.sumber}"`
    }

    if(formFilter.value.tahun && formFilter.value.triwulan && formFilter.value.sumber) {
      queryFilter = `tahun_pengadaan="${formFilter.value.tahun}" && triwulan="${formFilter.value.triwulan}" && sumber_aset.nama_sumber="${formFilter.value.sumber}"`
    }

    if(formFilter.value.tahun && formFilter.value.triwulan && formFilter.value.sumber && formFilter.value.unit_kerja) {
      queryFilter = `triwulan="${formFilter.value.triwulan}" && tahun_pengadaan="${formFilter.value.tahun}" && sumber_aset.nama_sumber="${formFilter.value.sumber}" && unit_kerja.ruangan="${formFilter.value.unit_kerja}"`
    }

    if(formFilter.value.triwulan && formFilter.value.sumber) {
      queryFilter = `triwulan="${formFilter.value.triwulan}" && sumber_aset.nama_sumber="${formFilter.value.sumber}"`
    }

    if(formFilter.value.triwulan && formFilter.value.unit_kerja) {
      queryFilter = `triwulan="${formFilter.value.triwulan}" && unit_kerja.ruangan="${formFilter.value.unit_kerja}"`
    }

    if(formFilter.value.triwulan && formFilter.value.sumber && formFilter.value.unit_kerja) {
      queryFilter = `triwulan="${formFilter.value.triwulan}" && sumber_aset.nama_sumber="${formFilter.value.sumber}" && unit_kerja.ruangan="${formFilter.value.unit_kerja}"`
    }

    if(formFilter.value.sumber && formFilter.value.unit_kerja) {
      queryFilter = `sumber_aset.nama_sumber="${formFilter.value.sumber}" && unit_kerja.ruangan="${formFilter.value.unit_kerja}"`
    }
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
onMounted(() => {
  fetchData()
  fetchMasterByCollection('tahun_pengadaan')
  fetchMasterByCollection('sumber_aset')
  fetchMasterByCollection('unit_kerja')
  fetchMasterByCollection('lokasi_unit_kerja')
})
</script>

<style scoped>
table.table {
  height: 100%;
}
</style>
