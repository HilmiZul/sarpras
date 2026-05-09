<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5">BAHAN</span>
      <span v-if="role == 'sarpras'" class="float-end">
        <NuxtLink to="/inventaris/bahan/tambah" class="btn btn-primary me-2"><i class="bi bi-plus"></i> Tambah baru</NuxtLink>
      </span>
      <div class="fw-normal text-muted">Inventaris Bahan</div>
    </div>

    <div class="card-body">
      <div class="row mb-3">
        <div class="col-md-2">
          <input v-model="filter.keyword" class="form-control" id="keyword" type="text" placeholder="ketik kata kunci..." />
        </div>

        <div class="col-md-1">
          <select v-model="filter.tahun" name="filterTahun" id="filterTahun" class="form-select">
            <option value="">Tahun</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <div class="col-md-1">
          <select v-model="filter.sumber" name="filterSumber" id="filterSumber" class="form-select">
            <option value="">Sumber</option>
            <option value="BOS">BOS</option>
            <option value="BOPD">BOPD</option>
            <option value="DAK">DAK</option>
            <option value="CSR">CSR</option>
          </select>
        </div>

        <div v-if="role == 'sarpras'" class="col-md-1 mb-3">
          <select v-model="filter.unit_kerja" name="filterUnitKerja" id="filterUnitKerja" class="form-select">
            <option value="">Unit Kerja</option>
            <option value="perpustakaan">Perpustakaan</option>
            <option value="tkj">TKJ</option>
            <option value="tsm">TSM</option>
            <option value="rpl">RPL</option>
            <option value="dkv">DKV</option>
            <option value="toi">TOI</option>
          </select>
        </div>

        <div v-if="role == 'unit'" class="col-md-1 mb-3">
          <select v-model="filter.lokasi" name="filterLokasi" id="filterLokasi" class="form-select">
            <option value="">Lokasi</option>
            <option value="Lab 1">Lab. 1</option>
            <option value="Lab 2">Lab. 2</option>
            <option value="Lab 3">Lab. 3</option>
            <option value="Lab 4">Lab. 4</option>
            <option value="Jurusan">Jurusan</option>
            <option value="Teaching Factory">Teaching Factory</option>
            <option value="Server">Server</option>
            <option value="Lobby">Lobby</option>
          </select>
        </div>

        <div class="col-md-2">
          <button class="btn btn-primary">terapkan</button>
          <button @click="resetFilter" class="btn btn-outline-dark ms-1">
            reset
          </button>
        </div>

        <div class="col-md">
          <div class="text-end text-muted fw-bold">50 / 100</div>
        </div>
      </div>

      <hr />

      <div class="table-responsive sticky-top">
        <table class="table table-hover">
          <thead>
            <tr>
              <th width="3%">#</th>
              <th width="10%">KODE RING</th>
              <th>NAMA</th>
              <th width="7%">TAHUN</th>
              <th width="13%">LOKASI</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1.</td>
              <td>123.098.9.567</td>
              <td>
                <span
                  data-bs-toggle="modal"
                  data-bs-target="#rincian"
                  class="link hand-cursor"
                  >AC Split</span
                >
              </td>
              <td>2026</td>
              <td>Lab. 1</td>
            </tr>
            <tr>
              <td>1.</td>
              <td>123.098.9.567</td>
              <td>AC Split</td>
              <td>2026</td>
              <td>Jurusan</td>
            </tr>
            <tr>
              <td>1.</td>
              <td>123.098.9.567</td>
              <td>AC Split</td>
              <td>2026</td>
              <td>Ruang Server</td>
            </tr>
            <tr>
              <td>1.</td>
              <td>123.098.9.567</td>
              <td>Sofa</td>
              <td>2026</td>
              <td>Ruang Lobby</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal" id="rincian" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
          <div class="modal-content">
            <div class="modal-header fw-bold">
              AC Split
              <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <div class="mb-3">
                <label>Tahun</label>
                <div class="fw-bold">2026</div>
              </div>
              <div class="mb-3">
                <label>Kode Ring</label>
                <div class="fw-bold">123.098.9.567</div>
              </div>
              <div class="mb-3">
                <label>Lokasi</label>
                <div class="fw-bold">Perpustakaan</div>
              </div>
              <div class="mb-3">
                <label>Tahun</label>
                <div class="fw-bold">2026</div>
              </div>
              <div class="mb-3">
                <label>Tahun</label>
                <div class="fw-bold">2026</div>
              </div>
            </div>

            <!-- <div class="modal-footer"> -->
            <!--   <button class="btn btn-dark">Buat berita acara</button> -->
            <!-- </div> -->
          </div>
        </div>
      </div>

      <div class="text-center">
        <button class="btn btn-primary">
          <i class="bi bi-arrow-clockwise"></i> muat lagi
        </button>
      </div>
    </div>

    <div class="card-footer bg-transparent">
      <div class="text-center">
        <span class="float-end text-muted fw-bold">50 / 100</span>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Inventaris Aset — SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya.",
});
const user = usePbUser();
const role = user?.user.value.role;

const filter = ref({
  keyword: "",
  jenis_aset: "",
  tahun: "",
  sumber: "",
  unit_kerja: "",
  lokasi: "",
});

function resetFilter() {
  filter.value.keyword = "";
  filter.value.jenis_aset = "";
  filter.value.tahun = "";
  filter.value.sumber = "";
  filter.value.unit_kerja = "";
  filter.value.lokasi = ""
}
</script>

<style scoped>
table.table {
  height: 100%;
}
</style>
