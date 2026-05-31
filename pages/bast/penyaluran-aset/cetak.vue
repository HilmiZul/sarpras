<template>
  <div class="base F4">
    <div v-if="isLoading" class="p-5">
      <LoadingPlaceholder :col="12" :n="10" />
    </div>

    <section v-else class="kertas">
      <article>
        <table class="header">
          <tbody>
            <tr>
              <td><img v-if="pengaturan?.logo_provinsi" :src="`${host}/api/files/${pengaturan?.collectionId}/${pengaturan?.id}/${pengaturan?.logo_provinsi}`" :alt="pengaturan?.logo_provinsi" class="logo" /></td>
              <td width="100%" class="text-center">
                <div class="fs-14">PEMERINTAH DAERAH PROVINSI JAWA BARAT</div>
                <div class="fs-16">DINAS PENDIDIKAN</div>
                <div class="fs-14">CABANG DINAS PENDIDIKAN WILAYAH XII</div>
                <div class="fs-16 bold">{{ pengaturan?.nama_sekolah }}</div>
                <address class="smallest">
                  {{ pengaturan?.alamat_sekolah }} (0265) {{ pengaturan?.nomor_sekolah }} <br>
                  Website: {{ pengaturan?.website_sekolah }}. Email: {{ pengaturan?.email_sekolah }} <br>
                  {{ pengaturan?.kota_sekolah }} - {{ pengaturan?.kodepos_sekolah }} <br>
                </address>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="garis mt-2"></div>

        <div class="text-center smallest fw-bold mt-3">
          BERITA ACARA SERAH TERIMA (BAST) PENYALURAN ASET <br>
          Nomor: {{ ba?.no_ba }}
        </div>

        <p class="mt-3 justify smallest">
          Pada hari ini {{ tanggal_terbilang }} bertempat di
SMK Negeri 4 Tasikmalaya yang bertanda tangan dibawah ini:
        </p>

        <table class="mt-1 smallest">
          <tbody>
            <tr>
              <td width="3%">I.</td>
              <td width="30%">Nama</td>
              <td width="2%">:</td>
              <td>{{ pj_tt?.pengurus_barang }}</td>
            </tr>
            <tr>
              <td></td>
              <td>NIP</td>
              <td>:</td>
              <td>{{ pj_tt?.nip_pengurus_barang }}</td>
            </tr>
            <tr>
              <td></td>
              <td>Pangkat/Golongan</td>
              <td>:</td>
              <td>{{ pj_tt?.pangkat_pengurus_barang }}/{{ pj_tt?.golongan_pengurus_barang }}</td>
            </tr>
          </tbody>
        </table>

        <p class="justify smallest">
          Dalam hal ini bertindak sebagai Pengurus Barang Pengguna selanjutnya sebagai PIHAK PERTAMA.
        </p>

        <table class="mt-2 smallest">
          <tbody>
            <tr>
              <td width="3%">II.</td>
              <td width="30%">Nama</td>
              <td width="2%">:</td>
              <td>{{ unit_kerja?.pemegang }}</td>
            </tr>
            <tr>
              <td></td>
              <td>NIP</td>
              <td>:</td>
              <td>{{ unit_kerja?.nip_unit_kerja }}</td>
            </tr>
            <tr>
              <td></td>
              <td>Pangkat/Golongan</td>
              <td>:</td>
              <td>{{ unit_kerja?.pangkat }}/{{ unit_kerja?.golongan }}</td>
            </tr>
          </tbody>
        </table>

        <p class="justify smallest">
        Dalam hal ini bertindak sebagai penerima BMD berupa barang aset, selanjutnya sebagai PIHAK KEDUA.
        </p>

        <p class="mt-2 justify smallest">
          PIHAK PERTAMA telah melakukan serah terima BMD pada PIHAK KEDUA berupa barang aset, berdasarkan
          Surat Perintah Penyaluran Barang (SPPB) tanggal {{ ba?.tgl_sppb }} nomor: {{ ba?.no_sppb }}
          dengan rincian sebagai berikut:
        </p>

        <table class="mt-3 smaller asset text-center">
          <tbody>
            <tr class="fw-bold">
              <td width="3%">No.</td>
              <td width="16%">Kode Barang</td>
              <td>Nama Barang</td>
              <td width="20%">Spesifikasi</td>
              <td>Jumlah</td>
              <td>Satuan</td>
              <td>Harga</td>
              <td>Unit</td>
            </tr>

            <tr v-for="(asset, i) in assets" :key="i">
              <td>{{ i+1 }}</td>
              <td>{{ asset?.expand?.rincian_aset.kode_barang }}</td>
              <td>{{ asset?.expand?.rincian_aset.nama_barang }}</td>
              <td>
                <span v-if="asset?.spesifikasi">{{ asset?.spesifikasi }}</span>
                <span v-else>{{ asset?.expand?.rincian_aset.nama_barang }}/{{ asset?.merek_tipe }}</span>
              </td>
              <td>{{ asset?.volume }}</td>
              <td>{{ asset?.expand?.satuan_aset.nama_satuan }}</td>
              <td>{{ asset?.harga_satuan }}</td>
              <td>{{ asset?.expand?.unit_kerja.ruangan }}</td>
            </tr>
          </tbody>
        </table>

        <p class="mt-3 justify">
          berita acara serah terima ini dibuat sebagai bukti pengeluaran Barang Milik Daerah (BMD).
        </p>

        <table width="100%" class="mt-5 fw-bold text-center">
          <tbody>
            <tr>
              <td width="45%">
                <span>
                  PIHAK KEDUA
                  <br>
                  <br>
                  <br>
                  <br>
                  <br>
                  <span class="border-bottom border-2 border-dark">{{ unit_kerja?.pemegang }}</span> <br>
                  NIP. {{ unit_kerja?.nip_unit_kerja }}
                </span>
              </td>

              <td></td>

              <td width="45%">
                <span>
                  PIHAK PERTAMA
                  <br>
                  <br>
                  <br>
                  <br>
                  <br>
                  <span class="border-bottom border-2 border-dark">{{ pj_tt?.pengurus_barang }}</span> <br>
                  NIP. {{ pj_tt?.nip_pengurus_barang }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

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
  title: `Pratinjau Cetak Berita Acara Penyaluran Aset — SMKN 4 Tasikmalaya.`,
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya.",
})

