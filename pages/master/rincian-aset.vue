<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5">{{ route.path.toUpperCase().replace('/', ' ').replace('-', ' ') }}</span>
      <span class="float-end">
        <button @click="() => isSuccess = false" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#tambah-rincian-aset"><i class="bi bi-plus"></i> Tambah</button>
      </span>
      <div class="fw-normal text-muted">Rincian Kode dan Nama barang</div>

      <div class="modal" id="tambah-rincian-aset" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header fw-bold">
              Tambah Rincian Aset
              <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <div v-if="isSuccess" class="alert alert-success alert-dismissible">
                <button @click="isSuccess = false" type="button" class="btn-close" data-bs-dismiss="alert"></button>
                Berhasil ditambahkan!
              </div>

              <form @submit.prevent="addNewItem">
                <div class="mb-4">
                  <label for="kode_barang" class="mb-2">Kode Barang</label>
                  <input v-model="form.kode_barang" type="text" id="kode_barang" class="form-control form-control-lg" placeholder="contoh: 1.234.567..." autofocus required />
                </div>

                <div class="mb-4">
                  <label for="nama_barang" class="mb-2">Nama Barang</label>
                  <input v-model="form.nama_barang" type="text" id="nama_barang" class="form-control form-control-lg" placeholder="nama barang" required />
                </div>

                <div class="mb-4">
                  <label for="kodering_aset" class="mb-2">Kodering Aset</label>
                  <input v-model="form.kodering_aset" id="kodering_aset" class="form-control form-control-lg" type="text" placeholder="contoh: 1.2.3.4.5..." required>
                </div>

                <div class="mb-4">
                  <label for="nama_rekening_aset" class="mb-2">Nama Rekening Aset</label>
                  <input v-model="form.nama_rekening_aset" id="nama_rekening_aset" class="form-control form-control-lg" type="text" placeholder="contoh: Umum" required>
                </div>

                <button class="btn btn-primary"><i class="bi bi-save"></i> Simpan</button>
                <button type="button" class="btn btn-outline-dark ms-2 float-end" data-bs-dismiss="modal">Tutup</button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="card-body">
      <form @submit.prevent="getItems">
        <div class="row mb-4">
          <div class="col-md-3">
            <input v-model="keyword" type="search" class="form-control form-control" placeholder="cari kode / nama barang">
          </div>

          <div class="col-md-2">
            <button class="btn btn-dark">Cari</button>
            <button @click="resetItem()" type="reset" class="btn btn-outline-dark ms-2">reset</button>
          </div>

          <div v-if="items?.items" class="col-md">
            <div class="fw-bold text-end text-muted">{{ items?.items.length }} / {{ items?.totalItems || 0 }} item(s)</div>
          </div>
        </div>
      </form>

      <div v-if="isLoading">
        <LoadingPlaceholder :col="1" :n="1" />
        <LoadingPlaceholder :col="5" :n="2" />
        <hr>
      </div>

      <div v-else-if="!isLoading && isActiveSearch && items.totalItems < 1" class="text-center text-muted p-5 fw-bold">
        <i class="bi bi-search fs-2"></i>
        <div class="fs-5">Pencarian tidak ditemukan.</div>
      </div>

      <div v-else-if="!isLoading && items.totalItems < 1" class="text-center text-muted p-5 fw-bold">
        <i class="bi bi-database fs-2"></i>
        <div class="fs-5">Belum Tersedia.</div>
      </div>

      <!-- display list item disini -->
      <div v-else>
        <ul v-for="item in items.items" :key="item.id" class="list-group list-group-flush">
          <li @click="setModalItem(item)" class="list-group-item hand" data-bs-toggle="modal" data-bs-target="#update-rincian-aset">
            <!-- <button data-bs-toggle="modal" data-bs-target="#hapus-item" class="btn btn-danger float-end"><i class="bi bi-trash"></i> Hapus</button> -->

            <div class="text-muted">Kode Barang</div>
            <div class="fw-bold text-muted fs-5 mb-2">{{ item.kode_barang }}</div>

            <div class="text-muted">Nama Barang</div>
            <div class="fw-bold text-muted fs-5 mb-2">{{ item.nama_barang }}</div>

            <div class="text-muted">Nama Rekening Aset</div>
            <div v-if="item.nama_rekening_aset" class="fw-bold text-muted fs-5">{{ item.nama_rekening_aset }}</div>
            <div v-else class="text-muted">&#8212;</div>
          </li>
        </ul>

        <div v-if="isMovingPage">
          <LoadingPlaceholder :col="1" :n="1" />
          <LoadingPlaceholder :col="5" :n="2" />
          <hr>
        </div>

        <div v-if="!isLoading" class="text-center mt-3">
          <button v-if="items.totalItems" :disabled="isMovingPage || items.page >= items.totalPages" @click="loadMore(items.page + 1, false)" class="btn btn-primary">
            <span v-if="items.page >= items.totalPages">Semua sudah dimuat</span>
            <span v-else>Muat lagi <i class="bi bi-arrow-down"></i></span>
          </button>
        </div>

        <div class="modal" id="update-rincian-aset" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header fw-bold">
                Ubah: {{ formUpdate?.nama_barang }}
                <button class="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div class="modal-body">
                <div v-if="isSuccess" class="alert alert-success alert-dismissible">
                  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                  Berhasil disimpan!
                </div>

                <form @submit.prevent="updateItem">
                  <div class="mb-4">
                    <label for="update_kode_barang" class="mb-2 fw-bold">Kode Barang</label>
                    <input v-model="formUpdate.kode_barang" type="text" id="update_kode_barang" class="form-control form-control-lg" placeholder="contoh: 1.234.567..." autofocus required />
                  </div>

                  <div class="mb-4">
                    <label for="update_nama_barang" class="mb-2 fw-bold">Nama Barang</label>
                    <input v-model="formUpdate.nama_barang" type="text" id="update_nama_barang" class="form-control form-control-lg" placeholder="nama barang" required />
                  </div>

                  <div class="mb-4">
                    <label for="update_kodering_aset" class="mb-2 fw-bold">Kodering Aset</label>
                    <input v-model="formUpdate.kodering_aset" id="update_kodering_aset" class="form-control form-control-lg" type="text" placeholder="contoh: 1.2.3.4.5..." required>
                  </div>

                  <div class="mb-4">
                    <label for="update_nama_rekening_aset" class="mb-2 fw-bold">Nama Rekening Aset</label>
                    <input v-model="formUpdate.nama_rekening_aset" id="update_nama_rekening_aset" class="form-control form-control-lg" type="text" placeholder="contoh: Umum" required>
                  </div>

                  <button class="btn btn-primary"><i class="bi bi-save"></i> Simpan</button>
                  <button type="button" class="btn btn-outline-dark ms-2 float-end" data-bs-dismiss="modal">Tutup</button>
                </form>

              </div>

            </div>
          </div>

        </div>

        <div class="modal" id="hapus-item" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header fw-bold">
                Hapus item?
              </div>

              <div class="modal-body">
                Yakin hapus: <strong>{{ formUpdate.nama_barang }}</strong>?
              </div>

              <div class="modal-footer">
                <button @click="deleteItem" data-bs-dismiss="modal" class="btn btn-outline-danger"><i class="bi bi-save"></i> Ya, hapus</button>
                <button class="btn btn-dark" data-bs-dismiss="modal">Tidak</button>
              </div>
            </div>
          </div>
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
  title: "Rincian Aset — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const route = useRoute()
