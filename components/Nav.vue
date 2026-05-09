<template>
  <div>
    <nav class="navbar navbar-expand-lg fixed-top bg-primary" data-bs-theme="dark">
      <div class="container-fluid">
        <NuxtLink to="/" class="navbar-brand border border-1 border-white px-2 rounded-2"> sarpras<sup class="text-warning">&bull;</sup></NuxtLink>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          <i class="bi bi-list-nested"></i>
        </button>

        <div class="collapse navbar-collapse" id="navbarColor01">
          <ul class="navbar-nav fw-bold me-auto">
            <li v-if="role == 'sarpras'" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" :activeClass="activeClass" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">MASTER</a>
              <div class="dropdown-menu mt-3 rounded-0">
                <NuxtLink class="nav-link" :activeClass="activeClass" to="/master/unit-kerja">Unit Kerja</NuxtLink>
                <NuxtLink class="nav-link" :activeClass="activeClass" to="/master/rincian-aset">Rincian Aset</NuxtLink>
                <NuxtLink class="nav-link" :activeClass="activeClass" to="/master/sumber-aset">Sumber Perolehan</NuxtLink>
                <NuxtLink class="nav-link" :activeClass="activeClass" to="/master/satuan-aset">Satuan</NuxtLink>
                <NuxtLink class="nav-link" :activeClass="activeClass" to="/master/merek-aset">Merek</NuxtLink>
              </div>
            </li>

            <li class="nav-item">
              <NuxtLink class="nav-link active" :activeClass="activeClass" to="/inventaris">INVENTARIS</NuxtLink>
            </li>

            <li v-if="role == 'sarpras'" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" :activeClass="activeClass" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">LAPORAN</a>
              <div class="dropdown-menu mt-3 rounded-0">
                <NuxtLink class="nav-link" :activeClass="activeClass" to="/laporan/aset">Aset Bulanan</NuxtLink>
                <NuxtLink class="nav-link" :activeClass="activeClass" to="/laporan/bahan">Bahan Bulanan</NuxtLink>
              </div>
            </li>

            <!-- <li class="nav-item dropdown"> -->
            <!--   <a class="nav-link dropdown-toggle" :activeClass="activeClass" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">BAST</a> -->
            <!--   <div class="dropdown-menu mt-3 rounded-0"> -->
            <!--     <NuxtLink class="nav-link" :activeClass="activeClass" to="/bast/penyaluran-aset">Penyaluran Aset</NuxtLink> -->
            <!--     <NuxtLink class="nav-link" :activeClass="activeClass" to="/bast/stock-opname">Stock Opname</NuxtLink> -->
            <!--   </div> -->
            <!-- </li> -->

            <!-- <li class="nav-item"> -->
            <!--   <a class="nav-link" href="#">PETA</a> -->
            <!-- </li> -->

            <li class="nav-item">
              <NuxtLink class="nav-link" :activeClass="activeClass" to="/bast">BAST</NuxtLink>
            </li>

            <li class="nav-item">
              <NuxtLink class="nav-link" :activeClass="activeClass" to="/kib">KIB</NuxtLink>
            </li>

            <li class="nav-item">
              <NuxtLink class="nav-link" :activeClass="activeClass" to="/pengaturan">PENGATURAN</NuxtLink>
            </li>

            <!-- <li class="nav-item dropdown"> -->
            <!--   <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a> -->
            <!--   <div class="dropdown-menu"> -->
            <!--     <a class="dropdown-item" href="#">Action</a> -->
            <!--     <div class="dropdown-divider"></div> -->
            <!--   </div> -->
            <!-- </li> -->
          </ul>
        </div>

        <div v-if="user?.isUserLoggedIn" class="d-flex">
          <span class="text-white me-1">{{ role.toUpperCase() }} / </span>
          <NuxtLink to="/logout" class="nav-link text-white fw-bold">LOGOUT</NuxtLink>
        </div>
        <div v-else class="d-flex">
          <NuxtLink to="/login" class="nav-link text-white fw-bold">LOGIN <i class="bi bi-box-arrow-in-right"></i></NuxtLink>
        </div>
      </div>
    </nav>

  </div>
</template>

<script setup>
const user = usePbUser()
const role = user?.user.value.role
let activeClass = ref('nav-item-active')
</script>

<style scoped>
.nav-item .nav-link {
  color: #fff;
  margin-left: 7px;
}
.nav-item a.nav-link:hover,
a.nav-item-active {
  border-bottom: 1px solid #fff;
}

.dropdown-menu {
  background-color: #fff;
  border-color: #158cba;
  box-shadow: #158cba 3px 3px 0 !important;
}

.dropdown-menu a.nav-link {
  color: RGBA(var(--bs-dark-rgb), var(--bs-bg-opacity, 1));
  width: 150px
}

.dropdown-menu a.nav-link:hover,
.dropdown-menu a.nav-item-active {
  border-bottom: 0;
}
</style>