const { formatTanggalTerbilang } = useTanggalTerbilang()

let user = usePbUser()
let role = user?.user.value.role
let raw_tanggal_sekarang = new Date()
let format_tanggal_sekarang = new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(raw_tanggal_sekarang)
let tanggal_terbilang = formatTanggalTerbilang(format_tanggal_sekarang)
let client = usePbClient()
let route = useRoute()
let config = useRuntimeConfig()
let host = config.public.apiBaseUrl+":"+config.public.apiPort
let isLoading = ref(true)
let isLoadingAsset = ref(true)
let pengaturan = ref('')
let pj_tt = ref('')
let unit_kerja = ref('')
let assets = ref([])
let ba = ref('')

if(role != 'sarpras') navigateTo('/bast/penyaluran-aset')

async function fetchBAbyId() {
  let res = await client.collection('bast').getOne(route.query.ba, {
    expand: `unit_kerja`
  })

  if(res) {
    ba.value = res

    let opsiTgl = {
      dateStyle: "long"
    }

    let raw_tgl_sppb = new Date(res.tgl_sppb)
    ba.value.tgl_sppb = new Intl.DateTimeFormat('id-ID', opsiTgl).format(raw_tgl_sppb)
  }
}

async function fetchAssetByUnitAndSpj() {
  isLoadingAsset.value = true

  let res = await client.collection('aset').getFullList({
    expand: `rincian_aset, satuan_aset, unit_kerja`,
    filter: `unit_kerja="${route.query.uk}" && tgl_ba_spj~"${route.query.tgl_spj}"`
  })

  if(res) {
    assets.value = res

    // format mata uang
    let option = {
      style: "currency",
      currency: "IDR"
    }

    for(let i=0; i<res.length; i++) {
      assets.value[i].harga_satuan = new Intl.NumberFormat("id-ID", option).format(res[i].harga_satuan)
    }

    isLoadingAsset.value = false
  }
}

async function fetchPengaturanById() {
  isLoading.value = true

  let res = await client.collection('pengaturan').getOne('ecarpvlbtxskkb1', {})

  if(res) {
    isLoading.value = false

    pengaturan.value = res
  }
}

async function fetchPejabatPenandatanganById() {
  let res = await client.collection('pejabat_penandatangan').getOne(`uvsu9ltaotfcfte`, {})

  if(res) {
    pj_tt.value = res
  }
}

async function fetchUnitKerjaById() {
  let res = await client.collection('unit_kerja').getOne(route.query.uk, {})

  if(res) {
    unit_kerja.value = res
  }
}


onMounted(() => {
  fetchBAbyId()
  fetchUnitKerjaById()
  fetchPengaturanById()
  fetchPejabatPenandatanganById()
  fetchAssetByUnitAndSpj()
})


</script>
