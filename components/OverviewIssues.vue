<template>
  <div class="mt-5">
    <h2 class="text-muted fw-bold">
      Isu
      <NuxtLink to="/isu" class="btn-ghost small"><i class="bi bi-arrow-up-right-square"></i></NuxtLink>
    </h2>

    <div class="row">
      <div class="col-md-12">
        <LoadingPlaceholder v-if="isLoading" :col="12" :n="5" />

        <div v-else-if="!isLoading && items?.totalItems < 1" class="alert p-5 text-center text-muted fw-bold bg-grey">
          <i class="bi bi-database fs-2"></i>
          <div class="fs-5">Tidak ada isu</div>
        </div>

        <ol v-else v-for="(aset, index) in items.items" :key="index" class="list-group list-group-flush">
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-3 me-auto">
              <div class="fs-5 fw-bold text-muted mb-2">{{ aset.expand.rincian_aset.nama_barang }} <span class="text-muted fw-normal">({{ aset.nama_aset_barang }})</span></div>

              <div class="fw-bold text-muted mb-2">{{ aset.expand.unit_kerja.ruangan }}</div>
              <div class="text-muted"><i class="bi bi-calendar"></i> {{ aset.updated }}</div>
            </div>

            <span v-if="aset.kondisi == 'RR'" class="badge fs-6 text-bg-warning rounded-pill mb-2"><i class="bi bi-tag"></i> Rusak Ringan</span>
            <span v-else-if="aset.kondisi == 'RB'" class="badge fs-6 text-bg-danger rounded-pill mb-2"><i class="bi bi-tag"></i> Rusak Berat</span>
            <span v-else-if="aset.kondisi == 'Hilang'" class="badge fs-6 text-bg-danger rounded-pill mb-2"><i class="bi bi-tag"></i> Hilang</span>
          </li>
        </ol>
      </div>
    </div>

  </div>
</template>


<script setup>
let user = usePbUser()
let client = usePbClient()

let role = user?.user.value.role
let isLoading = ref(true)
let items = ref([])

let perPage = 5


async function fetchItems() {
  isLoading.values = true

  // filter by FilterBar
  let filter
  if(role != 'sarpras' && role != 'pimpinan') {
    filter = `kondisi!="B" && unit_kerja="${user?.user.value.unit_kerja}"`
  } else {
    filter = `kondisi!="B"`
  }

  client.autoCancellation(false)
  let res = await client.collection('aset').getList(1, perPage, {
    filter: filter,
    expand: `tahun_pengadaan, sumber_aset, rincian_aset, satuan_aset, unit_kerja`,
    sort: `kondisi, -tahun_pengadaan.tahun, triwulan, unit_kerja.ruangan`
  })

  if(res) {
    items.value = res

    let option = {
      style: "currency",
      currency: "IDR"
    }
    let optionTgl = {
      dateStyle: "full",
    }
    let optionTglUpdated = {
      dateStyle: "full",
      timeStyle: "short"
    }

    for(let i=0; i<res.items.length; i++) {
      items.value.items[i].harga_satuan = new Intl.NumberFormat("id-ID", option).format(res.items[i]?.harga_satuan)
      items.value.items[i].nilai_perolehan = new Intl.NumberFormat("id-ID", option).format(res.items[i]?.nilai_perolehan)

      let raw_tgl_ba_spj = new Date(res.items[i].tgl_ba_spj)
      let raw_updated = new Date(res.items[i].updated)
      items.value.items[i].tgl_ba_spj = new Intl.DateTimeFormat('id-ID', optionTgl).format(raw_tgl_ba_spj)
      items.value.items[i].updated = new Intl.DateTimeFormat('id-ID', optionTglUpdated).format(raw_updated)
    }

    isLoading.value = false
  }
}


onMounted(() => {
  fetchItems()
})
</script>
