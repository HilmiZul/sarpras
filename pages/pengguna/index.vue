<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5 text-muted">{{ route.path.toUpperCase().replace('/', ' ') }}</span>
      <span class="float-end">
        <button @click="() => isSuccess = false" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#tambah"><i class="bi bi-plus"></i> Tambah</button>
      </span>
      <div class="fw-normal text-muted">Kelola Pengguna</div>

      <div class="modal" id="tambah" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header fw-bold">
              Tambah Pengguna
              <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <div v-if="isSuccess" class="alert alert-success alert-dismissible">
                <button @click="isSuccess = false" type="button" class="btn-close" data-bs-dismiss="alert"></button>
                Berhasil ditambahkan!
              </div>

              <form @submit.prevent="addNewItem">
                <div class="mb-4">
                  <label for="username" class="mb-2">Username</label>
                  <input v-model="form.username" type="text" id="username" class="form-control form-control-lg" placeholder="masukkan nama pengguna" required />
                </div>

                <div class="mb-4">
                  <label for="password" class="mb-2">Password</label>
                  <input v-model="form.password" type="password" id="password" class="form-control form-control-lg" placeholder="katasandi min.8 karakter" required />
                </div>

                <div class="mb-4">
                  <label for="passwordConfirm" class="mb-2">Konfirmasi Password</label>
                  <input v-model="form.passwordConfirm" type="password" id="passwordConfirm" class="form-control form-control-lg" placeholder="ketik ulang katasandi" required />
                </div>

                <div class="mb-4">
                  <label for="role" class="mb-2">Role</label>
                  <select v-model="form.role" class="form-select form-select-lg" name="role" id="role" required>
                    <option value="">Pilih Role</option>
                    <option value="unit">Unit</option>
                    <option value="sarpras">Sarpras</option>
                    <option value="pimpinan">Pimpinan</option>
                  </select>
                </div>

                <div v-if="form.role == 'unit'" class="mb-4">
                  <label for="unit_kerja" class="mb-2">Unit Kerja</label>
                  <select v-model="form.unit_kerja" class="form-select form-select-lg" name="unit_kerja" id="unit_kerja" required>
                    <option value="">Pilih Unit Kerja</option>
                    <option v-for="item in list_unit_kerja" :key="item.id" :value="item.id">{{ item.ruangan }}</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label for="nama" class="mb-2">Nama Lengkap</label>
                  <input v-model="form.nama" type="text" id="nama" class="form-control form-control-lg" placeholder="masukkan nama lengkap" required />
                </div>

                <div class="mb-4">
                  <label for="email" class="mb-2">Email</label>
                  <input v-model="form.email" type="email" id="email" class="form-control form-control-lg" placeholder="masukkan email (.sch.id)" required />
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
            <input v-model="keyword" type="search" class="form-control form-control" placeholder="cari username">
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

      <!-- display list item disini -->
      <div v-else>
        <ul v-for="item in items.items" :key="item.id" class="list-group list-group-flush">
          <li @click="setModalItem(item)" data-bs-toggle="modal" data-bs-target="#update" class="list-group-item d-flex justify-content-between align-items-start hand">
            <div v-if="item.avatar" class="mb-3 thumb-avatar-container">
              <img @click="setModalPreview(item)" :src="`${host}/api/files/_pb_users_auth_/${item.id}/${item.avatar}`" :alt="user?.user.nama" class="thumb-avatar" data-bs-toggle="modal" data-bs-target="#preview-avatar" />
            </div>

            <div class="ms-2 me-auto">
              <div v-if="item?.expand.unit_kerja" class="text-muted">Unit Kerja</div>
              <div class="fs-5 fw-bold text-muted mb-2">{{ item.username }}</div>

              <div v-if="item?.expand.unit_kerja" class="text-muted">Unit Kerja</div>
              <div v-if="item?.expand?.unit_kerja" class="fs-5 fw-bold text-muted mb-2">{{ item?.expand?.unit_kerja.ruangan }}</div>
            </div>

            <!-- <button data-bs-toggle="modal" data-bs-target="#hapus-item" class="btn btn-danger float-end"><i class="bi bi-trash"></i> Hapus</button> -->
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
      </div>

      <div class="modal" id="update" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header fw-bold">
              Ubah: {{ formUpdate?.username }}
              <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <div v-if="isSuccess" class="alert alert-success alert-dismissible">
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                Berhasil disimpan!
              </div>

              <form @submit.prevent="updateItem">
                <div class="mb-4">
                  <label for="update_username" class="fw-bold mb-2">Username</label>
                  <input v-model="formUpdate.username" type="text" id="update_username" class="form-control form-control-lg" placeholder="masukkan nama pengguna" required />
                </div>

                <div class="mb-4">
                  <label for="update_unit_kerja" class="fw-bold mb-2">Unit Kerja</label>
                  <select v-model="formUpdate.unit_kerja" class="form-select form-select-lg" name="update_unit_kerja" id="update_unit_kerja" required>
                    <option value="">Pilih Unit Kerja</option>
                    <option v-for="item in list_unit_kerja" :key="item.id" :value="item.id">{{ item.ruangan }}</option>
                  </select>
                </div>

                <button class="btn btn-primary"><i class="bi bi-save"></i> Simpan</button>
                <button type="button" class="btn btn-outline-dark ms-2 float-end" data-bs-dismiss="modal">Tutup</button>
              </form>

            </div>
          </div>
        </div>
      </div>

      <!-- preview avatar -->
      <div class="modal" id="preview-avatar" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <img v-if="avatarPreview?.avatar" :src="`${host}/api/files/_pb_users_auth_/${avatarPreview?.id}/${avatarPreview?.avatar}`" :alt="user?.user.nama" class="thumb-preview-avatar"/>
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
              Yakin hapus user <strong>{{ formUpdate.username }}</strong>?
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
</template>


