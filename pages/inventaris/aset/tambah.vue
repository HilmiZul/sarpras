<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5">{{ route.path.toUpperCase().replace('/', '') }}</span>
      <span v-if="role == 'sarpras'" class="float-end">
        <NuxtLink to="/inventaris/aset" class="btn btn-dark me-2">Kembali</NuxtLink>
      </span>
      <div class="fw-normal text-muted">Tambah baru</div>
    </div>

    <div class="card-body">
      <form @submit.prevent="buatBaru">
        <div class="row justify-content-center">
          <div class="col-md-4">

            <div class="mb-4">
              <label for="tahun_pengadaan" class="fw-bold">Tahun Pengadaan</label>
              <multiselect
                v-model="form.tahun_pengadaan"
                :options="list_tahun_pengadaan"
                :modelValue="integer"
                :clear-on-select="false"
                :custom-label="({tahun}) => `${tahun}`"
                track-by="tahun"
                label="tahun"
                id="tahun_pengadaan"
                placeholder="Pilih satu"
                required>
                <template v-slot:singleLabel="{ option }">{{ option.tahun }}</template>
              </multiselect>
            </div>

            <div class="mb-4">
              <label for="triwulan" class="fw-bold">Triwulan</label>
              <multiselect
                v-model="form.triwulan"
                :options="['tw-1', 'tw-2', 'tw-3', 'tw-4']"
                :modelValue="String"
                :clear-on-select="false"
                id="triwulan"
                placeholder="Pilih satu"
                required>
                <template v-slot:singleLabel="{ option }">{{ option.toUpperCase() }}</template>
              </multiselect>
            </div>

            <div class="mb-4">
              <label for="no_sp2d" class="fw-bold">No. SP2D</label>
              <input v-model="form.no_sp2d"class="form-control form-control-lg" id="no_sp2d" type="text" placeholder="___" required />
            </div>

            <div class="mb-4">
              <label for="sumber_aset" class="fw-bold">Sumber Perolehan</label>
              <multiselect
                v-model="form.sumber_aset"
                :options="list_sumber_aset"
                :modelValue="String"
                :clear-on-select="false"
                :custom-label="({nama_sumber}) => `${nama_sumber}`"
                track-by="nama_sumber"
                label="nama_sumber"
                id="sumber_aset"
                placeholder="Pilih satu"
                required>
                <template v-slot:singleLabel="{ option }">{{ option.nama_sumber }}</template>
              </multiselect>
            </div>

            <div class="mb-4">
              <label for="kodering_belanja" class="fw-bold">Kodering Belanja</label>
              <input v-model="form.kodering_belanja" class="form-control form-control-lg" id="kodering_belanja" type="text" placeholder="1.2.345.678..." required />
            </div>

            <div class="mb-4">
              <label for="no_spk" class="fw-bold">No.SPK/Faktur/Kuitansi</label>
              <input v-model="form.no_spk" class="form-control form-control-lg" id="no_spk" type="text" placeholder="___/____/___/___" required />
            </div>

            <div class="mb-4">
              <label for="no_ba_spj" class="fw-bold">No.BA Penerimaan SPJ</label>
              <input v-model="form.no_ba_spj" class="form-control form-control-lg" id="no_ba_spj" type="text" placeholder="___/____/___/___" required />
            </div>

            <div class="mb-4">
              <label for="tgl_ba_spj" class="fw-bold">Tanggal BA Penerimaan SPJ</label>
              <input v-model="form.tgl_ba_spj" class="form-control form-control-lg" id="tgl_ba_spj" type="date" required />
            </div>

            <div class="mb-4">
              <label for="nama_aset_barang" class="fw-bold">Nama/Judul Barang (seacra umum) <span class="text-muted">opsional</span></label>
              <input v-model="form.nama_aset_barang" class="form-control form-control-lg" id="nama_aset_barang" type="text" placeholder="contoh: MacBook Air / boleh kosong" />
            </div>

            <div class="mb-4">
              <label for="spesifikasi" class="fw-bold">Spesifikasi Barang (secara umum) <span class="text-muted">opsional</span></label>
              <textarea v-model="form.spesifikasi" class="form-control form-control-lg" id="spesifikasi" type="text" placeholder="Spesifikasi lengkap jika ada..."></textarea>
            </div>

            <div class="form-check form-switch mb-4">
              <input v-model="form.lengkap" class="form-check-input" type="checkbox" id="lengkap" checked="true">
              <label class="form-check-label fw-bold" for="lengkap">Lengkap?</label>
            </div>
          </div>

          <div class="col-md-4">
            <div class="mb-4">
              <label for="nama_barang" class="fw-bold">Kode Barang (rincian barang)</label>
              <multiselect
                v-model="form.rincian_aset"
                :options="list_rincian_aset"
                :modelValue="String"
                :clear-on-select="false"
                :custom-label="({kode_barang, nama_barang}) => `${kode_barang} / ${nama_barang}`"
                track-by="nama_barang"
                label="nama_barang"
                id="nama_barang"
                placeholder="Pilih satu"
                required>
                <template v-slot:singleLabel="{ option }">{{ option.kode_barang }}</template>
              </multiselect>
            </div>

            <div class="mb-4">
              <label for="merek_tipe" class="fw-bold">Merek/Tipe</label>
              <input v-model="form.merek_tipe" class="form-control form-control-lg" id="merek_tipe" type="text" placeholder="ketik merek/tipe" required />
            </div>

            <div class="mb-4">
              <label for="nama_satuan" class="fw-bold">Satuan</label>
              <!-- <select v-model="form.satuan_aset" class="form-select" name="satuan_aset" id="satuan_aset" required> -->
              <!--   <option value="">Pilih Satuan</option> -->
              <!--   <option v-for="satuan in list_satuan_aset" :key="satuan.id" :value="`${satuan.id}`">{{ satuan.nama_satuan }}</option> -->
              <!-- </select> -->
              <multiselect
                v-model="form.satuan_aset"
                :options="list_satuan_aset"
                :modelValue="String"
                :clear-on-select="false"
                :custom-label="({nama_satuan}) => `${nama_satuan}`"
                track-by="nama_satuan"
                label="nama_satuan"
                id="nama_satuan"
                placeholder="Pilih satu"
                required>
                <template v-slot:singleLabel="{ option }">{{ option.nama_satuan }}</template>
              </multiselect>
            </div>

            <div class="mb-4">
              <label for="volume" class="fw-bold">Volume</label>
              <input v-model="form.volume"class="form-control form-control-lg" id="volume" type="number" min="1" required />
            </div>

            <div class="mb-4">
              <label for="harga_satuan" class="fw-bold">Harga Satuan (Rp)</label>
              <input v-model="form.harga_satuan" class="form-control form-control-lg" id="harga_satuan" type="number" min="1" required />
            </div>

            <div class="mb-4">
              <label for="ruangan" class="fw-bold">Unit Kerja</label>
              <multiselect
                v-model="form.unit_kerja"
                :options="list_unit_kerja"
                :modelValue="String"
                :clear-on-select="false"
                :custom-label="({ruangan}) => `${ruangan}`"
                track-by="ruangan"
                label="ruangan"
                id="ruangan"
                placeholder="Pilih satu"
                required>
                <template v-slot:singleLabel="{ option }">{{ option.ruangan }}</template>
              </multiselect>
            </div>

            <div class="mb-4">
              <label for="keterangan" class="fw-bold">Keterangan (opsional)</label>
              <textarea v-model="form.keterangan" class="form-control form-control-lg" id="keterangan" type="text" placeholder="Tulis keterngan apabila ada..."></textarea>
            </div>

            <div class="mb-4">
              <label for="foto_barang" class="fw-bold">Foto Barang (opsional)</label>
              <input @change="compressFile" class="form-control form-control-lg" id="foto_barang" type="file" accept="image/png, image/jpeg, image/jpg" />
            </div>

            <div class="mb-4">
              <label for="kondisi" class="fw-bold">Kondisi</label>
              <multiselect
                v-model="form.kondisi"
                :options="['B', 'RR', 'RB', 'Mutasi ke OPD Lain', 'Pencatatan Ganda', 'Hilang']"
                :modelValue="String"
                :clear-on-select="false"
                id="kondisi"
                placeholder="Pilih satu"
                required>
                <template v-slot:singleLabel="{ option }">{{ option }}</template>
              </multiselect>
            </div>

          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-md-8">
            <button :disabled="isSending" class="btn btn-primary">
              <span v-if="isSending">Sedang menyimpan</span>
              <span v-else>Simpan</span>
            </button>
            <NuxtLink to="/inventaris/aset" class="btn btn-outline-dark ms-2">Kembali</NuxtLink>
          </div>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup>
