/* component ini di-asisteni oleh Grok 
 * 13 Mei 2026
 * thank u
 */
import { ref, computed } from 'vue'

export interface ItemFilters {
  tahun?: string | number | null
  triwulan?: string | number | null
  sumber?: string | null
  unit_kerja?: string | null
  lokasi?: string | null
}

export function useItemFilters() {
  const filters = ref<ItemFilters>({
    tahun: "",
    triwulan: "",
    sumber: "",
    unit_kerja: "",
    lokasi: "",
  })

  const resetFilters = () => {
    filters.value = {
      tahun: "",
      triwulan: "",
      sumber: "",
      unit_kerja: "",
      lokasi: "",
    }
  }

  const queryFilter = computed(() => {
    const conditions: string[] = []

    if (filters.value.triwulan) {
      conditions.push(`triwulan = "${filters.value.triwulan}"`)
    }

    if (filters.value.tahun) {
      conditions.push(`tahun_pengadaan.tahun = ${filters.value.tahun}`)
    }

    if (filters.value.sumber) {
      conditions.push(`sumber_aset.nama_sumber = '${filters.value.sumber}'`)
    }

    if (filters.value.unit_kerja) {
      conditions.push(`unit_kerja.ruangan = '${filters.value.unit_kerja}'`)
    }

    if (filters.value.lokasi) {
      conditions.push(`lokasi_unit_kerja = '${filters.value.lokasi}'`)
    }

    return conditions.length ? conditions.join(' && ') : ''
  })

  // cek filter aktif
  const hasActiveFilters = computed(() => {
    return Object.values(filters.value).some(v => v !== null && v !== undefined)
  })

  return {
    filters,
    queryFilter,
    hasActiveFilters,
    resetFilters,
    terapkanFilter: () => {
      // Bisa dipakai untuk trigger refresh data
      console.log('Applying filters:', queryFilter.value)
    }
  }
}