const client = usePbClient()
const user = usePbUser()
const role = user?.user.value.role
const items = ref([])
const isLoading = ref(true)
const isSuccess = ref(false)
const perPage = 30
const keyword = ref()
const id_item = ref()
const isActiveSearch = ref(false)
const isMovingPage = ref(false)

const form = ref({
  "kode_barang": "",
  "nama_barang": "",
  "kodering_aset": "",
  "nama_rekening_aset": "",
})

const formUpdate = ref({
  "kode_barang": "",
  "nama_barang": "",
  "kodering_aset": "",
  "nama_rekening_aset": "",
})

if(role != 'sarpras') navigateTo('/')

async function getItems(loading=true) {
  isLoading.value = loading
  isActiveSearch.value = false

  let filter = ``
  if(keyword.value) {
    filter = `kode_barang~"${keyword.value}" || nama_barang~"${keyword.value}" || nama_rekening_aset~"${keyword.value}"`
    isActiveSearch.value = true
  }

  let res_items = await client.collection('rincian_aset').getList(1, perPage, {
    filter: filter,
    sort: `created, kode_barang`
  })

  if(res_items) {
    items.value = res_items
    isLoading.value = false
  }
}

async function loadMore(page, loading=true) {
  isLoading.value = loading
  isMovingPage.value = true
  isActiveSearch.value = false

  let filter = ``
  if(keyword.value) {
    filter = `kode_barang~"${keyword.value}" || nama_barang~"${keyword.value}" || nama_rekening_aset~"${keyword.value}"`
    isActiveSearch.value = true
  }

  let res_items = await client.collection('rincian_aset').getList(page, perPage, {
    filter: filter,
    sort: `created, kode_barang`
  })

  if(res_items) {
    items.value.page = res_items.page
    items.value.perPage = res_items.perPage
    items.value.totalPages = res_items.totalPages
    items.value.totalItems = res_items.totalItems
    items.value.items = items.value.items.concat(res_items.items)

    isLoading.value = false
    isMovingPage.value = false
  }
}


function resetItem() {
  keyword.value = ''
  getItems()
}

async function addNewItem() {
  isSuccess.value = false

  let res = await client.collection('rincian_aset').create(form.value)

  if(res) {
    isSuccess.value = true
    form.value.kode_barang = ''
    form.value.nama_barang = ''
    form.value.kodering_aset = ''
    form.value.nama_rekening_aset = ''

    getItems(false)
  }
}

function setModalItem(item) {
  isSuccess.value = false
  id_item.value = item.id
  formUpdate.value = item
}

async function updateItem() {
  isSuccess.value = false

  let res = await client.collection('rincian_aset').update(id_item.value, formUpdate.value)

  if(res) {
    isSuccess.value = true

    getItems(false)
  }
}

async function deleteItem() {
  await client.collection('rincian_aset').delete(id_item.value)

  getItems(false)
}

onMounted(() => {
  getItems()
})

</script>
