<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5">PENGATURAN</span>
      <div class="fw-normal text-muted">Aplikasi dan Personalisasi</div>
    </div>

    <div class="card-body">
      <ul class="nav nav-tabs fw-bold" role="tablist">
        <li v-if="role == 'sarpras'" class="nav-item" role="presentation">
          <a class="nav-link active" data-bs-toggle="tab" href="#pejabat" aria-selected="true" role="tab">Pejabat</a>
        </li>

        <li class="nav-item" role="presentation">
          <a v-if="role == 'unit'" class="nav-link active" data-bs-toggle="tab" href="#personalisasi" aria-selected="true" role="tab">Personalisasi</a>
          <a v-else class="nav-link" data-bs-toggle="tab" href="#personalisasi" aria-selected="true" role="tab">Personalisasi</a>
        </li>
      </ul>

      <div id="myTabContent" class="tab-content">
        <div v-if="role == 'sarpras'" class="tab-pane active show" id="pejabat" role="tabpanel">

          <div class="row mt-3">
            <div class="col-md-5">
              <div v-if="isSuccess" class="alert alert-success alert-dismissible mt-3">
                Berhasil tersimpan!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
              </div>

              <form @submit.prevent="updatePengaturanJabatan" >
                <div class="mb-4">
                  <label for="kepala_sekolah" class="fw-bold mb-2">Kepala Sekolah</label>
                  <input v-model="form.kepala_sekolah" type="text" id="kepala_sekolah" placeholder="Nama lengkap kepala sekolah dengan gelar" class="form-control form-control-lg" required />
                </div>

                <div class="mb-4">
                  <label for="nip_kepala_sekolah" class="fw-bold mb-2">NIP. Kepala Sekolah</label>
                  <input v-model="form.nip_kepala_sekolah" type="text" id="nip_kepala_sekolah" placeholder="NIP. Keala sekolah" class="form-control form-control-lg" required />
                </div>

                <div class="mb-4">
                  <label for="wakasek_sarpras" class="fw-bold mb-2">Wakasek Sarpras</label>
                  <input v-model="form.wakasek_sarpras" type="text" id="wakasek_sarpras" placeholder="Nama lengkap wakasek sarpras dengan gelar" class="form-control form-control-lg" required />
                </div>

                <div class="mb-4">
                  <label for="nip_wakasek_sarpras" class="fw-bold mb-2">NIP. Wakasek Sarpras</label>
                  <input v-model="form.nip_wakasek_sarpras" type="text" id="nip_wakasek_sarpras" placeholder="NIP wakasek sarpras" class="form-control form-control-lg" required />
                </div>

                <div class="mb-4">
                  <label for="pengurus_barang" class="fw-bold mb-2">Pengurus Barang</label>
                  <input v-model="form.pengurus_barang" type="text" id="pengurus_barang" placeholder="Nama lengkap pengurus barang dengan gelar" class="form-control form-control-lg" equired />
                </div>

                <div class="mb-4">
                  <label for="nip_pengurus_barang" class="fw-bold mb-2">NIP. Pengurus Barang</label>
                  <input v-model="form.nip_pengurus_barang" type="text" id="nip_pengurus_barang" placeholder="NIP. pengurus barang" class="form-control form-control-lg" required />
                </div>

                <button class="btn btn-primary">Simpan</button>
              </form>

            </div>
          </div>
        </div>

        <div v-if="role == 'sarpras'" class="tab-pane show" id="personalisasi" role="tabpanel">
          Ubah password
        </div>

        <div v-if="role == 'unit'" class="tab-pane active show" id="personalisasi" role="tabpanel">
          Ubah password
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
  title: "Pengaturan — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const client = usePbClient()
const user = usePbUser()
const role = user?.user.value.role
const isLoading = ref(true)
const isSaving = ref(false)
const isSuccess = ref(false)

const form = ref({
  "kepala_sekolah": "",
  "nip_kepala_sekolah": "",
  "wakasek_sarpras": "",
  "nip_wakasek_sarpras": "",
  "pengurus_barang": "",
  "nip_pengurus_barang": ""
})


async function updatePengaturanJabatan() {
  isSaving.value = true
  isSuccess.value = false

  let res = await client.collection('pejabat_penandatangan').update(form.value.id, form.value)
  
  if(res) {
    isSaving.value = false
    isSuccess.value = true
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
