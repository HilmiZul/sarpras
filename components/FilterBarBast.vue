<template>
  <div class="sticky bg-white">
    <div class="row mb-3 pb-3">
      <div class="col-md-1">
        <label for="tgl_sppb" class="fw-bold">SPPB</label>
        <input v-model="filters.tgl_sppb" class="form-control" id="tgl_sppb" type="date" required />
      </div>

      <div class="col-md-1">
        <label for="tgl_ba_spj" class="fw-bold">SPJ</label>
        <input v-model="filters.tgl_ba_spj" class="form-control" id="tgl_ba_spj" type="date" required />
      </div>

      <div v-if="props.role == 'sarpras'" class="col-md-1">
        <label for="unit_kerja" class="fw-bold">Unit Kerja</label>
        <select v-model="filters.unit_kerja" id="unit_kerja" class="form-select">
          <option value="">Pilih</option>
          <option v-for="(unit, i) in unit_kerja" :key="i" :value="unit.ruangan">{{ unit.ruangan }}</option>
        </select>
      </div>

      <div class="col-md-2 align-self-end">
        <!-- <button @click="terapkanFilter" :disabled="!hasActiveFilters" class="btn btn-dark">terapkan</button> -->
        <button @click="handleReset" class="btn btn-dark ms-1 mt-4">
          <i class="bi bi-x-lg"></i> reset
        </button>
      </div>

      <div v-if="props.bast?.items" class="col-md">
        <div class="text-end text-muted fw-bold">{{ props.bast?.items?.length }} / {{ props.bast?.totalItems }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const client = usePbClient()
const { filters, queryFilter, hasActiveFilters, resetFilters } = useItemFilters()
const emit = defineEmits(['filter-change'])

const props = defineProps(['role', 'bast'])
const role = props.role

const unit_kerja = ref([])

const handleReset = () => {
  resetFilters()
  emit('filter-change', '')
}

watch(queryFilter, (newFilter) => {
  if(newFilter) emit('filter-change', newFilter)
}, { immediate: false })

async function fetchUnitKerja() {
  client.autoCancellation(false)
  let res = await client.collection('unit_kerja').getFullList({
    sort: `ruangan`
  })

  if(res) {
    unit_kerja.value = res
  }
}

onMounted(() => {
  fetchUnitKerja()
})
</script>
