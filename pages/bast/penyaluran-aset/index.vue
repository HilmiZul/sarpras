<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5 text-muted">{{ route.path.toUpperCase().replace('/', ' ').replace('-', ' ') }}</span>
      <span v-if="role == 'sarpras'" class="float-end">
        <button class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#baru-ba"><i class="bi bi-plus"></i> Buat baru</button>
      </span>
      <div class="fw-normal text-muted">Riwayat dan Arsip Berita Acara</div>

      <!-- modal buat baru -->
      <div class="modal" id="baru-ba" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header fw-bold">
              Buat Berita Acara
              <button @click="closeModalCreateBA" class="btn-close" data-bs-dismiss="modal" label="Close"></button>
            </div>

            <div class="modal-body">
              <div v-if="isSuccess" class="alert alert-success">
                Berita Acara berhasil dibuat.
              </div>

              <form @submit.prevent="buatBaru">
                <div class="mb-4">
                  <label for="unit_kerja" class="mb-2">Unit Kerja</label>
                  <select v-model="form.unit_kerja" @change="fetchAsetBySpj" class="form-select form-select-lg" id="unit_kerja" required>
                    <option value="">&#8212; Pilih Unit Kerja &#8212;</option>
                    <option v-for="(unit, i) in units" :key="i" :value="unit.id">{{ unit.ruangan }}</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label for="tgl_spj" class="mb-2">Tanggal SPJ</label>
                  <input v-model="form.tgl_ba_spj" @change="fetchAsetBySpj" class="form-control form-control-lg" id="tgl_spj" type="date" required />
                </div>

                <hr>

                <div v-if="isLoadingAssets">
                  <LoadingPlaceholder :col="12" :n="2" />
                </div>

                <div v-else-if="!isLoadingAssets && form.tgl_ba_spj && assets?.length < 1" class="alert alert-danger">
                  <div class="fw-bold">Tidak ada aset pada Unit Kerja dan tanggal tersebut!</div>
                  <div class="fw-normal">Periksa kembali Unit Kerja dan tanggal SPJ!</div>
                </div>

                <div v-else-if="!isLoadingAssets && form.tgl_ba_spj && assets?.length > 0">
                  <div class="mb-3 text-muted text-center">Ada {{ assets?.length }} item</div>

                  <div class="mb-4">
                    <label for="no_ba" class="mb-2">Nomor Berita Acara</label>
                    <input v-model="form.no_ba" class="form-control form-select-lg" id="no_ba" type="text" placeholder=".../.../..." required />
                  </div>

                  <div class="mb-4">
                    <label for="no_sppb" class="mb-2">Nomor SPPB</label>
                    <input v-model="form.no_sppb" class="form-control form-control-lg" id="no_sppb" type="text" placeholder=".../.../..." required />
                  </div>

                  <div class="mb-4">
                    <label for="tgl_sppb" class="mb-2">Tanggal SPPB</label>
                    <input v-model="form.tgl_sppb" class="form-control form-control-lg" id="tgl_sppb" type="date" required />
                  </div>

                  <button class="btn btn-primary btn-lg">Buat</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>

    </div>

    <div class="card-body pt-0">
      <FilterBarBast :bast :role @filter-change="handleFilterChange" />

      <div>
        <div class="row">
          <div class="col-md-12">
            <LoadingPlaceholder v-if="isLoading" :col="12" :n="5" />

            <div v-else-if="!isLoading && isActiveSearch && bast?.totalItems < 1" class="text-center text-muted p-5 fw-bold">
              <i class="bi bi-search fs-2"></i>
              <div class="fs-5">Pencarian tidak ditemukan.</div>
            </div>

            <div v-else-if="!isLoading && bast?.totalItems < 1" class="text-center text-muted p-5 fw-bold">
              <i class="bi bi-database fs-2"></i>
              <div class="fs-5">Belum Tersedia.</div>
            </div>

            <div v-else class="mb-3">
              <ul v-for="ba in bast.items" :key="ba.id" class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-start py-3">
                  <div class="ms-2 me-auto">
                    <div class="text-muted">Nomor Berita Acara</div>
                    <div class="fw-bold text-muted fs-6 mb-2">{{ ba.no_ba }}</div>

                    <div class="text-muted">SPPB</div>
                    <div class="fw-bold text-muted fs-6">{{ ba.tgl_sppb }}</div>
                    <div class="fw-bold text-muted fs-6 mb-2">{{ ba.no_sppb }}</div>

                    <div class="text-muted">SPJ</div>
                    <div class="fw-bold text-muted fs-6 mb-2">{{ ba.tgl_ba_spj }}</div>

                    <div class="text-muted">Unit Kerja</div>
                    <div class="fw-bold text-muted fs-6 mb-2">{{ ba?.expand?.unit_kerja.ruangan }}</div>

                    <button @click="setModalItemEdit(ba)" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#edit"><i class="bi bi-pencil"></i> Edit</button>
                    <button @click="fetchAsetBySpj(ba.unit_kerja, ba.tgl_ba_spj)" class="btn btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#pratinjau-aset-by-ba"><i class="bi bi-eye"></i> Intip Aset</button>
                    <NuxtLink :to="`/bast/penyaluran-aset/cetak?ba=${ba.id}&uk=${ba.unit_kerja}&tgl_spj=${ba.tgl_ba_spj}`" target="_blank" class="btn btn-dark ms-2"><i class="bi bi-printer"></i> Cetak</NuxtLink>
                    <button v-if="ba.arsip" @click="pratinjauArsip(ba)" class="btn btn-dark ms-2" data-bs-toggle="modal" data-bs-target="#pratinjau-arsip"><i class="bi bi-eye"></i> Lihat Arsip</button>
                    <button @click="setModalUpload(ba.id)" class="btn btn-outline-dark ms-2" data-bs-toggle="modal" data-bs-target="#unggah-ba"><i class="bi bi-upload"></i> Unggah Arsip</button>
                  </div>

                  <button @click="() => id_item = ba.id" data-bs-toggle="modal" data-bs-target="#hapus-item" class="btn btn-danger"><i class="bi bi-trash"></i> Hapus</button>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <LoadingPlaceholder v-if="isMovingPage" :col="12" :n="5" />

        <div v-if="!isLoading" class="text-center">
          <button v-if="bast.totalItems" :disabled="isMovingPage || bast.page >= bast.totalPages" @click="loadMore(currentFilter, false)" class="btn btn-primary">
            <span v-if="bast.page >= bast.totalPages">Semua sudah dimuat</span>
            <span v-else>Muat lagi <i class="bi bi-arrow-down"></i></span>
          </button>
        </div>

        <!-- single modal: lihat berkas ba -->
        <div class="modal" id="pratinjau-arsip" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered modal-fullscreen">
            <div class="modal-content">
              <div class="modal-header fw-bold">
                Arsip Berita Acara
                <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
              </div>
              <div class="modal-body">
                <iframe v-if="pratinjau" :src="`${host}/api/files/${pratinjau?.collectionId}/${pratinjau?.id}/${pratinjau?.arsip}`" width="100%" height="100%"></iframe>
              </div>
            </div>
          </div>
        </div>

        <!-- single modal: lihat assets berdasarkan Tanggal BA SPJ dan Unit Kerja -->
        <div class="modal" id="pratinjau-aset-by-ba" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header fw-bold">
                Daftar aset pada BA ini
                <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
              </div>

              <div class="modal-body">
                <LoadingPlaceholder v-if="isLoadingAssets" :col="12" :n="3" />

                <div v-else>
                  <div class="text-center text-muted">{{ assets?.length }} items</div>
                  <ul v-for="(asset, i) in assets" :key="i" class="list-group list-group-flush">
                    <li class="list-group-item">
                      <div class="text-muted fw-bold">
                        {{ asset.nama_aset_barang }}
                      </div>
                      <div class="text-muted">
                        {{ asset?.expand?.rincian_aset.nama_barang }} / {{ asset?.expand?.tahun_pengadaan.tahun }} / {{ asset?.triwulan.toUpperCase() }}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="modal-footer border-0">
                <button class="btn btn-dark" data-bs-dismiss="modal">Tutup</button>
              </div>
            </div>
          </div>
        </div>

        <!-- single modal: unggah berkas ba -->
        <div class="modal" id="unggah-ba" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header fw-bold">
                Unggah Berkas Berita Acara
                <button @click="closeModalUploadArsip" class="btn-close" data-bs-dismiss="modal" label="Close"></button>
              </div>
              <div class="modal-body">
                <div v-if="isUploaded" class="alert alert-success">Berkas berhasil diunggah!</div>

                <form @submit.prevent="uploadArsip">
                  <div class="mb-3">
                    <label for="file" class="mb-2">Berkas .PDF <span class="text-danger">(1 Mb)</span></label>
                    <input @change="compressFile" class="form-control form-control-lg" id="file" type="file" accept="application/pdf" required />
                  </div>

                  <button :disabled="isLoadingUpload" class="btn btn-primary">
                    <span v-if="isLoadingUpload">Sedang mengirim</span>
                    <span v-else>Kirim</span>
                  </button>
                  <button @click="closeModalUploadArsip" type="button" class="btn btn-outline-dark ms-2" data-bs-dismiss="modal">Tutup</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- single modal: edit -->
        <div class="modal" id="edit" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header fw-bold">
                Edit: Berita Acara
                <button @click="() => isSuccess = false" class="btn-close" data-bs-dismiss="modal" label="Close"></button>
              </div>

              <div class="modal-body">
                <div v-if="isSuccess" class="alert alert-success">
                  Berita Acara berhasil disimpan.
                </div>

                <form @submit.prevent="handleEdit">
                  <div class="mb-4">
                    <label for="update_no_ba" class="fw-bold mb-2">Nomor Berita Acara</label>
                    <input v-model="formUpdate.no_ba" class="form-control form-select-lg" id="update_no_ba" type="text" placeholder=".../.../..." required />
                  </div>

                  <div class="mb-4">
                    <label for="update_no_sppb" class="fw-bold mb-2">Nomor SPPB</label>
                    <input v-model="formUpdate.no_sppb" class="form-control form-control-lg" id="update_no_sppb" type="text" placeholder=".../.../..." required />
                  </div>

                  <div class="mb-4">
                    <label for="update_tgl_sppb" class="fw-bold mb-2">Tanggal SPPB</label>
                    <input v-model="formUpdate.tgl_sppb" class="form-control form-control-lg" id="update_tgl_sppb" type="date" required />
                  </div>

                  <button class="btn btn-primary">Simpan</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="modal" id="hapus-item" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header fw-bold">
                Hapus item?
              </div>

              <div class="modal-body">
                Yakin hapus: <strong>{{ formUpdate?.no_ba }}</strong> ini?
              </div>

              <div class="modal-footer">
                <button @click="deleteItem" data-bs-dismiss="modal" class="btn btn-outline-danger"><i class="bi bi-save"></i> Ya, hapus</button>
                <button class="btn btn-dark" data-bs-dismiss="modal">Tidak</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div v-else class="row"> -->
      <!--   halo ini untuk selain sarpras -->
      <!-- </div> -->

    </div>

  </div>