<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "Pengguna — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

let config = useRuntimeConfig()
let host = config.public.apiBaseUrl + ":" + config.public.apiPort
const route = useRoute()
const client = usePbClient()
const user = usePbUser()
const role = user?.user.value.role
const isLoading = ref(true)
const isActiveSearch = ref(false)
const isSuccess = ref(false)
const isMovingPage = ref(false)
const keyword = ref('')
const items = ref([])
const perPage = 10
const id_item = ref()
const list_unit_kerja = ref([])
const avatarPreview = ref()

if(role != 'sarpras') navigateTo('/')


const form = ref({
  "email": "",
  "emailVisibility": true,
  "avatar": "",
  "username": "",
  "nama": "",
  "role": "",
  "unit_kerja": "",
  "password": "",
  "passwordConfirm": ""
})

const formUpdate = ref({
  "username": "",
  "unit_kerja": "",
})

const getItems = async () => {
  isLoading.value = true

  let filter = `role!="sarpras"`
  if(keyword.value) {
    filter += ` && username~"${keyword.value}"`
    isActiveSearch.value = true
  }

  let res = await client.collection('users').getList(1, perPage, {
    filter: filter,
    expand: `unit_kerja`,
    sort: `role, unit_kerja`
  })

  if(res) {
    items.value = res
    isLoading.value = false
  }
}

const loadMore = async (page, loading=true) => {
  isLoading.value = loading
  isMovingPage.value = true
  isActiveSearch.value = false

  let filter = `role!="sarpras"`
  if(keyword.value) {
    filter += ` && username~"${keyword.value}" || nama~"${keyword.value}"`
    isActiveSearch.value = true
  }

  let res_items = await client.collection('users').getList(page, perPage, {
    filter: filter,
    expand: `unit_kerja`,
    sort: `role, unit_kerja`
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

async function addNewItem() {
  isSuccess.value = false

  let res = await client.collection('users').create(form.value)

  if(res) {
    isSuccess.value = true
    form.value.username = ''
    form.value.password = ''
    form.value.passwordConfirm = ''
    form.value.role = ''
    form.value.unit_kerja = ''
    form.value.nama = ''
    form.value.email = ''

    getItems(false)
  }
}

function setModalItem(item) {
  isSuccess.value = false
  id_item.value = item.id
  formUpdate.value.username = item.username
  formUpdate.value.unit_kerja = item.unit_kerja
}

function setModalPreview(avatar) {
  avatarPreview.value = avatar
}

async function updateItem() {
  isSuccess.value = false

  let res = await client.collection('users').update(id_item.value, formUpdate.value)

  if(res) {
    formUpdate.value.username = res.username
    formUpdate.value.unit_kerja = res.unit_kerja

    isSuccess.value = true

    getItems(false)
  }
}

async function getUnitKerja() {
  let res = await client.collection('unit_kerja').getFullList({})

  if(res) {
    list_unit_kerja.value = res
  }
}

function resetItem() {
  keyword.value = ''
  getItems()
}

function deleteItem() {
  console.log("hello! haha")
}


onMounted(() => {
  getItems()
  getUnitKerja()
})

</script>
