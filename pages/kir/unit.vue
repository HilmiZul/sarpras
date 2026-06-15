<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <LoadingPlaceholder v-if="isLoadingUnit" :col="3" :n="1" />
      <span v-else-if="!isLoadingUnit && unit_kerja == ''">Unit Kerja tidak ditemukan</span>
      <span v-else class="fs-5 text-muted">KIR {{ unit_kerja?.ruangan }} &#8212; {{ unit_kerja?.kode_lokasi }}</span>
      <span class="float-end">
        <NuxtLink to="/kir" class="btn btn-dark me-2">Kembali</NuxtLink>
      </span>
      <div class="fw-normal text-muted">Daftar barang di Unit Kerja/Ruang</div>
    </div>

    <div class="card-body">
      <LoadingPlaceholder v-if="isLoadingPejabat" :col="2" :n="1" />

      <div v-else class="row mb-3">
        <div class="col-md-3">
          <div class="text-muted">Pemegang</div>
          <div class="text-muted fw-bold">{{ unit_kerja?.pemegang }} &#8212; {{ unit_kerja?.jabatan_unit_kerja }}</div>
        </div>

        <div class="col-md-3">
          <div class="text-muted">Wakasek Sarpras</div>
          <div class="text-muted fw-bold">{{ pejabat?.wakasek_sarpras }}</div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-2">
          <div class="mb-3">
            <select @change="fetchAssetsByUnitKerjaOrLocation" v-model="selectLocation" class="form-select">
              <option value="">Semua Lokasi</option>
              <option v-for="(location, i) in locations" :key="i"  :value="location.id">{{ location.nama_lokasi }}</option>
            </select>
          </div>
        </div>
      </div>

      <LoadingPlaceholder v-if="isLoading" :col="12" :n="5" />

      <div v-else-if="!isLoading && assets?.totalItems < 1" class="p-5 text-center text-muted fw-bold">
        <i class="bi bi-database fs-2"></i>
        <div class="fs-5">Belum tersedia</div>
      </div>

      <div v-else >
        <!-- Total {{ assets?.items?.length }} dari {{ assets?.totalItems }} items -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th width="2">NO.</th>
              <th width="10">FOTO</th>
              <th>NAMA BARANG</th>
              <th>SPESIFIKASI</th>
              <th>SUMBER</th>
              <th>TAHUN</th>
              <th>VOLUME</th>
              <th>LOKASI</th>
              <th>KONDISI</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(asset, i) in assets?.items" :key="i">
              <td>{{ i+1 }}.</td>
              <td>
                <div class="thumb-container-table">
                  <a @click="() => pratinjauFoto = asset" data-bs-toggle="modal" data-bs-target="#lihat-foto" class="hand">
                    <img v-if="asset.foto_barang" :src="`${host}/api/files/${asset.collectionId}/${asset.id}/${asset.foto_barang}`" :alt="asset.id" class="thumb-aset-table" />
                    <img v-else src="~/assets/img/placeholder.jpg" alt="thumb" class="thumb-aset-list" />
                  </a>
                </div>
              </td>
              <td>{{ asset.nama_aset_barang }}</td>
              <td>{{ asset.spesifikasi }}</td>
              <td>{{ asset.expand.sumber_aset.nama_sumber }}</td>
              <td>{{ asset.expand.tahun_pengadaan.tahun }}</td>
              <td>{{ asset.volume }} {{ asset.expand.satuan_aset.nama_satuan }}</td>
              <td>{{ asset.expand.lokasi_unit_kerja?.nama_lokasi || "-" }}</td>
              <td>
                <span v-if="asset.kondisi == 'B'">Baik</span>
                <span v-else-if="asset.kondisi == 'RR'">Rusak Ringan</span>
                <span v-else-if="asset.kondisi == 'RB'">Rusak Berat</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="modal" id="lihat-foto" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
            <div class="modal-content">
              <div class="modal-header fw-bold text-muted">
                Foto Barang
                <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
              </div>

              <div class="modal-body text-muted text-center">
                <div class="thumb-container-pratinjau-kir">
                  <img v-if="pratinjauFoto" :src="`${host}/api/files/${pratinjauFoto?.collectionId}/${pratinjauFoto?.id}/${pratinjauFoto?.foto_barang}`" :alt="pratinjauFoto?.id" class="thumb-aset" />
                  <img v-else src="~/assets/img/placeholder.jpg" alt="thumb" class="thumb-aset" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <LoadingPlaceholder v-if="isMovingPage" :col="12" :n="1" />

        <div v-if="!isLoading" class="text-center mt-3">
          <button v-if="assets.totalItems" :disabled="isMovingPage || assets.page >= assets.totalPages" @click="loadMore(true)" class="btn btn-primary">
            <span v-if="assets.page >= assets.totalPages">Semua sudah dimuat</span>
            <span v-else>Muat lagi <i class="bi bi-arrow-down"></i></span>
          </button>
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
  title: "Unit Kerja — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const route = useRoute()
