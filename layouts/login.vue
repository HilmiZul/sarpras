<template>
  <div class="wrapper">
    <div class="container-fluid martop">
      <div class="row justify-content-center">
        <div class="col-md-3">
          <div class="text-center p-3  fw-bold bg-primary text-white header-login">
            <LoadingPlaceholder v-if="isLoading" :col="6" :n="1" />
            <div v-else>
              <img v-if="pengaturan" :src="`${host}/api/files/${pengaturan.collectionId}/${pengaturan.id}/${pengaturan.logo_sekolah}`" :alt="pengaturan?.nama_sekolah" class="login-logo">
            </div>

            <span class="fs-3">SARPRAS</span> <sub class="text-warning">&bull;</sub> 

            <LoadingPlaceholder v-if="isLoading" :col="4" :n="1" />
            <div v-else class="fw-normal">
              <span v-if="pengaturan">{{ pengaturan?.nama_sekolah }}</span>
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <slot />
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-md-4">
          <Footer />
        </div>
      </div>
    </div>

  </div>

</template>


<script setup>
import { useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()
const host = `${config.public.apiBaseUrl}:${config.public.apiPort}`
const client = usePbClient()
const pengaturan = ref('')
const isLoading = ref(true)

async function getPengaturan() {
  isLoading.value = true

  let res = await client.collection('pengaturan').getOne(`ecarpvlbtxskkb1`, {})

  if(res) {
    pengaturan.value = res

    isLoading.value = false
  }
}


onMounted(() => getPengaturan())
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');

.wrapper,
html, body {
  width: 100%;
  font-family: "Quicksand", serif;
  font-size: 12px !important;
}

.martop {
  margin-top: 60px;
}

.card {
  border-radius: 32px;
  corner-shape: squircle;
  border-color: rgba(127, 127, 127);
  box-shadow: rgba(127, 127, 127) 3px 3px 0 !important;
}

table tbody {
  height: 30px;
  overflow-y: auto;
}

table.table thead th {
  color: #fff;
  background-color: RGBA(var(--bs-dark-rgb), var(--bs-bg-opacity, 1)) !important;
}

.hand-cursor {
  cursor: pointer;
}

.form-control,
.form-control:focus,
.form-control:disabled {
  border-color: rgba(127, 127, 127);
  box-shadow: rgba(127, 127, 127) 3px 3px 0 !important;
  border-radius: 32px;
  corner-shape: squircle;
}

.login-logo {
  width: 10%;
}

.btn,
.form-control {
  border-radius: 32px;
  corner-shape: squircle;
}

.header-login {
  border-radius: 32px;
  corner-shape: squircle;
}
</style>