import { navigateTo } from 'nuxt/app'

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "Tambah Barang — SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})
const user = usePbUser()
const client = usePbClient()
const role = user?.user.value.role
const route = useRoute()

const list_tahun_pengadaan = ref([])
const list_sumber_aset = ref([])
const list_rincian_aset = ref([])
const list_satuan_aset = ref([])
const list_unit_kerja = ref([])
const list_pejabat_penandatangan = ref()

const isSending = ref(false)
const isSuccess = ref(false)

const form = ref({
  "tahun_pengadaan": "",
  "triwulan": "",
  "no_sp2d": "",
  "sumber_aset": "",
  "kodering_belanja": "",
  "no_spk": "",
  "no_ba_spj": "",
  "tgl_ba_spj": "",
  "nama_aset_barang": "",
  "spesifikasi": "",
  "merek_tipe": "",
  "rincian_aset": "",
  "satuan_aset": "",
  "volume": '',
  "harga_satuan": '',
  "nilai_perolehan": '',
  "unit_kerja": "",
  "lokasi_unit_kerja": "",
  "lengkap": true,
  "keterangan": "",
  "foto_barang": "",
  "kondisi": "B",
  "pejabat_penandatangan": ""
})

if(role != 'sarpras') navigateTo('/barang')

async function buatBaru() {
  form.value.nilai_perolehan = form.value.volume * form.value.harga_satuan
  form.value.tahun_pengadaan = form.value.tahun_pengadaan.id
  form.value.sumber_aset = form.value.sumber_aset.id
  form.value.rincian_aset = form.value.rincian_aset.id
  form.value.satuan_aset = form.value.satuan_aset.id
  form.value.unit_kerja = form.value.unit_kerja.id
  form.value.pejabat_penandatangan = list_pejabat_penandatangan

  let dateConvert = new Date(form.value.tgl_ba_spj)
  form.value.tgl_ba_spj = dateConvert.toISOString().split('T')[0]

  isSending.value = true
  isSuccess.value = false

  let res = await client.collection('aset').create(form.value)

  if(res) {
    isSending.value = false
    isSuccess.value = true
    navigateTo("/inventaris/aset")
  }
}

