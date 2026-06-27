import { ref, computed } from 'vue'

export interface ItemFilterIssue {
  unit_kerja?: string | null
  kondisi?: string | null
}

export function useItemFiltersIssue() {
  const filters = ref<ItemFilterIssue>({
    unit_kerja: "",
    kondisi: "",
  })

  const resetFilters = () => {
    filters.value = {
      unit_kerja: "",
      kondisi: "",
    }
  }

  const queryFilter = computed(() => {
    const conditions: string[] = []

    if (filters.value.unit_kerja) {
      conditions.push(`unit_kerja = "${filters.value.unit_kerja}"`)
    }

    if (filters.value.kondisi) {
      conditions.push(`kondisi = "${filters.value.kondisi}"`)
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
