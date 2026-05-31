<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5 text-muted">{{ route.path.toUpperCase().replace('/', ' ').replace('-', ' ') }}</span>
      <div class="fw-normal text-muted">Pengaturan umum aplikasi</div>
    </div>

    <div class="card-body">
      <div v-if="isSuccess" class="row">
        <div class="col-md-4">
          <div class="alert alert-success alert-dismissible">
            Berhasil disimpan!
            <button class="btn-close" data-bs-dismiss="alert"></button>
          </div>
        </div>
      </div>

      <form @submit.prevent="updatePengaturan" >

        <div class="row">

          <div class="col-md-4">
            <div class="mb-4">
              <label for="nama_sekolah" class="fw-bold mb-2">Nama Sekolah</label>
              <input :disabled="isLoading || isSaving" v-model="form.nama_sekolah" type="text" id="nama_sekolah" placeholder="Nama sekolah" class="form-control form-control-lg" required />
            </div>

            <div class="mb-4">
              <label for="alamat_sekolah" class="fw-bold mb-2">Alamat Sekolah</label>
              <textarea :disabled="isLoading || isSaving" v-model="form.alamat_sekolah" class="form-control form-control-lg" id="alamat_sekolah" placeholder="alamat lengkap sekolah" required></textarea>
            </div>

            <div class="mb-4">
              <label for="kota_sekolah" class="fw-bold mb-2">Kota</label>
              <input :disabled="isLoading || isSaving" v-model="form.kota_sekolah" type="text" id="kota_sekolah" placeholder="kota" class="form-control form-control-lg" required />
            </div>

            <div class="mb-4">
              <label for="kodepos_sekolah" class="fw-bold mb-2">Kode POS</label>
              <input :disabled="isLoading || isSaving" v-model="form.kodepos_sekolah" min="46100" type="number" id="kodepos_sekolah" placeholder="kode pos" class="form-control form-control-lg" required />
            </div>

            <div class="mb-4">
              <label for="nomor_sekolah" class="fw-bold mb-2">Nomor Telepon</label>
              <input :disabled="isLoading || isSaving" v-model="form.nomor_sekolah" min="1" type="number" id="nomor_sekolah" placeholder="nomor telepon sekolah" class="form-control form-control-lg" required />
            </div>

            <hr>

            <div class="mb-4">
              <label for="website_sekolah" class="fw-bold mb-2">Website Sekolah (www.)</label>
              <input :disabled="isLoading || isSaving" v-model="form.website_sekolah" type="text" id="website_sekolah" placeholder="Website sekolah" class="form-control form-control-lg" required />
            </div>

            <div class="mb-4">
              <label for="email_sekolah" class="fw-bold mb-2">Email Sekolah (.sch.id)</label>
              <input :disabled="isLoading || isSaving" v-model="form.email_sekolah" type="email" id="email_sekolah" placeholder="Email sekolah" class="form-control form-control-lg" required />
            </div>

            <hr>

            <div class="mb-4">
              <label for="logo_sekolah" class="fw-bold mb-2">Logo Sekolah</label>
              <div v-if="temp_logo_sekolah" class="mb-2">
                <img :src="`${host}/api/files/${form.collectionId}/${form.id}/${temp_logo_sekolah}`" :alt="form.nama_sekolah" class="pengaturan-logo" />
              </div>
              <input :disabled="isLoading || isSaving" @change="compressFileLogoSekolah" type="file" id="logo_sekolah" class="form-control form-control-lg" equired />
            </div>

            <div class="mb-4">
              <label for="logo_provinsi" class="fw-bold mb-2">Logo Provinsi</label>
              <div v-if="temp_logo_provinsi" class="mb-2">
                <img :src="`${host}/api/files/${form.collectionId}/${form.id}/${temp_logo_provinsi}`" :alt="form.nama_sekolah" class="pengaturan-logo" />
              </div>
              <input :disabled="isLoading || isSaving" @change="compressFileLogoProvinsi" type="file" id="logo_provinsi" class="form-control form-control-lg" equired />
            </div>

            <button :disabled="isLoading || isSaving" class="btn btn-primary">
              <span v-if="isSaving">Sedang menyimpan</span>
              <span v-else><i class="bi bi-save"></i> Simpan</span>
            </button>
          </div>
        </div>

      </form>
    </div>

  </div>
</template>


<script setup>
import { useRuntimeConfig } from 'nuxt/app'
import Compressor from 'compressorjs'

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "Pengaturan — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const config = useRuntimeConfig()
let host = config.public.apiBaseUrl + ":" + config.public.apiPort

const route = useRoute()
const client = usePbClient()
const user = usePbUser()
const role = user?.user.value.role
const isLoading = ref(true)
const isSaving = ref(false)
const isSuccess = ref(false)

const temp_logo_sekolah = ref()
const temp_logo_provinsi = ref()

const form = ref({
  "nama_sekolah": "",
  "alamat_sekolah": "",
  "kota_sekolah": "",
  "website_sekolah": "",
  "email_sekolah": "",
  "kodepos_sekolah": "",
  "logo_sekolah": "",
  "logo_provinsi": "",
  "nomor_sekolah": ""
})

if(role != 'sarpras') navigateTo('/')


async function updatePengaturan() {
  isLoading.value = true
  isSuccess.value = false
  isSaving.value = true
  let id = form.value.id

  let res = await client.collection('pengaturan').update(id, {
    "nama_sekolah": form.value.nama_sekolah,
    "alamat_sekolah": form.value.alamat_sekolah,
    "kota_sekolah": form.value.kota_sekolah,
    "website_sekolah": form.value.website_sekolah,
    "email_sekolah": form.value.email_sekolah,
    "kodepos_sekolah": form.value.kodepos_sekolah,
    "logo_sekolah": form.value.logo_sekolah,
    "logo_provinsi": form.value.logo_provinsi,
    "nomor_sekolah": form.value.nomor_sekolah,
  })
  
  if(res) {
    form.value = res

    temp_logo_sekolah.value = res.logo_sekolah
    temp_logo_provinsi.value = res.logo_provinsi

    isSaving.value = false
    isSuccess.value = true
    isLoading.value = false
  }

}

async function getPengaturn() {
  isLoading.value = true

  let res = await client.collection('pengaturan').getOne(`ecarpvlbtxskkb1`, {})

  if(res) {
    form.value = res

    temp_logo_sekolah.value = res.logo_sekolah
    temp_logo_provinsi.value = res.logo_provinsi

    isLoading.value = false
  }
}

function compressFileLogoSekolah(e) {
  let file = e.target.files[0]
  if (!file) return;
  new Compressor(file, {
    convertTypes: ['image/webp'],
    mimeType: 'auto',
    quality: 0.4,
    success(result) {
      form.value.logo_sekolah = result
    },
    error(err) {
      console.error(err.message)
    }
  })
}

function compressFileLogoProvinsi(e) {
  let file = e.target.files[0]
  if (!file) return;
  new Compressor(file, {
    convertTypes: ['image/webp'],
    mimeType: 'auto',
    quality: 0.4,
    success(result) {
      form.value.logo_provinsi = result
    },
    error(err) {
      console.error(err.message)
    }
  })
}

onMounted(() => {
  getPengaturn()
})
</script>
