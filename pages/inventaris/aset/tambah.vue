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
              <select v-model="form.tahun_pengadaan" class="form-select" name="tahun_pengadaan" id="tahun_pengadaan" required>
                <option value="">Pilih Tahun</option>
                <option v-for="tahun in list_tahun_pengadaan" :key="tahun.id" :value="`${tahun.id}`">{{ tahun.tahun }}</option>
              </select>
            </div>

            <div class="mb-4">
              <label for="triwulan" class="fw-bold">Triwulan</label>
              <select v-model="form.triwulan" class="form-select" name="triwulan" id="triwulan" required>
                <option value="">Pilih TW</option>
                <option value="tw-1">TW-1</option>
                <option value="tw-2">TW-2</option>
                <option value="tw-3">TW-3</option>
                <option value="tw-4">TW-4</option>
              </select>
            </div>

            <div class="mb-4">
              <label for="no_sp2d" class="fw-bold">No. SP2D</label>
              <input v-model="form.no_sp2d"class="form-control" id="no_sp2d" type="text" placeholder="___" required />
            </div>

            <div class="mb-4">
              <label for="sumber_aset" class="fw-bold">Sumber Perolehan</label>
              <select v-model="form.sumber_aset"class="form-select" name="sumber_aset" id="sumber_aset">
                <option value="">Pilih Sumber Dana</option>
                <option v-for="sumber in list_sumber_aset" :key="sumber.id" :value="`${sumber.id}`">{{ sumber.nama_sumber }}</option>
              </select>
            </div>

            <div class="mb-4">
              <label for="kodering_belanja" class="fw-bold">Kodering Belanja</label>
              <input v-model="form.kodering_belanja" class="form-control" id="kodering_belanja" type="text" placeholder="1.2.345.678..." required />
            </div>

            <div class="mb-4">
              <label for="no_spk" class="fw-bold">No.SPK/Faktur/Kuitansi</label>
              <input v-model="form.no_spk" class="form-control" id="no_spk" type="text" placeholder="___/____/___/___" required />
            </div>

            <div class="mb-4">
              <label for="no_ba_spj" class="fw-bold">No.BA Penerimaan SPJ</label>
              <input v-model="form.no_ba_spj" class="form-control" id="no_ba_spj" type="text" placeholder="___/____/___/___" required />
            </div>

            <div class="mb-4">
              <label for="tgl_ba_spj" class="fw-bold">Tanggal BA Penerimaan SPJ</label>
              <input v-model="form.tgl_ba_spj" class="form-control" id="tgl_ba_spj" type="date" required />
            </div>

            <div class="mb-4">
              <label for="nama_aset_barang" class="fw-bold">Nama/Judul Barang (seacra umum) <span class="text-muted">opsional</span></label>
              <input v-model="form.nama_aset_barang" class="form-control" id="nama_aset_barang" type="text" placeholder="contoh: MacBook Air / boleh kosong" />
            </div>

            <div class="mb-4">
              <label for="spesifikasi" class="fw-bold">Spesifikasi Barang (secara umum) <span class="text-muted">opsional</span></label>
              <textarea v-model="form.spesifikasi" class="form-control" id="spesifikasi" type="text" placeholder="Spesifikasi lengkap jika ada..."></textarea>
            </div>

            <div class="form-check form-switch mb-4">
              <input class="form-check-input form-check-lg" type="checkbox" id="lengkap" checked="true">
              <label class="form-check-label fw-bold" for="lengkap">Lengkap?</label>
            </div>
          </div>

          <div class="col-md-4">
            <div class="mb-4">
              <label for="rincian_aset" class="fw-bold">Kode Barang (rincian barang)</label>
              <select v-model="form.rincian_aset" class="form-select" name="rincian_aset" id="rincian_aset" required>
                <option value="">Pilih Kode/Nama Barang</option>
                <option v-for="rincian_aset in list_rincian_aset" :key="rincian_aset.id" :value="`${rincian_aset.id}`">
                  {{ rincian_aset.kode_barang }} / 
                  {{ rincian_aset.nama_barang }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label for="merek_tipe" class="fw-bold">Merek/Tipe</label>
              <input v-model="form.merek_tipe" class="form-control" id="merek_tipe" type="text" placeholder="ketik merek/tipe" required />
            </div>

            <div class="mb-4">
              <label for="satuan_aset" class="fw-bold">Satuan</label>
              <select v-model="form.satuan_aset" class="form-select" name="satuan_aset" id="satuan_aset" required>
                <option value="">Pilih Satuan</option>
                <option v-for="satuan in list_satuan_aset" :key="satuan.id" :value="`${satuan.id}`">{{ satuan.nama_satuan }}</option>
              </select>
            </div>

            <div class="mb-4">
              <label for="volume" class="fw-bold">Volume</label>
              <input v-model="form.volume"class="form-control" id="volume" type="number" min="1" required />
            </div>

            <div class="mb-4">
              <label for="harga_satuan" class="fw-bold">Harga Satuan (Rp)</label>
              <input v-model="form.harga_satuan" class="form-control" id="harga_satuan" type="number" min="1" required />
            </div>

            <!-- <div class="mb-4"> -->
            <!--   <label class="fw-bold">Nilai Perolehan (Rp)</label> -->
            <!--   <input class="form-control" type="number" min="1" required readonly disabled /> -->
            <!-- </div> -->

            <!-- <div class="mb-4"> -->
            <!--   <label for="kodering_aset" class="fw-bold">Kodering Aset</label> -->
            <!--   <input v-model="form.kodering_aset" class="form-control" id="kodering_aset" type="text" placeholder="1.2.3..." required /> -->
            <!-- </div> -->
            <!---->
            <!-- <div class="mb-4"> -->
            <!--   <label for="nama_rekening_aset" class="fw-bold">Nama Rekening Aset</label> -->
            <!--   <input v-model="form.nama_rekening_aset" class="form-control" id="nama_rekening_aset" type="text" placeholder="contoh: Umum" required /> -->
            <!-- </div> -->

            <div class="mb-4">
              <label for="unit_kerja" class="fw-bold">Unit Kerja</label>
              <select v-model="form.unit_kerja" class="form-select" name="unit_kerja" id="unit_kerja" required>
                <option value="">Pilih Unit Kerja (Ruangan)</option>
                <option v-for="unit in list_unit_kerja" :key="unit.id" :value="`${unit.id}`">{{ unit.ruangan }}</option>
              </select>
            </div>

            <div class="mb-4">
              <label for="keterangan" class="fw-bold">Keterangan (opsional)</label>
              <textarea v-model="form.keterangan" class="form-control" id="keterangan" type="text" placeholder="Tulis keterngan apabila ada..."></textarea>
            </div>

            <div class="mb-4">
              <label for="foto_barang" class="fw-bold">Foto Barang (opsional)</label>
              <input @change="compressFile" class="form-control" id="foto_barang" type="file" accept="image/png, image/jpeg, image/jpg" />
            </div>

            <div class="mb-4">
              <label for="kondisi" class="fw-bold">Kondisi</label>
              <select v-model="form.kondisi" class="form-select" name="kondisi" id="kondisi" required>
                <option value="B">Baik</option>
                <option value="RR">Rusak Ringan</option>
                <option value="RB">Rusak Berat</option>
                <option value="Mutasi ke OPD Lain">Mutasi ke OPD Lain</option>
                <option value="Pencatatan Ganda">Pencatatan Ganda</option>
                <option value="Hilang">Hilang</option>
              </select>
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
const pejabat_penandatangan = ref()

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

  // sort record
  if(collection == 'tahun_pengadaan') sort = `-tahun`
  if(collection == 'unit_kerja') sort = `ruangan`

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
})
</script>


<style scoped>
table.table {
  height: 100%;
}
</style>
