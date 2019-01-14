from django.contrib import admin
from .models_invent import Jenis, Ruang, Inventaris
from .models_peminjaman import Pegawai, Peminjaman, DetilPinjam
from .models_petugas import Level, Petugas

class JenisAdmin(admin.ModelAdmin):
  list_display = ['nama_jenis', 'kode_jenis']
  search_fields = ['nama_jenis', 'kode_jenis']
  list_per_page = 20

class RuangAdmin(admin.ModelAdmin):
  list_display = ['nama_ruang', 'kode_ruang']
  search_fields = ['nama_ruang', 'kode_ruang']
  list_per_page = 20

class InventarisAdmin(admin.ModelAdmin):
  list_display = ['nama', 'kondisi', 'tanggal_register', 'jumlah', 'id_jenis']
  search_fields = ['nama', 'kode_inventaris']
  list_filter = ('kondisi',)
  list_per_page = 20

class LevelAdmin(admin.ModelAdmin):
  list_display = ['nama_level']
  search_fields = ['nama_jenis']
  list_per_page = 5

class PetugasAdmin(admin.ModelAdmin):
  list_display = ['nama_petugas', 'username', 'id_level']
  search_fields = ['nama_petugas', 'username']
  list_filter = ('id_level',)
  list_per_page = 20

class PegawaiAdmin(admin.ModelAdmin):
  list_display = ['nama_pegawai', 'nip']
  search_fields = ['nama_pegawai', 'nip']
  list_per_page = 20

class PeminjamanAdmin(admin.ModelAdmin):
  list_display = ['id_pegawai', 'tanggal_pinjam', 'tanggal_kembali', 'status_peminjaman']
  search_fields = ['tanggal_pinjam']
  list_per_page = 20

class DetilPeminjamanAdmin(admin.ModelAdmin):
  list_display = ['id_inventaris', 'jumlah']
  list_per_page = 20


admin.site.register(Jenis, JenisAdmin)
admin.site.register(Ruang, RuangAdmin)
admin.site.register(Inventaris, InventarisAdmin)
admin.site.register(Level, LevelAdmin)
admin.site.register(Petugas, PetugasAdmin)
admin.site.register(Pegawai, PegawaiAdmin)
admin.site.register(Peminjaman, PeminjamanAdmin)
admin.site.register(DetilPinjam, DetilPeminjamanAdmin)