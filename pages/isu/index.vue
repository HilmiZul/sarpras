<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5 text-muted">{{ route.path.toUpperCase().replace('/', ' ') }}</span>
      <div class="fw-normal text-muted">Daftar Kerusakan Aset/Barang</div>
    </div>

    <div class="card-body">
      <FilterBarIssue :issues="items" :role @filter-change="handleFilterChange" />

      <div class="card mb-2 bg-grey">
        <div class="card-body">
          <div class="fw-bold"><i class="bi bi-info-circle"></i> Info</div>
          <p class="mb-0">Barang dengan kondisi Rusak akan tampil disini.<br> Apabila ada kerusakan pada aset/barang, silahkan <span class="fw-bold">Buat Isu</span> pada item daftar 
            <NuxtLink class="fw-bold text-dark border-bottom border-bottom-1 border-dark" to="/inventaris/aset">Inventaris Aset</NuxtLink>.
          </p>
        </div>
      </div>

      <LoadingPlaceholder v-if="isLoading" :col="12" :n="1" />

      <div v-else-if="!isLoading && isActiveSearch && items?.totalItems < 1" class="p-5 text-center text-muted fw-bold">
        <i class="bi bi-search fs-2"></i>
        <div class="fs-5">Pencarian tidak ditemukan</div>
      </div>

      <div v-else-if="!isLoading && items?.totalItems < 1" class="p-5 text-center text-muted fw-bold">
        <i class="bi bi-database fs-2"></i>
        <div class="fs-5">Belum tersedia</div>
      </div>


      <ol v-else v-for="(aset, index) in items.items" :key="aset.id" class="list-group list-group-flush">
        <li class="list-group-item d-flex justify-content-between align-items-start py-4">
          <div class="thumb-container">
            <a @click="setModalBarang(aset)" data-bs-toggle="modal" data-bs-target="#rincian" class="hand">
              <img v-if="aset.foto_isu" :src="`${host}/api/files/${aset.collectionId}/${aset.id}/${aset.foto_isu}`" :alt="aset.id" class="thumb-aset-list" />
              <img v-else src="~/assets/img/placeholder.jpg" alt="thumb" class="thumb-aset-list" />
            </a>
          </div>
          <div class="ms-2 me-auto">
            <span v-if="aset.kondisi == 'RR'" class="badge fs-6 text-bg-warning rounded-pill mb-2"><i class="bi bi-tag"></i> Rusak Ringan</span>
            <span v-else-if="aset.kondisi == 'RB'" class="badge fs-6 text-bg-danger rounded-pill mb-2"><i class="bi bi-tag"></i> Rusak Berat</span>
            <span v-else-if="aset.kondisi == 'Hilang'" class="badge fs-6 text-bg-danger rounded-pill mb-2"><i class="bi bi-tag"></i> Hilang</span>

            <div class="text-muted">Catatan</div>
            <div class="fs-5 fw-bold text-muted mb-2">
              <span v-if="aset.catatan_isu">{{ aset.catatan_isu }}</span>
              <span v-else>&#8212;</span>
            </div>

            <div class="text-muted">Nama Barang</div>
            <div class="fs-5 fw-bold text-muted mb-2">{{ aset.expand.rincian_aset.nama_barang }} <span class="text-muted fw-normal">({{ aset.nama_aset_barang }})</span></div>

            <button v-if="role == 'sarpras' || role == 'unit'" @click="setModalBarang(aset, index)" data-bs-toggle="modal" data-bs-target="#update-isu" class="btn btn-primary"><i class="bi bi-pencil square"></i> Perbaharui kondisi</button>
          </div>

          <span class="badge fs-6 border border-1 border-dark text-muted rounded-pill me-2">{{ aset.expand.unit_kerja.ruangan }}</span>
          <span class="badge fs-6 border border-1 border-dark text-muted rounded-pill me-2">{{ aset.expand.sumber_aset.nama_sumber }}</span>
          <span class="badge fs-6 border border-1 border-dark text-muted rounded-pill me-2">{{ aset.expand.tahun_pengadaan.tahun }}</span>
          <span class="badge fs-6 border border-1 border-dark text-muted rounded-pill text-uppercase">{{ aset.triwulan }}</span>
        </li>
      </ol>

      <LoadingPlaceholder v-if="isMovingPage" :col="12" :n="5" />

      <div v-else class="text-center mt-2">
        <button v-if="items.totalItems" :disabled="isMovingPage || items.page >= items.totalPages" @click="loadMore(currentFilter, true)" class="btn btn-primary">
          <span v-if="items.page >= items.totalPages">Semua sudah dimuat</span>
          <span v-else>Muat lagi <i class="bi bi-arrow-down"></i></span>
        </button>
      </div>

      <div v-if="asset" class="modal" id="rincian" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div class="modal-content">
            <div class="modal-header fw-bold text-muted">
              <span v-if="asset?.kondisi == 'Hilang'" class="text-danger">[Hilang] &nbsp;</span>
              <span v-if="!asset?.lengkap" class="text-danger">Tidak lengkap &nbsp;</span>
              {{ asset?.nama_aset_barang }} &nbsp; <span class="text-muted fw-normal">({{ asset?.expand?.rincian_aset.nama_barang }})</span>
              <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body text-muted">
              <img v-if="asset?.foto_isu" :src="`${host}/api/files/${asset?.collectionId}/${asset?.id}/${asset?.foto_isu}`" :alt="asset?.id" class="thumb-rincian-isu" />
              <img v-else src="~/assets/img/placeholder.jpg" alt="thumb" class="thumb-isu" />
            </div>

            <div class="modal-footer">
              <div class="mb-2 text-muted fst-italic">diperbaharui {{ asset?.updated }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- modal update kondisi isu -->
      <!-- TODO: Edit show modal and only two forms: kondisi and catatan isu -->
      <div class="modal" id="update-isu" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header fw-bold text-muted">
              Update Isu:&nbsp;<span v-if="asset" class="fw-bold">{{ asset?.nama_aset_barang }}</span>
              <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <form @submit.prevent="handleUpdate">
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


    </div>

  </div>
</template>


<script setup>
import Compressor from 'compressorjs';

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "Isu Aset/Barang — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const route = useRoute()
const config = useRuntimeConfig()
const host = config.public.apiBaseUrl+":"+config.public.apiPort
const user = usePbUser()
const role = user?.user.value.role
const client = usePbClient()
const items = ref([])
const asset = ref({})     // => wadah buat nampung item untuk tampil di rincian
const isLoading = ref(true)
const isMovingPage = ref(false)
const isActiveSearch = ref(false)
const isLoadingUpdate = ref(false)

const perPage = 40
const currentFilter = ref() // => berisi filter saat ini dan digunakan/lempar ke loadMore

const form = ref({
  kondisi: "",
  catatan_isu: "",
  foto_isu: ""
})
let foto_isu = ref(null) // untuk referensi hapus value saat tombol simpan ditekan dan berhasil!

const assetIndex = ref('')


async function fetchItems(filter="") {
  isLoading.values = true

  // filter by FilterBar
  if(role != 'sarpras' && role != 'pimpinan') {
    if(filter) {
      filter = filter + ` && kondisi!="B" && unit_kerja="${user?.user.value.unit_kerja}"`
      isActiveSearch.value = true
    } else {
      filter = `kondisi!="B" && unit_kerja="${user?.user.value.unit_kerja}"`
      isActiveSearch.value = false
    }
  } else {
    if(filter) {
      filter = filter + ` && kondisi!="B"`
      isActiveSearch.value = true
    } else {
      filter = `kondisi!="B"`
      isActiveSearch.value = false
    }
  }

  let res = await client.collection('aset').getList(1, perPage, {
    filter: filter,
    expand: `tahun_pengadaan, sumber_aset, rincian_aset, satuan_aset, unit_kerja`,
    sort: `kondisi, -tahun_pengadaan.tahun, triwulan, unit_kerja.ruangan`
  })

  if(res) {
    items.value = res

    let option = {
      style: "currency",
      currency: "IDR"
    }
    let optionTgl = {
      dateStyle: "full",
    }
    let optionTglUpdated = {
      dateStyle: "full",
      timeStyle: "short"
    }

    for(let i=0; i<res.items.length; i++) {
      items.value.items[i].harga_satuan = new Intl.NumberFormat("id-ID", option).format(res.items[i]?.harga_satuan)
      items.value.items[i].nilai_perolehan = new Intl.NumberFormat("id-ID", option).format(res.items[i]?.nilai_perolehan)

      let raw_tgl_ba_spj = new Date(res.items[i].tgl_ba_spj)
      let raw_updated = new Date(res.items[i].updated)
      items.value.items[i].tgl_ba_spj = new Intl.DateTimeFormat('id-ID', optionTgl).format(raw_tgl_ba_spj)
      items.value.items[i].updated = new Intl.DateTimeFormat('id-ID', optionTglUpdated).format(raw_updated)
    }

    isLoading.value = false
  }
}

async function loadMore(filter="", loading) {
  isMovingPage.value = loading
  let page = items.value.page + 1

  // filter by FilterBar
  if(role != 'sarpras' && role != 'pimpinan') {
    if(filter) {
      filter = filter + ` && kondisi!="B" && unit_kerja="${user?.user.value.unit_kerja}"`
      isActiveSearch.value = true
    } else {
      filter = `kondisi!="B"`
      isActiveSearch.value = false
    }
  } else {
    if(filter) {
      filter = filter + ` && kondisi!="B"`
      isActiveSearch.value = true
    } else {
      filter = `kondisi!="B"`
      isActiveSearch.value = false
    }
  }

  let res = await client.collection('aset').getList(page, perPage, {
    filter: filter,
    expand: `tahun_pengadaan, sumber_aset, rincian_aset, satuan_aset, unit_kerja`,
    sort: `kondisi, -tahun_pengadaan.tahun, triwulan, unit_kerja.ruangan`
  })

  if(res) {
    let option = {
      style: "currency",
      currency: "IDR"
    }
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

    items.value.page = res.page
    items.value.perPage = res.perPage
    items.value.totalPages = res.totalPages
    items.value.totalItems = res.totalItems
    items.value.items = items.value.items.concat(res.items);

    isMovingPage.value = false
  }
}


function setModalBarang(aset, index) {
  asset.value = aset
  assetIndex.value = index
  form.value.kondisi = aset.kondisi
  form.value.catatan_isu = aset.catatan_isu
  form.value.foto_isu = aset.foto_isu
}

// handle fetch data saat filter bar aktif
const handleFilterChange = (filterStr) => {
  fetchItems(filterStr)
  currentFilter.value = filterStr // ngasih tau kalo sedang difilter, ini akan dilempar ke tombol loadmore
}

async function handleUpdate() {
  isLoadingUpdate.value = true

  let res = await client.collection('aset').update(asset?.value.id, form.value)

  if(res) {
    if(foto_isu.value) foto_isu.value.value = ""
    isLoadingUpdate.value = false
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
  fetchItems()

  // Terpaksa kami pake realtime update based on all record lalu fetch ulang. kampret wkwkw!
  client.collection('aset').subscribe('*', function(e) {
    if(e.action == 'update') {
      fetchItems('')
    }
  }, {})
})
</script>
