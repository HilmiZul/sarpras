<template>
  <div class="wrapper">
    <Nav />

    <div class="container-fluid martop">
      <div class="row">
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
  font-size: 12.5px !important;
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

.link {
  border-bottom: 1.5px solid #000;
  padding-bottom: 2px;
}

.btn {
  text-transform: initial;
}

.modal .modal-dialog .modal-content {
  border-radius: 0 !important;
  border-color: rgba(127, 127, 127) !important;
  box-shadow: rgba(127, 127, 127) 3px 3px 0 !important;
}

.form-control,
.form-control:focus,
.form-select,
.form-select:focus {
  border-color: rgba(127, 127, 127);
  box-shadow: rgba(127, 127, 127) 3px 3px 0 !important;
  /* border-color: #158cba; */
  /* box-shadow: #158cba 3px 3px 0 !important; */
}

.list-group .list-group-item {
  border-bottom: 2px solid rgba(127, 127, 127, .2) !important;
  transition: .15s all ease-in-out;
}

.list-group .list-group-item:hover {
  background-color: rgba(127, 127, 127, .1);
}

.hand {
  cursor: pointer;
}

textarea {
  field-sizing: content;
}

.multiselect__tags {
  border-color: rgba(127, 127, 127);
  box-shadow: rgba(127, 127, 127) 3px 3px 0 !important;
}

.sticky {
  position: sticky !important;
  top: 50px;
  left: 0;
  z-index: 99;
  padding-top: 1em;
}

.white-space {
  white-space: pre-wrap;
}


.thumb-container {
  width: 130px;
  height: 130px;
}

.thumb-avatar-container {
  width: 100px;
  height: 100px;
}

.thumb-container .thumb-aset,
.thumb-avatar-container .thumb-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-preview-avatar {
  width: 100%;
}

.thumb-container .thumb-pengaturan-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

label {
  color: rgba(33, 37, 41, 0.75) !important
}

.card .card-header.thumb-container {
  width: 100%;
  height: 200px;
}

.card .card-body.items {
  height: 160px;
  font-size: 14px;
}

.unit-kerja-container, 
.kondisi-container {
  position: relative;
}

.unit-kerja-container .unit-kerja {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 7px;
  background-color: rgba(0, 0, 0, .7);
  color: #fff;
  z-index: 1;
}

.kondisi-container .kondisi {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0;
  padding: 7px;
  color: #fff;
  z-index: 1;
}


.thumb-overlay-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.thumb-overlay-container .thumb-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, .3);
  transition: .2s all ease-in-out;
}

.thumb-overlay-container .thumb-overlay-hilang {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background-color: rgba(255, 0, 0, .3);
  transition: .2s all ease-in-out;
}

.thumb-overlay-container .thumb-overlay:hover {
  background-color: transparent;
}
</style>
