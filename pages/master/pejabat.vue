<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5 text-muted">{{ route.path.toUpperCase().replace('/', ' ').replace('-', ' ') }}</span>
      <div class="fw-normal text-muted">Penanggung Jawab & Pengurus Barang</div>
    </div>

    <div class="card-body">
      <form @submit.prevent="updatePengaturanJabatan" >

        <div class="row">
          <div class="col-md-4">
            <div class="fs-5 fw-bold">Kepala Sekolah</div>
            <div class="mb-4">
              <label for="kepala_sekolah" class="fw-bold mb-2">Nama Kepala Sekolah</label>
              <input :disabled="isLoading || isSaving" v-model="form.kepala_sekolah" type="text" id="kepala_sekolah" placeholder="Nama lengkap kepala sekolah dengan gelar" class="form-control form-control-lg" required />
            </div>

            <div class="mb-4">
              <label for="nip_kepala_sekolah" class="fw-bold mb-2">NIP. Kepala Sekolah</label>
              <input :disabled="isLoading || isSaving" v-model="form.nip_kepala_sekolah" type="text" id="nip_kepala_sekolah" placeholder="NIP. Keala sekolah" class="form-control form-control-lg" required />
            </div>

            <hr>

            <div class="fs-5 fw-bold mt-4">Wakasek Sarpras</div>
            <div class="mb-4">
              <label for="wakasek_sarpras" class="fw-bold mb-2">Nama Wakasek Sarpras</label>
              <input :disabled="isLoading || isSaving" v-model="form.wakasek_sarpras" type="text" id="wakasek_sarpras" placeholder="Nama lengkap wakasek sarpras dengan gelar" class="form-control form-control-lg" required />
            </div>

            <div class="mb-4">
              <label for="nip_wakasek_sarpras" class="fw-bold mb-2">NIP. Wakasek Sarpras</label>
              <input :disabled="isLoading || isSaving" v-model="form.nip_wakasek_sarpras" type="text" id="nip_wakasek_sarpras" placeholder="NIP wakasek sarpras" class="form-control form-control-lg" required />
            </div>

            <hr>

            <div class="fs-5 fw-bold mt-4">Pengurus Barang</div>
            <div class="mb-4">
              <label for="pengurus_barang" class="fw-bold mb-2">Nama Pengurus Barang</label>
              <input :disabled="isLoading || isSaving" v-model="form.pengurus_barang" type="text" id="pengurus_barang" placeholder="Nama lengkap pengurus barang dengan gelar" class="form-control form-control-lg" equired />
            </div>

            <div class="mb-4">
              <label for="nip_pengurus_barang" class="fw-bold mb-2">NIP. Pengurus Barang</label>
              <input :disabled="isLoading || isSaving" v-model="form.nip_pengurus_barang" type="text" id="nip_pengurus_barang" placeholder="NIP. pengurus barang" class="form-control form-control-lg" required />
            </div>

            <div class="mb-4">
              <label for="pangkat_pengurus_barang" class="fw-bold mb-2">Pangkat Pengurus Barang</label>
              <select :disabled="isLoading || isSaving" v-model="form.pangkat_pengurus_barang" class="form-select" name="pangkat_pengurus_barang" id="pangkat_pengurus_barang" required>
                <option value="">Pilih Golong</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
                <option value="IX">IX</option>
              </select>
            </div>

            <div class="mb-4">
              <label for="golongan_pengurus_barang" class="fw-bold mb-2">Golongan Pengurus Barang</label>
              <select :disabled="isLoading || isSaving" v-model="form.golongan_pengurus_barang" class="form-select" name="golongan_pengurus_barang" id="golongan_pengurus_barang" required>
                <option value="">Pilih Golong</option>
                <option value="a">a</option>
                <option value="b">b</option>
                <option value="c">c</option>
                <option value="d">d</option>
                <option value="e">e</option>
                <option value="IX">IX</option>
              </select>
            </div>

            <button :disabled="isLoading || isSaving" class="btn btn-primary">
              <span v-if="isSaving">Sedang menyimpan</span>
              <span v-else>Simpan</span>
            </button>
          </div>
        </div>

      </form>
    </div>

  </div>
</template>


<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "Pejabat — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const route = useRoute()
const client = usePbClient()
const user = usePbUser()
const role = user?.user.value.role
const isLoading = ref(true)
const isSaving = ref(false)

const form = ref({
  "kepala_sekolah": "",
  "nip_kepala_sekolah": "",
  "wakasek_sarpras": "",
  "nip_wakasek_sarpras": "",
  "pengurus_barang": "",
  "nip_pengurus_barang": "",
  "pangkat_pengurus_barang": "",
  "golongan_pengurus_barang": ""
})

if(role != 'sarpras') navigateTo('/')


async function updatePengaturanJabatan() {
  isLoading.value = true
  isSaving.value = true
  let id = form.value.id

  let res = await client.collection('pejabat_penandatangan').update(id, {
    "kepala_sekolah": form.value.kepala_sekolah,
    "nip_kepala_sekolah": form.value.nip_kepala_sekolah,
    "wakasek_sarpras": form.value.wakasek_sarpras,
    "nip_wakasek_sarpras": form.value.nip_wakasek_sarpras,
    "pengurus_barang": form.value.pengurus_barang,
    "nip_pengurus_barang": form.value.nip_pengurus_barang,
    "pangkat_pengurus_barang": form.value.pangkat_pengurus_barang,
    "golongan_pengurus_barang": form.value.golongan_pengurus_barang
  })
  
  if(res) {
    form.value = res

    isSaving.value = false
    isLoading.value = false
  }

}

async function getJabatanPenandatangan() {
  isLoading.value = true

  let res = await client.collection('pejabat_penandatangan').getOne("uvsu9ltaotfcfte", {})

  if(res) {
    form.value = res
    isLoading.value = false
  }
}


onMounted(() => {
  getJabatanPenandatangan()
})
</script>
