<template>
  <div class="wrapper">
    <div class="container-fluid martop">
      <div class="row justify-content-center">
        <div class="col-md-3">
          <div class="text-center p-3  fw-bold bg-primary text-white rounded-4">
            <span class="fs-3">SARPRAS</span> <sub class="text-warning">&bull;</sub> 
            <div class="fw-normal">SMKN 4 Tasikmalaya</div>
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


<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');

.wrapper,
html, body {
  width: 100%;
  font-family: "Quicksand", serif;
  font-size: 12px !important;
}

.martop {
  margin-top: 50px;
}

.card {
  border-radius: 0;
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
.form-control:focus {
  border-color: rgba(127, 127, 127);
  box-shadow: rgba(127, 127, 127) 3px 3px 0 !important;
}
</style>
