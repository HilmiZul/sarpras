<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5 text-muted">{{ route.path.toUpperCase().replace('/', ' ') }}</span>
      <span v-if="role == 'sarpras'" class="float-end">
        <button class="btn btn-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#baru-ba"><i class="bi bi-plus"></i> Buat baru</button>
      </span>
      <div class="fw-normal text-muted">Laporan Aset Bulanan untuk KCD</div>

      <!-- modal buat baru -->
      <div class="modal" id="baru-ba" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header fw-bold">
              Buat Berita Acara
              <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
            </div>

            <div class="modal-body">
              <div class="mb-3">
                <label for="kategori_ba mb-3">Kategori</label>
                <select class="form-select" id="kategori_ba" required>
                  <option value="pa">Penyaluran Aset</option>
                  <option value="bp">Barang Persediaan</option>
                  <option value="so">Stock Opname</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="lokasi_ba">Lokasi</label>
                <select class="form-select" id="lokasi_ba" required>
                  <option value="perpustakaan">Perpustakaan</option>
                  <option value="tkj">TKJ</option>
                  <option value="tsm">TSM</option>
                  <option value="rpl">RPL</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="nomor_ba">Nomor Berita Acara</label>
                <input class="form-control" id="nomor_ba" type="text" placeholder="__________" required />
              </div>

              <div class="mb-3">
                <label for="barang_ba">Barang</label>
                <select class="form-select" id="barang_ba" required>
                  <option value="09182828282">Nama Barang</option>
                  <option value="09182828282">Nama Barang</option>
                  <option value="09182828282">Nama Barang</option>
                </select>
              </div>
            </div>

            <div class="modal-footer">
              <button @click="()=>console.log('buat baru ba')" class="btn btn-primary"><i class="bi bi-printer"></i> Buat</button>
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
  title: "Laporan Aset — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const user = usePbUser()
const role = user?.user.value.role
const route = useRoute()

</script>