</template>


<script setup>
import FilterBarBast from '../../../components/FilterBarBast.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

useHead({
  title: "Berita Acara — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

let config = useRuntimeConfig()
let host = config.public.apiBaseUrl + ":" + config.public.apiPort
const user = usePbUser()
const client = usePbClient()
const role = user?.user.value.role
const route = useRoute()
const isLoading = ref(true)
const isLoadingAssets = ref(false)
const isLoadingUpload = ref(false)
const isUploaded = ref(false)
const isSuccess = ref(false)
const isSaving = ref(false)
let perPage = 30
let bast = ref([])
const units = ref([])
const assets = ref([])
const isMovingPage = ref(false)
const isActiveSearch = ref(false)
const currentFilter = ref()
const id_update = ref()
const id_item = ref()
const pratinjau = ref('')

const tahun_pengadaan = ref([])
const form = ref({
  "kategori": "pa", // nilai default: penyerahan aset
  "no_ba": "",
  "no_sppb": "",
  "tgl_sppb": "",
  "unit_kerja": "",
  "tgl_ba_spj": "",
})

const formUpdate = ref({
  "arsip": ""
})

async function buatBaru() {
  // TODO: pikirin lagi urutan form input saat pembuatan berit acara
  // apakah tombol buat per tab (kategori BA) atau tombol buat tetap umum dan memilih kategori BA??
  // DONE!
  isSuccess.value = false
  isSaving.value = true

  let res = await client.collection('bast').create(form.value)

  if(res) {
    fetchBA()
    isSuccess.value = true
    isSaving.value = false
  }
}

async function handleEdit() {
  isSuccess.value = false
  isSaving.value = true

  let res = await client.collection('bast').update(formUpdate.value.id, {
    "no_ba": formUpdate.value.no_ba,
    "tgl_sppb": formUpdate.value.tgl_sppb,
    "tgl_ba_spj": formUpdate.value.tgl_ba_spj,
  })

  if(res) {
    isSaving.value = false
    isSuccess.value = true
  }
}

async function deleteItem() {
  await client.collection('bast').delete(id_item.value)

  fetchBA()
}

async function fetchTahun() {
  let res = await client.collection('tahun_pengadaan').getFullList({
    sort: `-tahun`
  })

  if(res) {
    tahun_pengadaan.value = res
  }
}

async function fetchAsetBySpj(unit_kerja="", tgl_ba_spj="") {
  isLoadingAssets.value = true

  let filter = ``
  if(unit_kerja && tgl_ba_spj) {
    filter = `tgl_ba_spj~"${tgl_ba_spj}" && unit_kerja="${unit_kerja}"`
  } else {
    filter = `tgl_ba_spj~"${form.value.tgl_ba_spj}" && unit_kerja="${form.value.unit_kerja}"`
  }

  if(form.value.tgl_ba_spj && form.value.unit_kerja) {
    let res = await client.collection('aset').getFullList({
      filter: filter
    })

    if(res) {
      assets.value = res
      isLoadingAssets.value = false
    }
  }

  if(unit_kerja && tgl_ba_spj) {
    let res = await client.collection('aset').getFullList({
      expand: `rincian_aset, tahun_pengadaan`,
      filter: filter
    })

    if(res) {
      assets.value = res
      isLoadingAssets.value = false
    }
  }
}

async function fetchUnitKerja() {
  let res = await client.collection('unit_kerja').getFullList({
    sort: `ruangan`
  })

  if(res) {
    units.value = res
  }
}

function closeModalCreateBA() {
  form.value.tgl_ba_spj = ""
  form.value.unit_kerja = ""
  isSuccess.value = false
}

function closeModalUploadArsip() {
  formUpdate.value.arsip = ""
  isLoadingUpload.value = false
  isUploaded.value = false
  isSuccess.value = false
}

async function fetchBA(filter="") {
  isLoading.value = true
  isActiveSearch.value = false

  // check role dan advance filter/search
  if(role == 'unit') {
    if(filter) {
      filter = filter + ` && unit_kerja="${user?.user.value.unit_kerja}" && kategori="pa"`
      isActiveSearch.value = true
    } else {
      filter = `unit_kerja="${user?.user.value.unit_kerja}" && kategori="pa"`
      isActiveSearch.value = false
    }
  }

  else if(role == 'sarpras' || role == 'pimpinan') {
    if(filter) {
      filter = filter + ` && kategori="pa"`
      isActiveSearch.value = true
    }
    else isActiveSearch.value = false
  }

  client.autoCancellation(false)
  let res = await client.collection('bast').getList(1, perPage, {
    expand: `unit_kerja`,
    filter: filter,
    sort: `-tgl_sppb`
  })

  if(res) {
    bast.value = res

    for(let i=0; i<res.items.length; i++) {
      let raw_tgl_ba_spj = new Date(res.items[i].tgl_ba_spj)
      let raw_tgl_sppb = new Date(res.items[i].tgl_sppb)
      bast.value.items[i].tgl_ba_spj = raw_tgl_ba_spj.toISOString().split('T')[0]
      bast.value.items[i].tgl_sppb = raw_tgl_sppb.toISOString().split('T')[0]
    }

    isLoading.value = false
  }
}

async function loadMore(filter="", loading=false) {
  isLoading.value = loading
  isMovingPage.value = true
  isActiveSearch.value = false
  let page = bast.value.page + 1

  // check role dan advance filter/search
  if(role == 'unit') {
    if(filter) {
      filter = filter + ` && unit_kerja="${user?.user.value.unit_kerja}" && kategori="pa"`
      isActiveSearch.value = true
    } else {
      filter = `unit_kerja="${user?.user.value.unit_kerja}" && kategori="pa"`
      isActiveSearch.value = false
    }
  }

  else if(role == 'sarpras' || role == 'pimpinan') {
    if(filter) {
      filter = filter + ` && kategori="pa"`
      isActiveSearch.value = true
    }
    else isActiveSearch.value = false
  }

  client.autoCancellation(false)
  let res = await client.collection('bast').getList(page, perPage, {
    expand: `unit_kerja`,
    filter: filter,
    sort: `-tgl_sppb`
  })

  if(res) {
    for(let i=0; i<res.items.length; i++) {
      let raw_tgl_ba_spj = new Date(res.items[i].tgl_ba_spj)
      let raw_tgl_sppb = new Date(res.items[i].tgl_sppb)
      res.items[i].tgl_ba_spj = raw_tgl_ba_spj.toISOString().split('T')[0]
      res.items[i].tgl_sppb = raw_tgl_sppb.toISOString().split('T')[0]
    }

    bast.value.page = res.page
    bast.value.perPage = res.perPage
    bast.value.totalPages = res.totalPages
    bast.value.totalItems = res.totalItems
    bast.value.items = bast.value.items.concat(res.items)

    isMovingPage.value = false
    isLoading.value = false
  }
}

// handle fetch data saat filter bar aktif
const handleFilterChange = (filterStr) => {
  fetchBA(filterStr)
  currentFilter.value = filterStr // ngasih tau kalo sedang difilter, ini akan dilempar ke tombol loadmore
}

function setModalUpload(id) {
  id_update.value = id
}

function setModalItemEdit(ba) {
  formUpdate.value = ba
}

function pratinjauArsip(arsip) {
  pratinjau.value = arsip
}

function compressFile(e) {
  let file = e.target.files[0]
  formUpdate.value.arsip = file
}

async function uploadArsip() {
  isUploaded.value = false
  isLoadingUpload.value = true

  let res = await client.collection('bast').update(id_update.value, {
    "arsip": formUpdate.value.arsip
  })

  if(res) {
    fetchBA()
    isUploaded.value = true
    isLoadingUpload.value = false
  }
}

onMounted(() => {
  fetchTahun()
  fetchUnitKerja()
  fetchBA() 
})
</script>
