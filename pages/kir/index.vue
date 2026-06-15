<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5 text-muted">{{ route.path.toUpperCase().replace('/', ' ') }}</span>
      <div class="fw-normal text-muted">Kartu Inventaris Ruang. Semua barang tersebar di Unit Kerja berikut.</div>
    </div>

    <div class="card-body">
      <LoadingPlaceholder v-if="isLoading" :col="12" :n="5" />

      <div v-else class="row justify-content-center">
        <div v-for="(unit, i) in unit_kerja.items" :key="i" class="col-md-4">
          <NuxtLink :to="`/kir/unit?ruang=${unit.id}`" class="hand">
            <div class="card mb-4">
              <div class="card-body p-5 fs-3 fw-bold text-muted text-center">{{ unit.ruangan }}</div>
              <div class="card-footer">{{ unit.pemegang }} &#8212; {{ unit.jabatan_unit_kerja }}</div>
            </div>
          </NuxtLink>
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
  title: "KIR — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const route = useRoute()
const client = usePbClient()
const user = usePbUser()
const role = user?.user.value.role
const isLoading = ref(true)

const perPage = 30

const unit_kerja = ref()

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

onMounted(() => {
  fetchUnitKerja()
})
</script>
