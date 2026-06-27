<template>
  <div class="sticky bg-white">
    <div class="row mb-3 pb-3">
      <div class="col-md-1">
        <select v-model="filters.unit_kerja" id="unit_kerja" class="form-select">
          <option value="">Unit Kerja</option>
          <option v-for="(unit, i) in unit_kerja" :key="i" :value="unit.id">{{ unit.ruangan }}</option>
        </select>
      </div>

      <div class="col-md-1">
        <select v-model="filters.kondisi" id="kondisi" class="form-select">
          <option value="">Kondisi</option>
          <option value="RR">Rusak Ringan</option>
          <option value="RB">Rusak Berat</option>
          <option value="Hilang">Hilang</option>
        </select>
      </div>

      <div v-if="filters.unit_kerja || filters.kondisi" class="col-md-2">
        <button @click="handleReset" class="btn btn-dark ms-1">
          <i class="bi bi-x-lg"></i> reset
        </button>
      </div>

      <div v-if="props.issues?.items" class="col-md">
        <div class="text-end text-muted fw-bold">{{ props.issues?.items?.length }} / {{ props.issues?.totalItems }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const client = usePbClient()
const { filters, queryFilter, resetFilters } = useItemFiltersIssue()
const emit = defineEmits(['filter-change'])

const props = defineProps(['role', 'issues'])

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
