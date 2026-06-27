<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5 text-muted">{{ route.path.toUpperCase().replace('/', ' ') }}</span>
      <span v-if="role == 'sarpras'" class="float-end">
        <NuxtLink to="/inventaris/aset/tambah" class="btn btn-primary me-2"><i class="bi bi-plus"></i> Tambah baru</NuxtLink>
      </span>
      <div class="fw-normal text-muted">Inventaris Aset</div>
    </div>

    <div class="card-body">

      <FilterBar :role :assets @filter-change="handleFilterChange" />

      <div class="mb-3">
        <button @click="switchViewType('list')" v-if="view_type == 'grid'" class="btn btn-dark">
          <i class="bi bi-list"></i> List
        </button>

        <button @click="switchViewType('grid')" v-else class="btn btn-dark">
          <i class="bi bi-grid"></i> Grid
        </button>
      </div>

      <LoadingPlaceholder v-if="isLoading" :col="12" :n="10" />

      <div v-else-if="!isLoading && isActiveSearch && assets?.totalItems < 1" class="text-center text-muted p-5 fw-bold">
        <i class="bi bi-search fs-2"></i>
        <div class="fs-5">Pencarian tidak ditemukan.</div>
      </div>

      <div v-else-if="!isLoading && assets?.totalItems < 1" class="text-center text-muted p-5 fw-bold">
        <i class="bi bi-database fs-2"></i>
        <div class="fs-5">Belum Tersedia.</div>
      </div>

      <!-- display list items -->
        <div v-else class="row mb-3 justify-content-center">
            <ol v-if="view_type == 'list'" v-for="aset in assets.items" :key="aset.id" class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-start py-4">
                <div class="thumb-container">
                  <a @click="setModalBarang(aset)" data-bs-toggle="modal" data-bs-target="#rincian" class="hand">
                    <img v-if="aset.foto_barang" :src="`${host}/api/files/${aset.collectionId}/${aset.id}/${aset.foto_barang}`" :alt="aset.id" class="thumb-aset-list" />
                    <img v-else src="~/assets/img/placeholder.jpg" alt="thumb" class="thumb-aset-list" />
                  </a>
                </div>
                <div class="ms-2 me-auto">
                  <span v-if="aset.kondisi == 'RR'" class="badge fs-6 text-bg-warning rounded-pill mb-2"><i class="bi bi-tag"></i> Rusak Ringan</span>
                  <span v-else-if="aset.kondisi == 'RB'" class="badge fs-6 text-bg-warning rounded-pill mb-2"><i class="bi bi-tag"></i> Rusak Berat</span>
                  <span v-else-if="aset.kondisi == 'Hilang'" class="badge fs-6 text-bg-danger rounded-pill mb-2"><i class="bi bi-tag"></i> Hilang</span>

                  <div class="text-muted">Nama Barang</div>
                  <div class="fs-5 fw-bold text-muted mb-2">{{ aset.expand.rincian_aset.nama_barang }} <span class="text-muted fw-normal">({{ aset.nama_aset_barang }})</span></div>

                  <div class="text-muted">Unit Kerja</div>
                  <div class="fw-bold text-muted mb-2">{{ aset.expand.unit_kerja.ruangan }}</div>

                  <NuxtLink v-if="role == 'sarpras'" :to="`/inventaris/aset/edit/${aset.id}`" class="btn btn-primary me-2"><i class="bi bi-pencil square"></i> Edit</NuxtLink>
                  <button v-if="(role == 'sarpras' || role == 'unit') && aset.kondisi == 'B'" @click="setModalBarang(aset)" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#buat-isu"><i class="bi bi-bug"></i> Buat Isu</button>
                  <NuxtLink v-if="(role == 'sarpras' || role == 'unit') && aset.kondisi != 'B'" to="/isu" class="btn btn-outline-dark">Lihat Daftar Isu <i class="bi bi-arrow-up-right-square"></i></NuxtLink>
                </div>

                <span class="badge fs-6 border border-1 border-dark text-muted rounded-pill me-2">{{ aset.expand.sumber_aset.nama_sumber }}</span>
                <span class="badge fs-6 border border-1 border-dark text-muted rounded-pill me-2">{{ aset.expand.tahun_pengadaan.tahun }}</span>
                <span class="badge fs-6 border border-1 border-dark text-muted rounded-pill text-uppercase">{{ aset.triwulan }}</span>
              </li>
            </ol>

            <div v-else v-for="(aset, i) in assets.items" :key="i" class="col-md-3">
              <div class="card mb-4">
                <div class="card-header thumb-container p-0 border-0">
                  <div class="kondisi-container">
                    <span v-if="aset.kondisi == 'RR'" class="kondisi badge fs-6 text-bg-warning mb-2"><i class="bi bi-tag"></i> Rusak Ringan</span>
                    <span v-else-if="aset.kondisi == 'RB'" class="kondisi badge fs-6 text-bg-danger mb-2"><i class="bi bi-tag"></i> Rusak Berat</span>
                    <span v-else-if="aset.kondisi == 'Hilang'" class="kondisi badge fs-6 text-bg-danger mb-2"><i class="bi bi-tag"></i> Hilang</span>
                  </div>

                  <a @click="setModalBarang(aset)" data-bs-toggle="modal" data-bs-target="#rincian" class="hand">
                    <div class="thumb-overlay-container">
                      <img v-if="aset.foto_barang" :src="`${host}/api/files/${aset.collectionId}/${aset.id}/${aset.foto_barang}`" :alt="aset.id" class="thumb-aset" />
                      <img v-else src="~/assets/img/placeholder.jpg" alt="thumb" class="thumb-aset" />
                      <div v-if="aset.kondisi == 'Hilang'" class="thumb-overlay-hilang"></div>
                      <div v-else class="thumb-overlay"></div>
                    </div>
                  </a>
                  <div class="unit-kerja-container">
                    <div class="unit-kerja fw-bold mb-2">{{ aset.expand.unit_kerja.ruangan }}</div>
                  </div>
                </div>

                <div class="card-body items">
                  <div class="text-muted small mb-2">SPJ: {{ aset?.tgl_ba_spj }}</div>

                  <div class="fw-bold text-muted mb-3">{{ aset.expand.rincian_aset.nama_barang }} <span class="text-muted fw-normal">({{ aset.nama_aset_barang }})</span></div>
                  <span class="badge fs-6 border border-1 border-dark text-muted rounded-pill me-2">{{ aset.expand.sumber_aset.nama_sumber }}</span>
                  <span class="badge fs-6 border border-1 border-dark text-muted rounded-pill me-2">{{ aset.expand.tahun_pengadaan.tahun }}</span>
                  <span class="badge fs-6 border border-1 border-dark text-muted rounded-pill text-uppercase">{{ aset.triwulan }}</span>
                </div>

                <div class="card-footer bg-transparent border-0 d-grid gap-2">
                  <NuxtLink v-if="role == 'sarpras'" :to="`/inventaris/aset/edit/${aset.id}`" class="btn btn-primary btn-lg"><i class="bi bi-pencil square"></i> Edit</NuxtLink>
                  <button v-if="(role == 'sarpras' || role == 'unit') && aset.kondisi == 'B'" @click="setModalBarang(aset)" class="btn btn-outline-danger btn-lg" data-bs-toggle="modal" data-bs-target="#buat-isu"><i class="bi bi-bug"></i> Buat Isu</button>
                  <NuxtLink v-if="(role == 'sarpras' || role == 'unit') && aset.kondisi != 'B'" to="/isu" class="btn btn-outline-dark btn-lg">Lihat Daftar Isu <i class="bi bi-arrow-up-right-square"></i></NuxtLink>
                </div>

              </div>
            </div>
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
      <!--         <td class="text-uppercase">{{ aset.triwulan }}</td> -->
      <!--         <td>{{ aset.expand.unit_kerja.ruangan }}</td> -->
      <!--       </tr> -->
      <!--     </tbody> -->
      <!--   </table> -->
      <!-- </div> -->

      <!-- modal buat isu -->
      <div class="modal" id="buat-isu" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header fw-bold text-muted">
              Buat Isu:&nbsp; <span>{{ asset?.nama_aset_barang }}</span>
              <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <form @submit.prevent="handleCreateIssue">
                <div class="mb-4">
                  <label for="kondisi_barang" class="fw-bold">Kondisi</label>
                  <multiselect
                    v-model="form.kondisi"
                    :options="['B', 'RR', 'RB', 'Mutasi ke OPD Lain', 'Pencatatan Ganda', 'Hilang']"
                    :modelValue="String"
                    :clear-on-select="false"
                    id="kondisi_barang"
                    placeholder="Pilih satu"
                    required>
                    <template v-slot:singleLabel="{ option }">{{ option }}</template>
                  </multiselect>
                </div>

                <div class="mb-4">
                  <label for="catatan_isu" class="fw-bold">Catatan</label>
                  <textarea v-model="form.catatan_isu" class="form-control form-control-lg" id="catatan_isu" type="text" placeholder="Jelaskan kerusakan/kendala pada barang..."></textarea>
                </div>

                <div class="mb-4">
                  <label for="foto_isu" class="fw-bold">Foto Isu (opsional)</label>
                  <button v-if="form?.foto_isu" @click="() => form.foto_isu = ''" class="btn btn-outline-danger btn-sm ms-2">hapus foto</button>
                  <input @change="compressFile" ref="foto_isu" class="form-control form-control-lg" id="foto_isu" type="file" accept="image/png, image/jpeg, image/jpg" />
                </div>

                <button class="btn btn-primary" data-bs-dismiss="modal"><i class="bi bi-save"></i> Simpan</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div v-if="asset" class="modal" id="rincian" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
          <div class="modal-content">
            <div class="modal-header fw-bold text-muted">
              <span v-if="asset?.kondisi == 'Hilang'" class="text-danger">[Hilang] &nbsp;</span>
              <span v-if="!asset?.lengkap" class="text-danger">Tidak lengkap &nbsp;</span>
              {{ asset?.nama_aset_barang }} &nbsp; <span class="text-muted fw-normal">({{ asset?.expand?.rincian_aset.nama_barang }})</span>
              <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body text-muted">
              <div class="row mb-3">
                <div class="col-md-12">
                  <span class="badge fs-6 text-bg-dark rounded-pill me-2">{{ asset?.expand?.sumber_aset.nama_sumber }}</span>
                  <span class="badge fs-6 text-bg-dark rounded-pill me-2">{{ asset?.expand?.tahun_pengadaan.tahun }}</span>
                  <span class="badge fs-6 text-bg-dark rounded-pill text-uppercase me-2">{{ asset?.triwulan }}</span>
                  <span class="badge fs-6 text-bg-dark rounded-pill">{{ asset?.expand?.unit_kerja.ruangan }}</span>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label>KIB</label>
                    <div class="fw-bold">{{ asset?.kib }}</div>
                  </div>
                  <div class="mb-3">
                    <label>No.SP2D</label>
                    <div class="fw-bold">{{ asset?.no_sp2d }}</div>
                  </div>
                  <div class="mb-3">
                    <label>Kodering Belanja</label>
                    <div class="fw-bold">{{ asset?.kodering_belanja }}</div>
                  </div>
                  <div class="mb-3">
                    <label>No.SPK/Faktur/Kuitansi</label>
                    <div class="fw-bold">{{ asset?.no_spk }}</div>
                  </div>
                  <div class="mb-3">
                    <label>BA SPJ</label>
                    <div class="fw-bold">{{ asset?.no_ba_spj }}</div>
                    <div class="fw-bold">{{ asset?.tgl_ba_spj }}</div>
                  </div>
                  <div class="mb-3">
                    <label>Kode Barang</label>
                    <div class="fw-bold">{{ asset?.expand?.rincian_aset.kode_barang }}</div>
                  </div>
                  <div class="mb-3">
                    <label>Kodering Aset</label>
                    <div class="fw-bold">{{ asset?.expand?.rincian_aset.kodering_aset }}</div>
                  </div>
                  <div class="mb-3">
                    <label>Nama Rekening Aset</label>
                    <div class="fw-bold">{{ asset?.expand?.rincian_aset.nama_rekening_aset }}</div>
                  </div>
                </div>

                <div class="col-md-3">
                  <div class="mb-3">
                    <label>Merek</label>
                    <div class="fw-bold">{{ asset?.merek_tipe }}</div>
                  </div>
                  <div class="mb-3">
                    <label>Satuan</label>
                    <div class="fw-bold">{{ asset?.expand?.satuan_aset.nama_satuan }}</div>
                  </div>
                  <div class="mb-3">
                    <label>Volume</label>
                    <div class="fw-bold">{{ asset?.volume }}</div>
                  </div>
                  <div v-if="role == 'sarpras' || role == 'pimpinan'" class="mb-3">
                    <label>Harga Satuan</label>
                    <div class="fw-bold">{{ asset?.harga_satuan || 0 }}</div>
                  </div>
                  <div v-if="role == 'sarpras' || role == 'pimpinan'" class="mb-3">
                    <label>Nilai Perolehan</label>
                    <div class="fw-bold">{{ asset?.nilai_perolehan || 0 }}</div>
                  </div>
                  <div class="mb-3">
                    <label>Kondisi</label>
                    <div class="fw-bold">
                      <span v-if="asset?.kondisi == 'B'">Baik</span>
                      <span v-else-if="asset?.kondisi == 'RR'" class="text-warning">Rusak Ringan</span>
                      <span v-else-if="asset?.kondisi == 'RB'" class="text-warning">Rusak Berat</span>
                      <span v-else-if="asset?.kondisi == 'Hilang'" class="text-danger">Hilang</span>
                    </div>
                  </div>
                  <div v-if="asset?.catatan_isu" class="mb-3">
                    <label>Catatan Isu/Kerusakan</label>
                    <div class="fw-bold">{{ asset?.catatan_isu }}</div>
                  </div>

                  <div v-if="asset?.keterangan" class="mb-3">
                    <label>Keterangan</label>
                    <div class="fw-bold">{{ asset?.keterangan }}</div>
                  </div>
                </div>

                <div class="col-md-3">
                  <div v-if="asset?.spesifikasi" class="mb-3">
                    <label>Spesifikasi</label>
                    <div class="fw-bold white-space">{{ asset?.spesifikasi }}</div>
                  </div>

                  <!-- <div class="thumb-container"> -->
                    <!-- <div class="thumb-aset"> -->
                      <img v-if="asset?.foto_barang" :src="`${host}/api/files/${asset?.collectionId}/${asset?.id}/${asset?.foto_barang}`" :alt="asset?.id" class="thumb-rincian-aset" />
                      <img v-else src="~/assets/img/placeholder.jpg" alt="thumb" class="thumb-aset" />
                    <!-- </div> -->
                  <!-- </div> -->
                </div>
              </div>

            </div>

            <div class="modal-footer">
              <div class="mb-2 text-muted fst-italic">diperbaharui {{ asset?.updated }}</div>
            </div>

          </div>
        </div>
      </div>

      <LoadingPlaceholder v-if="isMovingPage" :col="12" :n="5" />

      <div v-if="!isLoading" class="text-center">
        <button v-if="assets.totalItems" :disabled="isMovingPage || assets.page >= assets.totalPages" @click="loadMore(currentFilter, false)" class="btn btn-primary">
          <span v-if="assets.page >= assets.totalPages">Semua sudah dimuat</span>
          <span v-else>Muat lagi <i class="bi bi-arrow-down"></i></span>
        </button>
      </div>
    </div>

    <div class="card-footer bg-transparent">
      <div v-if="assets?.items" class="text-center">
        <span class="float-end text-muted fw-bold">{{ assets.items.length }} / {{ assets.totalItems }} item(s)</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import Compressor from 'compressorjs';

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Inventaris — SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya.",
});

