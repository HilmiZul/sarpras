<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5 text-muted">{{ route.path.toUpperCase().replace('/', ' ') }}</span>
      <div class="fw-normal text-muted">Kartu Inventaris Ruang</div>
    </div>

    <div class="card-body">
      <ul>
        <li>bentuk card</li>
        <li>preview modal aset didalam unit kerja / ruangan tersebut</li>
        <ul>
          <li>pada preview jika ada ruangan dalam unit kerja, maka tampilkan</li>
          <li>kalo engga, unti kerja saja (ruangan)</li>
        </ul>
      </ul>

      <LoadingPlaceholder v-if="isLoading" :col="12" :n="5" />

      <div v-else class="row justify-content-center">
        <div v-for="(unit, i) in unit_kerja.items" :key="i" class="col-md-4">
          <NuxtLink class="hand" data-bs-toggle="modal" data-bs-target="#rincian" @click="fetchAssetsByUnitKerja(unit.id, unit.ruangan, unit.kode_lokasi)">
            <div class="card mb-4">
              <div class="card-body p-5 fs-3 fw-bold text-muted text-center">{{ unit.ruangan }}</div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- modal: rincian asset by unit kerja -->
      <div class="modal" id="rincian" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
          <div class="modal-content">
            <div class="modal-header fw-bold text-muted fs-5">
              KIR &nbsp;<LoadingPlaceholder v-if="isLoadingAsset" :col="2" :n="1" /> <span v-if="nama_unit && kode_lokasi_unit">{{ nama_unit }} &#8212; {{ kode_lokasi_unit }}</span>
              <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body text-muted">
              <LoadingPlaceholder v-if="isLoadingAsset" :col="12" :n="5" />

              <div v-else-if="!isLoadingAsset && assets?.totalItems < 1" class="p-5 text-center text-muted fw-bold">
                <i class="bi bi-database fs-2"></i>
                <div class="fs-5">Belum tersedia</div>
              </div>

              <div v-else >
                <!-- Total {{ assets?.items?.length }} dari {{ assets?.totalItems }} items -->
                <table class="table">
                  <thead>
                    <tr>
                      <th width="2">NO.</th>
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

                <LoadingPlaceholder v-if="isMovingPage" :col="12" :n="1" />

                <div v-if="!isLoading" class="text-center mt-3">
                  <button v-if="assets.totalItems" :disabled="isMovingPage || assets.page >= assets.totalPages" @click="loadMore(assets.page + 1, true)" class="btn btn-primary">
                    <span v-if="assets.page >= assets.totalPages">Semua sudah dimuat</span>
                    <span v-else>Muat lagi <i class="bi bi-arrow-down"></i></span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
import { onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "KIR — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const route = useRoute()
const client = usePbClient()
const user = usePbUser()
const role = user?.user.value.role
const isLoading = ref(true)
const isLoadingAsset = ref(false)
const isMovingPage = ref(false)
const setIdUnit = ref()

const perPage = 30
const perPageAset = 30

const unit_kerja = ref()
const nama_unit = ref()
const kode_lokasi_unit = ref()
const assets = ref([])


async function fetchUnitKerja() {
  isLoading.value = true

  let res = await client.collection('unit_kerja').getList(1, perPage, {
    sort: `ruangan`
  })

  if(res) {
    unit_kerja.value = res
    isLoading.value = false
  }
}


async function fetchAssetsByUnitKerja(id_unit, ruangan, kode_lokasi) {
  isLoadingAsset.value = true
  setIdUnit.value = id_unit

  let res = await client.collection('aset').getList(1, perPageAset, {
    filter: `unit_kerja="${setIdUnit.value}"`,
    expand: `sumber_aset, unit_kerja, lokasi_unit_kerja, tahun_pengadaan, satuan_aset`,
    sort: `-tahun_pengadaan.tahun`
  })

  if(res) {
    assets.value = res
    nama_unit.value = ruangan
    kode_lokasi_unit.value = kode_lokasi

    isLoadingAsset.value = false
  }
}

async function loadMore(page, loading=true) {
  isMovingPage.value = loading

  let res = await client.collection('aset').getList(page, perPageAset, {
    filter: `unit_kerja="${setIdUnit.value}"`,
    expand: `sumber_aset, unit_kerja, tahun_pengadaan, satuan_aset`,
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

onMounted(() => {
  fetchUnitKerja()
})
</script>
