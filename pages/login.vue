<template>
  <div class="row mt-5 justify-content-center">
    <div class="col-md-3">

      <div class="card">
        <div class="card-body p-4">
          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label for="username" class="fw-bold text-muted mb-2 fs-5">Username</label>
              <input v-model="username" :disabled="isLoading" id="username" type="text" class="form-control form-control-lg p-3" placeholder="masukin username" required autofocus />
            </div>

            <div class="mb-4">
              <label for="pass" class="fw-bold text-muted mb-2 fs-5">Password</label>
              <input v-model="password" :disabled="isLoading || username.length < 3" id="pass" type="password" class="form-control form-control-lg p-3" placeholder="masukin password" required />
            </div>

            <div v-if="isError" class="alert alert-danger small mb-4">
              Username/Password tidak cocok. <br>
              Silahkan coba lagi.
            </div>

            <div class="d-grid gap-2 mt-5">
              <button :disabled="isLoading || username.length < 3 || password.length < 8" class="btn btn-primary btn-lg p-3">
                <span v-if="isLoading">tunggu bentar</span>
                <span v-else><i class="bi bi-send"></i> Masuk</span>
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>


<script setup>
import { useHead } from 'nuxt/app'

definePageMeta({
  layout: 'login',
  middleware: 'check-auth'
})

useHead({
  title: "Login — Sarpras SMKN 4 Tasikmalaya."
})

const client = usePbClient()
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const isError = ref(false)

async function handleLogin() {
  isLoading.value = true
  isError.value = false

  try {
    client.autoCancellation(false)
    const res = await client.collection('users').authWithPassword(
      username.value,
      password.value
    )

    if(res) {
      navigateTo('/')
      isLoading.value = false
      isError.value = false
    }
  } catch {
    isError.value = true
    isLoading.value = false
  }
}
</script>

