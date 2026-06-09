<template>
  <div class="print-container">
    <div class="text-center text-muted fw-bold fs-2 mb-3">
      Prantinjau
      <NuxtLink v-if="assets.length > 0" to="/" class="btn btn-primary"><i class="bi bi-printer"></i> Cetak</NuxtLink>
    </div>

    <div v-if="props.assets" :class="['printable-paper', selectedSize]">
      <div class="row fw-bold">

        <!-- loop dulu jumlah aset lalu nomor reg by volume aset -->
        <div v-for="(asset, i) in assets" :key="i" class="col-md-6 border border-1 border-dark">
          <!-- loop dulu nomor reg -->
          <div v-for="(reg, j) in asset.volume" :key="j" class="row p-2">
            <div class="col-md-4 border border-1 border-dark">
              <div class="row border-bottom border-1 border-dark">
                <div class="col-md-12 p-3">
                  <img v-if="props.setting" :src="`${host}/api/files/${props.setting.collectionId}/${props.setting.id}/${props.setting.logo_provinsi}`" alt="logo provinsi" class="logo-sticker">
                </div>
              </div>
              <div class="row border-bottom border-1 border-dark">
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
              <div class="row border-bottom border-1 border-dark py-3">
                <div class="col-md-12">
                  <div class="text-muted">Kode Lokasi</div>
                  {{ asset?.expand?.unit_kerja.kode_lokasi }}
                </div>
              </div>
              <div class="row border-bottom border-1 border-dark py-2">
                <div class="col-md-12">
                  <div class="text-muted">Kode Barang</div>
                  {{ asset?.expand?.rincian_aset.kode_barang }}
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 border-end border-1 border-dark py-3">
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const config = useRuntimeConfig()
const host = config.public.apiBaseUrl + `:` + config.public.apiPort
const selectedSize = ref('a4')
const props = defineProps({
  assets: Array | null,
  setting: String | null,
})
</script>

<style scoped>
.print-container {
  padding: 20px 0;
}

.print-controls {
  text-align: center;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  gap: 15px;
  align-items: center;
}

.paper-select {
  padding: 10px 14px;
  font-size: 16px;
  border: 1px solid #999;
  border-radius: 8px;
}

.print-btn {
  padding: 10px 24px;
  font-size: 16px;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.printable-paper {
  background: white;
  margin: 0 auto;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  padding: 15mm 13mm;
  box-sizing: border-box;
}

/* Ukuran Kertas */
.a4 {
  width: 210mm;
  min-height: 297mm;
}

.f4 {
  width: 210mm;
  min-height: 330mm;
}

/* ===================== PRINT ===================== */
@media print {
  .print-controls,
  .print-controls * {
    display: none !important;
  }

  html, body * {
    visibility: hidden !important;
  }

  .printable-paper,
  .printable-paper * {
    visibility: visible;
  }

  .printable-paper {
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
    box-shadow: none;
    width: 100% !important;
    padding: 15mm 13mm;
  }

  @page {
    margin: 0;
    size: A4 portrait;
  }
}
</style>
