<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5 text-muted">{{ route.path.toUpperCase().replace('/', ' ') }}</span>
      <span v-if="role == 'unit'" class="float-end">
        <button @click="() => isSuccess = false" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#ajukan"><i class="bi bi-plus"></i> Ajukan</button>
      </span>
      <div class="fw-normal text-muted">Pengajuan Aset dan Bahan</div>

      <div v-if="role == 'unit'" class="modal" id="ajukan" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header text-muted fw-bold">
              Pengajuan {{ form.jenis }}
              <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <div v-if="isSuccess" class="alert alert-success alert-dismissible">
                Berhasil ditambahkan!
              </div>

              <form @submit.prevent="addNewItem">
                <div class="mb-4">
                  <label for="jenis" class="mb-2">Jenis</label>
                  <select v-model="form.jenis" name="jenis" id="jenis" class="form-select form-select-lg" required>
                    <option value="">Pilih Jenis</option>
                    <option v-for="(namaJenis, i) in jenis" :key="i" :value="namaJenis">{{ namaJenis }}</option>
                  </select>
                </div>

                <button class="btn btn-primary"><i class="bi bi-send-fill"></i> Ajukan</button>
                <button type="button" class="btn btn-outline-dark ms-2" data-bs-dismiss="modal">Tutup</button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="card-body">
      body konten
    </div>

  </div>
</template>


<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "Pengajuan Aset dan Bahan — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const route = useRoute()
const user = usePbUser()
const role = user?.user.value.role
const client = usePbClient()

const isSuccess = ref(false)
const jenis = ref(['aset', 'bahan'])
const form = ref({
  jenis: ''
})


async function addNewItem() {
  isSuccess.value = false
  console.log('tes add!')
  isSuccess.value = true
}
</script>
