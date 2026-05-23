import { ref, computed } from 'vue'

export interface ItemFilters {
  tgl_sppb?: string | null
  tgl_ba_spj?: string | null
  unit_kerja?: string | null
}

export function useItemFilters() {
  const filters = ref<ItemFilters>({
    tgl_sppb: "",
    tgl_ba_spj: "",
    unit_kerja: "",
  })

  const resetFilters = () => {
    filters.value = {
      tgl_sppb: "",
      tgl_ba_spj: "",
      unit_kerja: "",
    }
  }

  const queryFilter = computed(() => {
    const conditions: string[] = []

    if (filters.value.tgl_sppb) {
      conditions.push(`tgl_sppb ~ "${filters.value.tgl_sppb}"`)
    }

    if (filters.value.tgl_ba_spj) {
      conditions.push(`tgl_ba_spj ~ "${filters.value.tgl_ba_spj}"`)
    }

    if (filters.value.unit_kerja) {
      conditions.push(`unit_kerja.ruangan = "${filters.value.unit_kerja}"`)
    }

    return conditions.length ? conditions.join(' && ') : ''
  })

  const hasActiveFilters = computed(() => {
    return Object.values(filters.value).some(v => v !== null && v !== undefined)
  })

  return {
    filters,
    queryFilter,
    hasActiveFilters,
    resetFilters,
    terapkanFilter: () => {
      console.log('Applying filters:', queryFilter.value)
    }
  }
}
