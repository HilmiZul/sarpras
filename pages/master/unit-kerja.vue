<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5">{{ route.path.toUpperCase().replace('/', ' ').replace('-', ' ') }}</span>
      <span class="float-end">
        <button @click="() => isSuccess = false" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#tambah-unit-kerja"><i class="bi bi-plus"></i> Tambah</button>
      </span>
      <div class="fw-normal text-muted">Daftar Unit Kerja dan Penanggung Jawab</div>

      <div class="modal" id="tambah-unit-kerja" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header fw-bold">
              Tambah Unit Kerja
              <button @click="() => isSuccess = false" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <div v-if="isSuccess" class="alert alert-success alert-dismissible">
                <button @click="isSuccess = false" type="button" class="btn-close" data-bs-dismiss="alert"></button>
                Berhasil ditambahkan!
              </div>

              <form @submit.prevent="addNewItem">
                <div class="mb-4">
                  <label for="kode_lokasi" class="mb-2">Kode Lokasi</label>
                  <input v-model="form.kode_lokasi" type="text" id="kode_lokasi" class="form-control form-control-lg" placeholder="nama ruangan" required />
                </div>

                <div class="mb-4">
                  <label for="ruangan" class="mb-2">Ruangan</label>
                  <input v-model="form.ruangan" type="text" id="ruangan" class="form-control form-control-lg" placeholder="nama ruangan" required />
                </div>

                <div class="mb-4">
                  <label for="pemegang" class="mb-2">Pemegang</label>
                  <input v-model="form.pemegang" type="text" id="pemegang" class="form-control form-control-lg" placeholder="nama lengkap pemegang" required />
                </div>

                <div class="mb-4">
                  <label for="nip_pemegang" class="mb-2">NIP Pemegang</label>
                  <input v-model="form.nip_unit_kerja" type="text" id="nip_pemegang" class="form-control form-control-lg" placeholder="NIP pemegang (jika ada)" />
                </div>

                <div class="mb-4">
                  <label for="jabatan" class="mb-2">Jabatan Unit Kerja</label>
                  <input v-model="form.jabatan_unit_kerja" type="text" id="jabatan" class="form-control form-control-lg" placeholder="contoh: Kabeng RPL" required />
                </div>

                <button class="btn btn-primary"><i class="bi bi-save"></i> Simpan</button>
                <button @click="() => isSuccess = false" type="button" class="btn btn-outline-dark ms-2 float-end" data-bs-dismiss="modal">Tutup</button>
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
            <input v-model="keyword" type="search" class="form-control form-control" placeholder="cari unit kerja / pemegang">
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
        <LoadingPlaceholder :col="5" :n="4" />
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

      <div v-else>
        <ul v-for="item in items.items" :key="item.id" class="list-group list-group-flush">
          <li @click="setModalItem(item)" class="list-group-item hand" data-bs-toggle="modal" data-bs-target="#update-unit-kerja">
            <!-- <button data-bs-toggle="modal" data-bs-target="#hapus-item" class="btn btn-danger float-end"><i class="bi bi-trash"></i> Hapus</button> -->

            <div class="fw-bold text-muted fs-5"><i class="bi bi-buildings"></i> {{ item.ruangan }}</div>

            <div class="fw-bold text-muted">{{ item.kode_lokasi }}</div>

            <div class="fw-bold text-muted">{{ item.jabatan_unit_kerja }}</div>

            <div class="text-muted">{{ item.pemegang }}</div>

            <div class="text-muted">NIP. {{ item.nip_unit_kerja }}</div>

          </li>
        </ul>

        <div v-if="isMovingPage">
          <LoadingPlaceholder :col="1" :n="1" />
          <LoadingPlaceholder :col="5" :n="4" />
          <hr>
        </div>

        <div v-if="!isLoading" class="text-center mt-3">
          <button v-if="items.totalItems" :disabled="isMovingPage || items.page >= items.totalPages" @click="loadMore(items.page + 1, false)" class="btn btn-primary">
            <span v-if="items.page >= items.totalPages">Semua sudah dimuat</span>
            <span v-else>Muat lagi <i class="bi bi-arrow-down"></i></span>
          </button>
        </div>

        <div class="modal" id="update-unit-kerja" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header fw-bold">
                Ubah: {{ formUpdate?.ruangan }}
                <button @click="() => isSuccess = false" class="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div class="modal-body">
                <div v-if="isSuccess" class="alert alert-success alert-dismissible">
                  <button @click="() => isSuccess = false" type="button" class="btn-close" data-bs-dismiss="alert"></button>
                  Berhasil disimpan!
                </div>

                <form @submit.prevent="updateItem">
                  <div class="mb-4">
                    <label for="update_kode_lokasi" class="fw-bold mb-2">Kode Lokasi</label>
                    <input v-model="formUpdate.kode_lokasi" type="text" id="update_kode_lokasi" class="form-control form-control-lg" placeholder="nama ruangan" required />
                  </div>

                  <div class="mb-4">
                    <label for="update_ruangan" class="fw-bold mb-2">Ruangan</label>
                    <input v-model="formUpdate.ruangan" type="text" id="update_ruangan" class="form-control form-control-lg" placeholder="nama ruangan" autofocus required />
                  </div>

                  <div class="mb-4">
                    <label for="update_pemegang" class="fw-bold mb-2">Pemegang</label>
                    <input v-model="formUpdate.pemegang" type="text" id="update_pemegang" class="form-control form-control-lg" placeholder="nama lengkap pemegang" required />
                  </div>

                  <div class="mb-4">
                    <label for="update_nip_pemegang" class="fw-bold mb-2">NIP Pemegang</label>
                    <input v-model="formUpdate.nip_unit_kerja" type="text" id="update_nip_pemegang" class="form-control form-control-lg" placeholder="NIP pemegang (jika ada)" />
                  </div>

                  <div class="mb-4">
                    <label for="update_jabatan" class="fw-bold mb-2">Jabatan Unit Kerja</label>
                    <input v-model="formUpdate.jabatan_unit_kerja" type="text" id="update_jabatan" class="form-control form-control-lg" placeholder="contoh: Kabeng RPL" required />
                  </div>

                  <button class="btn btn-primary"><i class="bi bi-save"></i> Simpan</button>
                  <button @click="() => isSuccess = false" type="button" class="btn btn-outline-dark ms-2 float-end" data-bs-dismiss="modal">Tutup</button>
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
                Yakin hapus Unit Kerja: <strong>{{ formUpdate.ruangan }}</strong>?
              </div>

              <div class="modal-footer">
                <button @click="deleteItem" data-bs-dismiss="modal" class="btn btn-outline-danger"><i class="bi bi-save"></i> Ya, hapus</button>
                <button class="btn btn-dark" data-bs-dismiss="modal">Tidak</button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- <div v-else class="table-responsive"> -->
      <!---->
      <!--   <table class="table table-hover"> -->
      <!--     <thead> -->
      <!--       <tr> -->
      <!--         <th width="3%">#</th> -->
      <!--         <th>Ruangan</th> -->
      <!--         <th>Pemegang</th> -->
      <!--         <th>NIP. Pemegang</th> -->
      <!--         <th>Jabatan Unit Kerja</th> -->
      <!--       </tr> -->
      <!--     </thead> -->
      <!---->
      <!--     <tbody> -->
      <!--       <tr v-for="(item, i) in items.items" :key="item.id"> -->
      <!--         <td>{{ i+1 }}.</td> -->
      <!--         <td>{{ item.ruangan }}</td> -->
      <!--         <td>{{ item.pemegang }}</td> -->
      <!--         <td>{{ item.nip_unit_kerja }}</td> -->
      <!--         <td>{{ item.jabatan_unit_kerja }}</td> -->
      <!--       </tr> -->
      <!--     </tbody> -->
      <!--   </table> -->
      <!---->
      <!-- </div> -->

    </div>

  </div>
