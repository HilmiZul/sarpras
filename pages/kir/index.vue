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

    <div v-if="isMovingPage">
      <LoadingPlaceholder :col="1" :n="1" />
      <LoadingPlaceholder :col="5" :n="4" />
      <hr>
    </div>

    <div v-if="!isLoading" class="text-center mb-3">
      <button v-if="unit_kerja.totalItems" :disabled="isMovingPage || unit_kerja.page >= unit_kerja.totalPages" @click="loadMore(unit_kerja.page + 1, false)" class="btn btn-primary">
        <span v-if="unit_kerja.page >= unit_kerja.totalPages">Semua sudah dimuat</span>
        <span v-else>Muat lagi <i class="bi bi-arrow-down"></i></span>
      </button>
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
const isMovingPage = ref(false)

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

async function loadMore(page, loading=true) {
  isLoading.value = loading
  isMovingPage.value = true

  let res = await client.collection('unit_kerja').getList(page, perPage, {
    sort: `ruangan`
  })

  if(res) {
    unit_kerja.value.page = res.page
    unit_kerja.value.perPage = res.perPage
    unit_kerja.value.totalPages = res.totalPages
    unit_kerja.value.totalItems = res.totalItems
    unit_kerja.value.items = unit_kerja.value.items.concat(res.items)

    isLoading.value = false
    isMovingPage.value = false
  }
}

onMounted(() => {
  fetchUnitKerja()
})
</script>
