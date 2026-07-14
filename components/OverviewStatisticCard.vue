<template>
  <div>
    <h2 class="text-muted fw-bold">Statistik</h2>

    <div class="row">
      <div class="col-md-3">
        <NuxtLink to="/inventaris/aset">
          <div class="alert alert-secondary">
            <span v-if="isLoading">
              <LoadingPlaceholder  :n="1" :col="2" />
              <LoadingPlaceholder  :n="1" :col="4" />
            </span>
            <span v-else>
              <div class="fw-bold fs-2">{{ count_asset }}</div>
              <div class="fs-4">Aset <i class="bi bi-arrow-up-right-square small"></i></div>
            </span>
          </div>
        </NuxtLink>
      </div>

      <div class="col-md-3">
        <NuxtLink v-if="role == 'sarpras'" to="/master/unit-kerja">
          <div class="alert alert-secondary">
            <span v-if="isLoadingUnit">
              <LoadingPlaceholder :n="1" :col="2" />
              <LoadingPlaceholder :n="1" :col="4" />
            </span>
            <span v-else>
              <div class="fw-bold fs-2">{{ count_unit_or_lokasi }}</div>
              <div class="fs-4">
                <span v-if="role == 'unit'">Lokasi Penyimpanan</span>
                <span v-else>Unit Kerja <i class="bi bi-arrow-up-right-square small"></i></span>
              </div>
            </span>
          </div>
        </NuxtLink>
        <span v-else>
          <div class="alert alert-secondary">
            <span v-if="isLoadingUnit">
              <LoadingPlaceholder :n="1" :col="2" />
              <LoadingPlaceholder :n="1" :col="4" />
            </span>
            <span v-else>
              <div class="fw-bold fs-2">{{ count_unit_or_lokasi }}</div>
              <div class="fs-4">
                <span v-if="role == 'unit'">Lokasi Penyimpanan</span>
                <span v-else>Unit Kerja</span>
              </div>
            </span>
          </div>
        </span>
      </div>

      <div class="col-md-6">
        <div class="alert alert-dark">
          <div class="row">
            <div class="col-md-1 text-center"><i class="bi bi-cash-stack fs-1 text-white"></i></div>
            <div class="col-md-11">
              <div class="fw-bold fs-2">Rp1.400.000.000</div>
              <div class="fs-4">Total belanja saat ini</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
let client = usePbClient()
let user = usePbUser()

let role = user?.user.value.role
let isLoading = ref(true)
let isLoadingUnit = ref(true)

let count_asset = ref(0)
let count_unit_or_lokasi = ref(0)

async function fetchAssets() {
  isLoading.value = true

  let filters = ''
  if(role == 'unit') {
    filters = `unit_kerja="${user?.user.value.unit_kerja}"`
  }

  let res = await client.collection('aset').getList(1,1, {
    filter: filters
  })

  if(res) {
    count_asset.value = res.totalItems

    isLoading.value = false
  }
}

async function fetchUnitOrLocation() {
  isLoadingUnit.value = true

  let collectionName = 'unit_kerja'
  let filters = ''

  if(role == 'unit') {
    collectionName = 'lokasi_unit_kerja'
    filters = `unit_kerja="${user?.user.value.unit_kerja}"`
  }

  let res = await client.collection(collectionName).getList(1, 1, {
    filter: filters
  })

  if(res) {
    count_unit_or_lokasi.value = res.totalItems

    isLoadingUnit.value = false
  }
}


onMounted(() => {
  fetchAssets()
  fetchUnitOrLocation()
})
</script>
