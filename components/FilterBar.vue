<template>
  <div class="sticky bg-white">
    <div class="row mb-3">
      <div class="col-md-1">
        <select v-model="filters.tahun" name="filterTahun" id="filterTahun" class="form-select">
          <option value="">Tahun</option>
          <option v-for="item in filterOption.tahun" :key="item.id" :value="item.tahun">{{ item.tahun }}</option>
        </select>
      </div>

      <div class="col-md-1">
        <select v-model="filters.triwulan" name="filterTriwulan" id="filterTriwulan" class="form-select">
          <option value="">Triwulan</option>
          <option value="tw-1">TW-1</option>
          <option value="tw-2">TW-2</option>
          <option value="tw-3">TW-3</option>
          <option value="tw-4">TW-4</option>
        </select>
      </div>

      <div class="col-md-1">
        <select v-model="filters.sumber" name="filterSumber" id="filterSumber" class="form-select">
          <option value="">Sumber</option>
          <option v-for="item in filterOption.sumber" :key="item.id" :value="item.nama_sumber">{{ item.nama_sumber }}</option>
        </select>
      </div>

      <div v-if="role == 'sarpras'" class="col-md-1 mb-3">
        <select v-model="filters.unit_kerja" name="filterUnitKerja" id="filterUnitKerja" class="form-select">
          <option value="">Unit Kerja</option>
          <option v-for="item in filterOption.unit_kerja" :key="item.id" :value="item.ruangan">{{ item.ruangan }}</option>
        </select>
      </div>

      <div v-if="role == 'unit'" class="col-md-1 mb-3">
        <select v-model="filters.lokasi" name="filterLokasi" id="filterLokasi" class="form-select">
          <option value="">Lokasi</option>
          <option v-for="item in filterOption.lokasi" :key="item.id" :value="item.nama_lokasi">{{ item.nama_lokasi }}</option>
        </select>
      </div>

      <div class="col-md-2">
        <!-- <button @click="terapkanFilter" :disabled="!hasActiveFilters" class="btn btn-dark">terapkan</button> -->
        <button :disabled="filters.tahun.length < 1 && filters.triwulan.length < 1 && filters.sumber.length < 1 && filters.unit_kerja.length < 1 && filters.lokasi.length < 1" @click="handleReset" class="btn btn-dark ms-1">
          <i class="bi bi-x-lg"></i> reset
        </button>
      </div>

      <div v-if="props.assets?.items" class="col-md">
        <div class="text-end text-muted fw-bold">{{ props.assets?.items?.length }} / {{ props.assets?.totalItems }} item(s)</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const client = usePbClient()
const user = usePbUser()
const { filters, queryFilter, hasActiveFilters, resetFilters } = useItemFilters()
const emit = defineEmits(['filter-change'])

const props = defineProps(['role', 'assets'])
const role = props.role

const filterOption = ref({
  keyword: "",
  tahun: "",
  sumber: "",
  unit_kerja: "",
  lokasi: "",
});

// const terapkanFilter = () => {
//   emit('filter-change', queryFilter.value)
// }

const handleReset = () => {
  resetFilters()
  emit('filter-change', '')
}

watch(queryFilter, (newFilter) => {
  if(newFilter) emit('filter-change', newFilter)
}, { immediate: false })

async function fetchMasterByCollection(collection) {
  let fields = ``
  let sort = ``
  let qFilter = ``

  if(collection == 'tahun_pengadaan') {
    fields = `id, tahun`
    sort = `-tahun`
  }
  else if(collection == 'sumber_aset') fields = `id, nama_sumber`
  else if(collection == 'unit_kerja') fields = `id, ruangan`
  else if(collection == 'lokasi_unit_kerja') qFilter = `unit_kerja="${user?.user.value.unit_kerja}"`

  client.autoCancellation(false)
  let res = await client.collection(collection).getFullList({
    filter: qFilter,
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

onMounted(() => {
  fetchMasterByCollection('tahun_pengadaan')
  fetchMasterByCollection('sumber_aset')
  fetchMasterByCollection('unit_kerja')
  fetchMasterByCollection('lokasi_unit_kerja')
})
</script>