let config = useRuntimeConfig()
let host = config.public.apiBaseUrl + ":" + config.public.apiPort
const client = usePbClient()
const user = usePbUser();
const role = user?.user.value.role;
const route = useRoute()
const isLoading = ref(true)
const perPage = 40
const assets = ref([])
const isMovingPage = ref(false)
const isActiveSearch = ref(false)
const currentFilter = ref()
const asset = ref({})

// default tampilan item: Grid
const view_type = ref('grid')

const form = ref({
  kondisi: "",
  catatan_isu: "",
  foto_isu: ""
})
let foto_isu = ref(null) // untuk referensi hapus value saat tombol simpan ditekan dan berhasil!

function switchViewType(currType) {
  view_type.value = currType
}

async function fetchData(filter="") {
  isLoading.value = true
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

  let res = await client.collection('aset').getList(1, perPage, {
    filter: filter,
    expand: `tahun_pengadaan, sumber_aset, rincian_aset, satuan_aset, unit_kerja`,
    sort: `-tahun_pengadaan.tahun, triwulan, unit_kerja.ruangan`
  })

  if(res) {
    // response utama/filter pertama dilakukan
    assets.value = res

    // format mata uang
    let option = {
      style: "currency",
      currency: "IDR"
    }
    // format tanggal
    let optionTgl = {
      dateStyle: "full",
    }
    let optionTglUpdated = {
      dateStyle: "full",
      timeStyle: "short"
    }

    for(let i=0; i<res.items.length; i++) {
      assets.value.items[i].harga_satuan = new Intl.NumberFormat("id-ID", option).format(res.items[i]?.harga_satuan)
      assets.value.items[i].nilai_perolehan = new Intl.NumberFormat("id-ID", option).format(res.items[i]?.nilai_perolehan)

      let raw_tgl_ba_spj = new Date(res.items[i].tgl_ba_spj)
      let raw_updated = new Date(res.items[i].updated)
      assets.value.items[i].tgl_ba_spj = new Intl.DateTimeFormat('id-ID', optionTgl).format(raw_tgl_ba_spj)
      assets.value.items[i].updated = new Intl.DateTimeFormat('id-ID', optionTglUpdated).format(raw_updated)
    }

    isLoading.value = false
  }
}

