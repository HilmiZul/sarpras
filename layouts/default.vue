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
  z-index: 1;
  padding-top: 1em;
}

.white-space {
  white-space: pre-wrap;
}


.thumb-container {
  width: 120px;
  height: 120px;
}

.thumb-container .thumb-aset {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
