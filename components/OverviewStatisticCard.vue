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
              <div class="row">
                <div class="col-md-2 text-center"><i class="bi bi-box2 fs-1"></i></div>
                <div class="col-md-10">
                  <div class="fw-bold fs-2">{{ count_asset }}</div>
                  <div class="fs-5">Aset <i class="bi bi-arrow-up-right-square small"></i></div>
                </div>
              </div>
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
              <div class="row">
                <div class="col-md-2 text-center"><i class="bi bi-buildings fs-1"></i></div>
                <div class="col-md-10">
                  <div class="fw-bold fs-2">{{ count_unit_or_lokasi }}</div>
                  <div class="fs-5">Unit Kerja <i class="bi bi-arrow-up-right-square small"></i></div>
                </div>
              </div>
            </span>
          </div>
        </NuxtLink>
        <NuxtLink to="/master/lokasi-penyimpanan" v-else>
          <div class="alert alert-secondary">
            <span v-if="isLoadingUnit">
              <LoadingPlaceholder :n="1" :col="2" />
              <LoadingPlaceholder :n="1" :col="4" />
            </span>
            <span v-else>
              <div class="fw-bold fs-2">{{ count_unit_or_lokasi }}</div>
              <div class="fs-5">Lokasi Penyimpanan <i class="bi bi-arrow-up-right-square small"></i></div>
            </span>
          </div>
        </NuxtLink>
      </div>

      <div class="col-md-6">
        <div class="alert alert-dark">
          <div class="row">
            <div class="col-md-1 text-center"><i class="bi bi-cash-stack fs-1 text-white"></i></div>
            <div class="col-md-11">
              <div class="fw-bold fs-2">
                <span v-if="role == 'sarpras' || role == 'pimpinan'">{{ sum_nilai_perolehan }}</span>
                <span v-else>{{ sum_nilai_perolehan_unit}}</span>
              </div>
              <div class="fs-5">Total belanja saat ini</div>
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
let isLoadingPerolehan = ref(true)

let count_asset = ref(0)
let count_unit_or_lokasi = ref(0)
let sum_nilai_perolehan = ref(0)
let sum_nilai_perolehan_unit = ref(0)

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


async function sumNilaiPerolahan() {
  isLoadingPerolehan.value = true

  let res_sarpras = await client.collection('sum_assets_nilai_perolehan').getList(1,1,{})

  let res_unit = await client.collection('sum_assets_nilai_perolehan_unit').getFullList({})

  if(res_sarpras && res_unit) {
    // GET Jumlah Perolehan apabila role Sarpras
    let optionCurrency = {
      style: 'currency',
      currency: 'IDR'
    }
    sum_nilai_perolehan.value = new Intl.NumberFormat("id-ID", optionCurrency).format(res_sarpras.items[0].jumlah_perolehan)

    // Calculate nilai perolehan group by unit
    for(let i=0; i<res_unit.length; i++) {
      if(user?.user.value.unit_kerja == res_unit[i].unit_kerja) {
        sum_nilai_perolehan_unit.value = new Intl.NumberFormat("id-ID", optionCurrency).format(res_unit[i].jumlah_perolehan)
        break
      }
    }

    isLoadingPerolehan.value = false
  }
}


onMounted(() => {
  fetchAssets()
  fetchUnitOrLocation()
  sumNilaiPerolahan()
})
</script>