async function loadMore(filter="", loading=false) {
  isLoading.value = loading
  isMovingPage.value = true
  isActiveSearch.value = false
  let page = assets.value.page + 1

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


  let res = await client.collection('aset').getList(page, perPage, {
    filter: filter,
    expand: `tahun_pengadaan, sumber_aset, rincian_aset, satuan_aset, unit_kerja`,
    sort: `-tahun_pengadaan.tahun, triwulan, unit_kerja.ruangan`
  })

  if(res) {
    // format mata uang
    let option = {
      style: "currency",
      currency: "IDR"
    }
    // format tanggal
    let optionTgl = {
      dateStyle: "full",
    }
    let optionTglUpdated = {
      dateStyle: "full",
      timeStyle: "short"
    }
    for(let i=0; i<res.items.length; i++) {
      res.items[i].harga_satuan = new Intl.NumberFormat("id-ID", option).format(res.items[i]?.harga_satuan)
      res.items[i].nilai_perolehan = new Intl.NumberFormat("id-ID", option).format(res.items[i]?.nilai_perolehan)

      let raw_tgl_ba_spj = new Date(res.items[i].tgl_ba_spj)
      let raw_updated = new Date(res.items[i].updated)
      res.items[i].tgl_ba_spj = new Intl.DateTimeFormat('id-ID', optionTgl).format(raw_tgl_ba_spj)
      res.items[i].updated = new Intl.DateTimeFormat('id-ID', optionTglUpdated).format(raw_updated)
    }

    assets.value.page = res.page
    assets.value.perPage = res.perPage
    assets.value.totalPages = res.totalPages
    assets.value.totalItems = res.totalItems
    assets.value.items = assets.value.items.concat(res.items)

    isMovingPage.value = false
    isLoading.value = false
  }
}

