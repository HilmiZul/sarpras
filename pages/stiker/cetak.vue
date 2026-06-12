<template>
  <div class="base F4">
    <div v-if="isLoading" class="p-5">
      <LoadingPlaceholder :col="12" :n="10" />
    </div>

    <section v-else class="kertas">
      <article>
        <div class="row fw-bold">

          <!-- loop dulu jumlah aset lalu nomor reg by volume aset -->
          <div v-for="(asset, i) in assets" :key="i" class="col-md-6 border border-1 border-dark">
            <!-- loop dulu nomor reg -->
            <div v-for="(reg, j) in asset.volume" :key="j" class="row p-2">
              <div class="col-md-4 border border-1 border-dark">
                <div class="row border-bottom border-1 border-dark">
                  <div class="col-md-12 p-3">
                    <img v-if="setting" :src="`${host}/api/files/${setting.collectionId}/${setting.id}/${setting.logo_provinsi}`" alt="logo provinsi" class="logo-sticker">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12 py-1">
                    No.Reg: {{ j+1 }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12 py-1">
                    No.KIB: {{ asset.kib }}
                  </div>
                </div>
              </div>

              <div class="col-md-8 border border-1 border-dark text-center text-uppercase">
                <div class="row py-3">
                  <div class="col-md-12">
                    <div class="text-muted">Kode Lokasi</div>
                    {{ asset?.expand?.unit_kerja.kode_lokasi }}
                  </div>
                </div>
                <div class="row py-2">
                  <div class="col-md-12">
                    <div class="text-muted">Kode Barang</div>
                    {{ asset?.expand?.rincian_aset.kode_barang }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 py-3">
                    <div class="text-muted">Sumber</div>
                    {{ asset?.expand?.sumber_aset.nama_sumber }}
                  </div>
                  <div class="col-md-6 py-3">
                    <div class="text-muted">Tahun</div>
                    {{ asset?.expand?.tahun_pengadaan.tahun }}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </article>
    </section>

    <!-- <section class="kertas"> -->
    <!--   <article> -->
    <!--     <div class="bold text-center">LEMBAR PENERIMAAN PKL</div> -->
    <!--     <div class="mt-2"> -->
    <!--       Yang bertanda tangan di bawah ini: -->
    <!--       <table class="mt-3 lineheigh"> -->
    <!--         <tbody> -->
    <!--           <tr> -->
    <!--             <td width="20%">Nama</td> -->
    <!--             <td>:</td> -->
    <!--           </tr> -->
    <!--           <tr> -->
    <!--             <td>Jabatan</td> -->
    <!--             <td>:</td> -->
    <!--           </tr> -->
    <!--           <tr> -->
    <!--             <td>Nama Industri</td> -->
    <!--             <td>:</td> -->
    <!--           </tr> -->
    <!--           <tr> -->
    <!--             <td>Alamat</td> -->
    <!--             <td>:</td> -->
    <!--           </tr> -->
    <!--           <tr><td>&nbsp;</td></tr> -->
    <!--           <tr> -->
    <!--             <td>Telepon/HP</td> -->
    <!--             <td>:</td> -->
    <!--           </tr> -->
    <!--           <tr> -->
    <!--             <td>Waktu kegiatan</td> -->
    <!--             <td>:</td> -->
    <!--             <td class="bold">....</td> -->
    <!--           </tr> -->
    <!--         </tbody> -->
    <!--       </table> -->
    <!--       <div class="mt-4 text-center bold">MENERIMA / TIDAK MENERIMA *</div> -->
    <!--       <p class="mt-3">Siswa/i tersebut di bawah ini PKL dari .</p> -->
    <!--       <table class="mt-3 smallest siswa"> -->
    <!--         <tbody> -->
    <!--           <tr class="text-center"> -->
    <!--             <td>No.</td> -->
    <!--             <td>Nama</td> -->
    <!--             <td width="12%">NIS</td> -->
    <!--             <td width="10%">Kelas</td> -->
    <!--             <td>Program Keahlian</td> -->
    <!--           </tr> -->
    <!--         </tbody> -->
    <!--       </table> -->
    <!--       <div class="mt-3"> -->
    <!--         Demikian surat penerimaan PKL ini kami buat dan untuk digunakan sebagai mana mestinya. -->
    <!--       </div> -->
    <!--       <div class="mt-3">Catatan:</div> -->
    <!--       <div class="mt-2 italic"> -->
    <!--         *Coret yang tidak perlu <br> -->
    <!--         Segala bentuk jawaban atas surat permohonan ini mohon di sampaikan melalui alamat: <br> -->
    <!--         Jl. Depok Kelurahan Sukamenak Kecamatan Purbaratu Kota Tasikmalaya <br> -->
    <!--         Tlp. (0265)312059 -->
    <!--       </div> -->
    <!--       <table class="mt-3"> -->
    <!--         <tbody> -->
    <!--           <tr> -->
    <!--             <td></td> -->
    <!--             <td width="31%"> -->
    <!--               Tasikmalaya,.......................2025 <br> -->
    <!--               <div class="mt-2">Hormat Kami,</div> -->
    <!--               <div class="mt-2">a.n PT / CV ................................</div> -->
    <!--               <br> -->
    <!--               <br> -->
    <!--               <br> -->
    <!--               <br> -->
    <!--               .................................................... -->
    <!--             </td> -->
    <!--           </tr> -->
    <!--         </tbody> -->
    <!--       </table> -->
    <!--     </div> -->
    <!--   </article> -->
    <!-- </section> -->

  </div>
</template>

<script setup>
definePageMeta({
  layout: 'print',
  middleware: 'auth'
})

useHead({
  title: `Pratinjau Cetak Stiker — SMKN 4 Tasikmalaya.`,
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya.",
})

let user = usePbUser()
let role = user?.user.value.role
let client = usePbClient()
let route = useRoute()
let config = useRuntimeConfig()
let host = config.public.apiBaseUrl+":"+config.public.apiPort
let isLoading = ref(true)
let setting = ref()
let assets = ref([])

if(role != 'sarpras') navigateTo('/stiker/')


async function fetchItems() {
  isLoading.value = true

  let res = await client.collection('aset').getFullList({
    expand: `unit_kerja, rincian_aset, sumber_aset, tahun_pengadaan`,
    filter: `tgl_ba_spj~"${route.query.spj}" && unit_kerja="${route.query.uk}"`
  })

  if(res) {
    assets.value = res
    isLoading.value = false
  }
}

async function fetchSetting() {
  let res = await client.collection('pengaturan').getOne(`ecarpvlbtxskkb1`)
  if(res) {
    setting.value = res
  }
}

onMounted(() => {
  fetchItems()
  fetchSetting()
})


</script>


<style scoped>
.logo-sticker {
  width: 100%;
}
</style>
