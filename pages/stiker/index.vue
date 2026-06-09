<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent"> <span class="fs-5 text-muted">{{ route.path.toUpperCase().replace('/', ' ') }}</span>
      <div class="fw-normal text-muted">Stiker Aset</div>
    </div>

    <div class="card-body">
      <!-- filter bar -->
      <LoadingPlaceholder v-if="isLoadingFilterOption" :col="4" :n="1" />
      <div v-else class="sticky bg-white">
        <div class="row">
          <div class="col-md-1">
            <label for="unit_kerja" class="fw-bold">Unit Kerja</label>
            <select @change="fetchItems" v-if="unit_kerja.length > 0" v-model="filters.unit_kerja" class="form-select">
              <option value="">Pilih</option>
              <option v-for="(unit, i) in unit_kerja" :key="i" :value="unit.ruangan">{{ unit.ruangan }}</option>
            </select>
          </div>

          <div class="col-md-1">
            <label for="tgl_ba_spj" class="fw-bold">SPJ</label>
            <input @change="fetchItems" :disabled="!filters.unit_kerja" v-model="filters.tgl_ba_spj" class="form-control" id="tgl_ba_spj" type="date" />
          </div>

          <div class="col-md-1 pt-4">
            <button @click="handleFilterReset" v-if="filters.unit_kerja || filters.tgl_ba_spj" class="btn btn-dark">reset</button>
          </div>
        </div>
      </div>

      <div v-if="filters.unit_kerja && filters.tgl_ba_spj">
        <LoadingPlaceholder v-if="isLoading" :col="12" :n="7" />

        <PrintableAreaSticker v-else-if="!isLoading && assets.length > 0" :assets :setting />

        <div v-else class="p-5 text-center text-muted fw-bold">
          <i class="bi bi-search fs-2"></i>
          <div class="fs-5">Pencarian tidak ditemukan</div>
          <p>Silahkan filter kembali berdasarkan Unit Kerja dan Tanggal SPJ</p>
        </div>
      </div>

      <div v-else class="p-5 text-center text-muted fw-bold">
        <i class="bi bi-database fs-2"></i>
        <div class="fs-5">Belum tersedia</div>
        <p>Filter terlebih dahulu berdasarkan Unit Kerja dan Tanggal SPJ</p>
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
  title: "Stiker — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const route = useRoute()
const user = usePbUser()
const role = user?.user.value.role
const client = usePbClient()
const assets = ref([])
const isLoading = ref(false)
const isLoadingFilterOption = ref(true)
const unit_kerja = ref([])
const setting = ref('')

const filters = ref({
  unit_kerja: "",
  tgl_ba_spj: "",
})

// redirect jika role != Sarpras
if(role != 'sarpras') navigateTo('/')


function handleFilterReset() {
  filters.value.unit_kerja = ""
  filters.value.tgl_ba_spj = ""
  assets.value = []
}

// Fun ini trigger dari filter tgl_ba_spj dan unit_kerja
async function fetchItems() {
  // fetch record akan dilakukan apabila trigger dari tgl_ba_spj tidak kosong dan mengubah unit_kerja
  // alias trigger dari unit_kerja akan nyari aset kalo filter tgl_ba_spj terisi.
  if(filters.value.tgl_ba_spj) {
    isLoading.value = true

    let res = await client.collection('aset').getFullList({
    expand: `unit_kerja, rincian_aset, sumber_aset, tahun_pengadaan`,
      filter: `tgl_ba_spj~"${filters.value.tgl_ba_spj}" && unit_kerja.ruangan="${filters.value.unit_kerja}"`
    })

    if(res) {
      assets.value = res
      isLoading.value = false
    }
  }
}


async function fetchUnitKerja() {
  isLoadingFilterOption.value = true

  let res = await client.collection('unit_kerja').getFullList({
    sort: `ruangan`
  })

  if(res) {
    unit_kerja.value = res
    isLoadingFilterOption.value = false
  }
}


async function fetchSetting() {
  let res = await client.collection('pengaturan').getOne(`ecarpvlbtxskkb1`)
  if(res) {
    setting.value = res
  }
}


onMounted(() => {
  fetchUnitKerja()
  fetchSetting()
})
</script>