// handle fetch data saat filter bar aktif
const handleFilterChange = (filterStr) => {
  fetchData(filterStr)
  currentFilter.value = filterStr // ngasih tau kalo sedang difilter, ini akan dilempar ke tombol loadmore
}

function setModalBarang(aset) {
  asset.value = aset
  form.value.kondisi = aset.kondisi
  form.value.catatan_isu = aset.catatan_isu
  form.value.foto_isu = aset.foto_isu
}

async function handleCreateIssue() {
  let res = await client.collection('aset').update(asset?.value.id, form.value)

  if(res) {
    if(foto_isu.value) foto_isu.value.value = ""
  }
}
function compressFile(e) {
  let file = e.target.files[0]
  if (!file) return;
  new Compressor(file, {
    convertTypes: ['image/webp'],
    mimeType: 'auto',
    quality: 0.4,
    success(result) {
      form.value.foto_isu = result
    },
    error(err) {
      console.error(err.message)
    }
  })
}

onMounted(() => {
  fetchData()

  // Terpaksa kami pake realtime update based on all record lalu fetch ulang. kampret wkwkw!
  client.collection('aset').subscribe('*', function(e) {
    if(e.action == 'update') {
      fetchData('')
    }
  }, {})
})
</script>

<style scoped>
table.table {
  height: 100%;
}
</style>