</template>


<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "Unit Kerja — Sarpras SMKN 4 Tasikmalaya.",
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
  "kode_lokasi": "",
  "ruangan": "",
  "pemegang": "",
  "jabatan_unit_kerja": "",
  "nip_unit_kerja": ""
})

const formUpdate = ref({
  "kode_lokasi": "",
  "ruangan": "",
  "pemegang": "",
  "jabatan_unit_kerja": "",
  "nip_unit_kerja": ""
})

if(role != 'sarpras') navigateTo('/')

async function getItems(loading=true) {
  isLoading.value = loading
  isActiveSearch.value = false

  let filter = ``
  if(keyword.value) {
    filter = `ruangan~"${keyword.value}" || pemegang~"${keyword.value}" || jabatan_unit_kerja~"${keyword.value}"`
    isActiveSearch.value = true
  }

  let res_items = await client.collection('unit_kerja').getList(1, perPage, {
    filter: filter,
    sort: `created, ruangan`
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
    filter = `ruangan~"${keyword.value}" || pemegang~"${keyword.value}" || jabatan_unit_kerja~"${keyword.value}"`
    isActiveSearch.value = true
  }

  let res_items = await client.collection('unit_kerja').getList(page, perPage, {
    filter: filter,
    sort: `created, ruangan`
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

  let res = await client.collection('unit_kerja').create(form.value)

  if(res) {
    isSuccess.value = true
    form.value.kode_lokasi = ''
    form.value.ruangan = ''
    form.value.pemegang = ''
    form.value.jabatan_unit_kerja = ''
    form.value.nip_unit_kerja = ''

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

  let res = await client.collection('unit_kerja').update(id_item.value, formUpdate.value)

  if(res) {
    isSuccess.value = true

    getItems(false)
  }
}

async function deleteItem() {
  await client.collection('unit_kerja').delete(id_item.value)

  getItems(false)
}

onMounted(() => {
  getItems()
})

</script>
