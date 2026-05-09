<template>
  <div class="card mt-2">
    <div class="card-body">
      <h5>hola, <strong>{{ unit.pemegang }} / {{ unit.jabatan_unit_kerja }}</strong>!</h5>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePbClient } from '../composables/pbClient'

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "Sarpras — SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})
const user = usePbUser()
const client = usePbClient()
const unit_kerja = user?.user.value.unit_kerja
const unit = ref({
  ruangan: '',
  pemegang: '',
  jabatan_unit_kerja: '',
})

onMounted(async () => {
  let res = await client.collection('unit_kerja').getFirstListItem(`id="${unit_kerja}"`)
  if(res) {
    unit.value = res
  }
})
</script>


<style scoped>
table.table {
  height: 100%;
}
</style>
