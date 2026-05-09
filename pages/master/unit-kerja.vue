<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      MASTER UNIT KERJA
      <span class="float-end">
        <button class="btn btn-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#tambah-unit-kerja"><i class="bi bi-plus"></i> Tambah</button>
      </span>
      <div class="fw-normal text-muted">Daftar Unit Kerja dan Penanggung Jawab</div>

      <div class="modal" id="tambah-unit-kerja" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header fw-bold">
              Tambah Unit Kerja
              <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <form>
                <div class="mb-4">
                  <label for="ruangan" class="mb-2">Ruangan</label>
                  <input type="text" id="ruangan" class="form-control form-control-lg" placeholder="nama ruangan" autofocus required />
                </div>

                <div class="mb-4">
                  <label for="pemegang" class="mb-2">Pemegang</label>
                  <input type="text" id="pemegang" class="form-control form-control-lg" placeholder="nama lengkap pemegang" required />
                </div>

                <div class="mb-4">
                  <label for="nip_pemegang" class="mb-2">NIP Pemegang</label>
                  <input type="text" id="nip_pemegang" class="form-control form-control-lg" placeholder="NIP pemegang (jika ada)" />
                </div>

                <div class="mb-4">
                  <label for="jabatan" class="mb-2">Jabatan Unit Kerja</label>
                  <input type="text" id="jabatan" class="form-control form-control-lg" placeholder="contoh: Kabeng RPL" required />
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
      <div v-if="isLoading">
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
      </div>

      <div v-else>
        <ul v-for="item in items.items" :key="item.id" class="list-group list-group-flush">
          <li class="list-group-item hand" data-bs-toggle="modal" data-bs-target="#update-unit-kerja">
            <div class="fw-bold fs-5"><i class="bi bi-buildings"></i> {{ item.ruangan }}</div>

            <div class="fw-bold text-muted">{{ item.jabatan_unit_kerja }}</div>

            <div class="text-muted">{{ item.pemegang }}</div>

            <div class="text-muted">NIP. {{ item.nip_unit_kerja }}</div>
          </li>
        </ul>

        <div class="modal" id="update-unit-kerja" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header fw-bold">
                Ubah Unit Kerja
                <button class="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div class="modal-body">
                form...
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
import { onMounted } from 'vue'
import LoadingPlaceholder from '../../components/LoadingPlaceholder.vue'

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "Unit Kerja — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

const client = usePbClient()
const user = usePbUser()
const items = ref([])
const isLoading = ref(true)
const perPage = 30

async function getItems() {
  isLoading.value = true

  let res_items = await client.collection('unit_kerja').getList(1, perPage, {
    sort: `-created, ruangan`
  })

  if(res_items) {
    items.value = res_items
    isLoading.value = false
  }
}

onMounted(() => {
  getItems()
})

</script>