const client = usePbClient()
const config = useRuntimeConfig()
const host = config.public.apiBaseUrl+":"+config.public.apiPort
const isLoading = ref(true)
const isLoadingUnit = ref(true)
const isLoadingLocation = ref(true)
const isLoadingPejabat = ref(true)
const isMovingPage = ref(false)

const perPage = 40

const unit_kerja = ref()
const assets = ref([])
const locations = ref([])
const pratinjauFoto = ref()
const pejabat = ref()

const selectLocation = ref('')

async function fetchUnitKerja() {
  isLoadingUnit.value = true

  try {
    let res = await client.collection('unit_kerja').getOne(route.query.ruang, {
      sort: `ruangan`
    })

    if(res) {
      unit_kerja.value = res
      isLoadingUnit.value = false
    }
  } catch (error) {
    unit_kerja.value = ''
    isLoadingUnit.value = false
  }
}


async function fetchLocationUnitKerja() {
  isLoadingLocation.value = true

  let res = await client.collection('lokasi_unit_kerja').getFullList({
    filter: `unit_kerja="${route.query.ruang}"`,
    sort: `unit_kerja`
  })

  if(res) {
    locations.value = res
    isLoadingLocation.value = false
  }
}

async function fetchAssetsByUnitKerjaOrLocation() {
  isLoading.value = true

  let filters = `unit_kerja="${route.query.ruang}"`
  if(selectLocation.value) {
    filters = filters + ` && lokasi_unit_kerja="${selectLocation.value}"`
  }

  let res = await client.collection('aset').getList(1, perPage, {
    filter: filters,
    expand: `sumber_aset, unit_kerja, lokasi_unit_kerja, tahun_pengadaan, satuan_aset`,
    sort: `-tahun_pengadaan.tahun`
  })

  if(res) {
    assets.value = res

    isLoading.value = false
  }
}

async function loadMore(loading=true) {
  isMovingPage.value = loading
  let page = assets.value.page + 1

  let filters = `unit_kerja="${route.query.ruang}"`
  if(selectLocation.value) {
    filters = filters + ` && lokasi_unit_kerja="${selectLocation.value}"`
  }

  let res = await client.collection('aset').getList(page, perPage, {
    filter: filters,
    expand: `sumber_aset, unit_kerja, lokasi_unit_kerja, tahun_pengadaan, satuan_aset`,
    sort: `-tahun_pengadaan.tahun`
  })

  if(res) {
    assets.value.page = res.page
    assets.value.perPage = res.perPage
    assets.value.totalPages = res.totalPages
    assets.value.totalItems = res.totalItems
    assets.value.items = assets.value.items.concat(res.items);

    isMovingPage.value = false
  }
}

async function fetchPejabat() {
  isLoadingPejabat.value = true

  let res = await client.collection('pejabat_penandatangan').getOne(`uvsu9ltaotfcfte`)

  if(res) {
    pejabat.value = res
    isLoadingPejabat.value = false
  }
}

onMounted(() => {
  fetchUnitKerja()
  fetchAssetsByUnitKerjaOrLocation()
  fetchLocationUnitKerja()
  fetchPejabat()
})
</script>
