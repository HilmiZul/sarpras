<template>
  <div class="wrapper">
    <div class="container-fluid martop">
      <div class="row justify-content-center">
        <div class="col-md-3">
          <div class="text-center p-3 fs-3 fw-bold bg-primary text-white rounded-3">
            SARPRAS<span class="text-warning">.</span> <div class="fw-normal small">SMKN 4 Tasikmalaya</div>
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
  margin-top: 70px;
}

.card {
  border-radius: 0;
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
  border-color: #158cba;
  box-shadow: #158cba 3px 3px 0 !important;
}
</style>