async function fetchByCollection(collection) {
  let sort = ``
  let filter = ``

  // sort record
  if(collection == 'tahun_pengadaan') sort = `-tahun`
  if(collection == 'unit_kerja') sort = `ruangan`

  if(collection == 'pejabat_penandatangan') filter = `id="uvsu9ltaotfcfte"`

  let res = await client.collection(collection).getFullList({
    sort: sort
  })
  
  if(res) {
    if(collection == "tahun_pengadaan") {
      list_tahun_pengadaan.value = res
    }

    if(collection == "sumber_aset") {
      list_sumber_aset.value = res
    }

    if(collection == "rincian_aset") {
      list_rincian_aset.value = res
    }

    if(collection == "satuan_aset") {
      list_satuan_aset.value = res
    }

    if(collection == "unit_kerja") {
      list_unit_kerja.value = res
    }

    if(collection == "pejabat_penandatangan") {
      list_pejabat_penandatangan.value = res[0].id
    }
  }
}


function compressFile(e) {
  let file = e.target.files[0]
  form.value.foto_barang = file
}


onMounted(() => {
  fetchByCollection("tahun_pengadaan")
  fetchByCollection("sumber_aset")
  fetchByCollection("rincian_aset")
  fetchByCollection("satuan_aset")
  fetchByCollection("unit_kerja")
  fetchByCollection("pejabat_penandatangan")
})
</script>


<style scoped>
table.table {
  height: 100%;
}
</style>
