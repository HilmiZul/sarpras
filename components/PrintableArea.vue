<template>
  <div class="print-container">
    <div class="mb-3">
      <select v-model="selectedSize" class="form-select">
        <option value="a4">A4 (210 × 297 mm)</option>
        <option value="f4">F4 (210 × 330 mm)</option>
      </select>
      <button @click="print" class="btn btn-dark">🖨️ Cetak Sekarang</button>
    </div>

    <div :class="['printable-paper', selectedSize]">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedSize = ref('a4')

const print = () => {
  window.print()
}
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
