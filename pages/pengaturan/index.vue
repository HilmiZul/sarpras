<template>
  <div class="card mt-2">
    <div class="card-header fw-bold bg-transparent">
      <span class="fs-5">PENGATURAN</span>
      <div class="fw-normal text-muted">Aplikasi dan Personalisasi</div>
    </div>

    <div class="card-body">
      <ul class="nav nav-tabs fw-bold" role="tablist">
        <li class="nav-item" role="presentation">
          <a class="nav-link active" data-bs-toggle="tab" href="#personalisasi" aria-selected="true" role="tab">Personalisasi</a>
        </li>

        <li class="nav-item" role="presentation">
          <a class="nav-link" data-bs-toggle="tab" href="#password" aria-selected="true" role="tab">Password</a>
        </li>
      </ul>

      <div id="myTabContent" class="tab-content">
        <div class="tab-pane active show pt-3" id="personalisasi" role="tabpanel">
          <form @submit.prevent="updateUser">

            <div class="row">
              <div class="col-md-3">
                <div class="mb-4">
                  <label for="avatar" class="fw-bold mb-2">Avatar</label>
                  <div v-if="avatar" class="mb-3 thumb-container">
                    <img :src="`${host}/api/files/_pb_users_auth_/${user_id}/${avatar}`" :alt="user?.user.nama" class="thumb-pengaturan-avatar" />
                  </div>
                  <input :disabled="isLoading" @change="compressFile" class="form-control form-control-lg" id="avatar" type="file" accept="image/png, image/jpeg, image/jpg" />
                </div>

                <div class="mb-4">
                  <label for="nama" class="fw-bold mb-2">Nama</label>
                  <input :disabled="isLoading" v-model="form.nama" class="form-control form-control-lg" id="nama" type="text" placeholder="nama lengkap" required />
                </div>

                <button :disabled="isLoading" class="btn btn-primary">Simpan</button>
              </div>
            </div>

          </form>
        </div>

        <div class="tab-pane show pt-3" id="password" role="tabpanel">
          <div class="row">
            <div class="col-md-3">
              <div v-if="isSuccess" class="alert alert-success">Password berhasil diubah</div>
              <div v-else-if="oldPasswordNotSame" class="alert alert-danger">Password lama salah</div>
            </div>
          </div>

          <div class="row">
            <form @submit.prevent="updatePassword">
              <div class="col-md-3">
                <div class="mb-4">
                  <label for="passwordLama" class="fw-bold mb-2">Password lama (saat ini)</label>
                  <input :disabled="isLoading" v-model="formPassword.oldPassword" class="form-control form-control-lg" id="passwordLama" type="password" placeholder="ketik password saat ini" required />
                </div>

                <div class="mb-4">
                  <label for="passwordBaru" class="fw-bold mb-2">Password baru (min. 8 karakter)</label>
                  <input :disabled="isLoading" v-model="formPassword.password" class="form-control form-control-lg" id="passwordBaru" type="password" placeholder="ketik password baru" required />
                </div>

                <div class="mb-4">
                  <label for="passwordConfirm" class="fw-bold mb-2">Ketik lagi password baru (min. 8 karakter)</label>
                  <input :disabled="isLoading" v-model="formPassword.passwordConfirm" class="form-control form-control-lg" id="passwordConfirm" type="password" placeholder="ketik lagi password baru" required />
                </div>

                <button :disabled="isLoading || formPassword.oldPassword.length < 8 || formPassword.password.length < 8 || formPassword.passwordConfirm.length < 8" class="btn btn-primary">Simpan</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: "Pengaturan — Sarpras SMKN 4 Tasikmalaya.",
  desc: "Applikasi Inventaris Aset dan Bahan — SMKN 4 Tasikmalaya."
})

let config = useRuntimeConfig()
let host = config.public.apiBaseUrl + ":" + config.public.apiPort
const client = usePbClient()
const user = usePbUser()
const user_id = user?.user.value.id
const isLoading = ref(true)
const isSuccess = ref(false)
const oldPasswordNotSame = ref(false)

const avatar = ref()
const collectionId = ref()

const form = ref({
  "nama": ""
})

const formPassword = ref({
  "oldPassword": "",
  "password": "",
  "passwordConfirm": ""
})

async function fetchUser() {
  isLoading.value = true

  let res = await client.collection('users').getOne(user?.user.value.id)

  if(res) {
    form.value.nama = res.nama
    avatar.value = res.avatar
    collectionId.vlaue = res.collectionId

    isLoading.value = false
  }
}

async function updateUser() {
  isLoading.value = true

  let res = await client.collection('users').update(user?.user.value.id, form.value)

  if(res) {
    form.value.nama = res.nama

    avatar.value = res.avatar

    isLoading.value = false
  }
}


async function updatePassword() {
  console.log(formPassword.value)
  isLoading.value = true

  try {
    if(form.value.password == form.value.passwordConfirm) {
      let res = await client.collection('users').update(user?.user.value.id, formPassword.value)

      if(res) {
        isLoading.value = false
        isSuccess.value = true
        oldPasswordNotSame.value = false
      }
    }
  } catch (error) {
    oldPasswordNotSame.value = true
    isLoading.value = false
    isSuccess.value = false
  }
}

function compressFile(e) {
  let file = e.target.files[0]
  form.value.avatar = file
}


onMounted(() => {
  fetchUser()
})
</script>
