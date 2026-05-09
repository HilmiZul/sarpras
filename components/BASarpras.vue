<template>
  <div class="row">
    <div class="col-md-12">
      <ul class="nav nav-tabs fw-bold" role="tablist">
        <li class="nav-item" role="presentation">
          <a class="nav-link active" data-bs-toggle="tab" href="#pa" aria-selected="true" role="tab">Penyaluran Aset</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-bs-toggle="tab" href="#bp" aria-selected="true" role="tab">Penyaluran Barang Persediaan</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-bs-toggle="tab" href="#so" aria-selected="true" role="tab">Stock Opname</a>
        </li>
      </ul>

      <div id="myTabContent" class="tab-content">
        <div class="tab-pane active show" id="pa" role="tabpanel">
          <div class="row pt-3">
            <div class="col-md-1">
              <select class="form-select">
                <option value="">Tahun</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            <div class="col-md-1 mb-3">
              <select class="form-select">
                <option value="">Unit Kerja</option>
                <option value="perpustakaan">Perpustakaan</option>
                <option value="tkj">TKJ</option>
                <option value="tsm">TSM</option>
                <option value="rpl">RPL</option>
                <option value="dkv">DKV</option>
                <option value="toi">TOI</option>
              </select>
            </div>

            <div class="col-md-2">
              <button class="btn btn-primary">terapkan</button>
              <button class="btn btn-outline-dark ms-1">reset</button>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th width="3%">#</th>
                    <th>NOMOR BA</th>
                    <th width="7%">TAHUN</th>
                    <th width="10%">UNIT KERJA</th>
                    <th width="8%">ARSIP</th>
                    <th width="10%">UNGGAH</th>
                    <th width="8%">CETAK</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>1.</td>
                    <td>nomor ba</td>
                    <td>2026</td>
                    <td>Perpustakaan</td>
                    <td>
                      <button class="btn btn-default btn-sm" data-bs-toggle="modal" data-bs-target="#lihat-berkas-ba">
                        <i class="bi bi-eye-fill"></i> lihat
                      </button>
                    </td>
                    <td>
                      <button class="btn btn-dark btn-sm" data-bs-toggle="modal" data-bs-target="#unggah-ba"><i class="bi bi-upload"></i> Unggah BA</button>
                    </td>
                    <td>
                      <button class="btn btn-dark btn-sm"><i class="bi bi-printer"></i> Cetak</button>
                    </td>
                  </tr>
                  <tr>
                    <td>2.</td>
                    <td>nomor ba</td>
                    <td>2026</td>
                    <td>RPS RPL</td>
                    <td>&#8212;</td>
                    <td>
                      <button class="btn btn-dark btn-sm"><i class="bi bi-upload"></i> Unggah BA</button>
                    </td>
                    <td>
                      <button class="btn btn-dark btn-sm"><i class="bi bi-printer"></i> Cetak</button>
                    </td>
                  </tr>
                  <tr>
                    <td>3.</td>
                    <td>nomor ba</td>
                    <td>2026</td>
                    <td>RPS DKV</td>
                    <td>&#8212;</td>
                    <td>
                      <button class="btn btn-dark btn-sm"><i class="bi bi-upload"></i> Unggah BA</button>
                    </td>
                    <td>
                      <button class="btn btn-dark btn-sm"><i class="bi bi-printer"></i> Cetak</button>
                    </td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        </div>

        <div class="tab-pane" id="bp" role="tabpanel">
          <div class="row">
            <div class="col-md-1 py-3">
              <select class="form-select">
                <option value="">Tahun</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>
        </div>
        <div class="tab-pane" id="so" role="tabpanel">
          <p>stock opname</p>
        </div>
      </div>

      <!-- single modal: lihat berkas ba -->
      <div class="modal" id="lihat-berkas-ba" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header fw-bold">
              Arsip Berita Acara
              <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
            </div>
            <div class="modal-body">
              <iframe src="/contoh-ba.pdf" width="100%" height="100%"></iframe>
            </div>
          </div>
        </div>
      </div>

      <!-- single modal: unggah berkas ba -->
      <div class="modal" id="unggah-ba" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header fw-bold">
              Unggah Berkas Berita Acara
              <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label for="file" class="mb-2">Berkas <span class="text-danger">(.pdf)</span></label>
                  <input class="form-control" id="file" type="file" accept="application/pdf" required />
                </div>

                <button class="btn btn-primary">Kirim</button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

