from django.db import models
from .models_invent import Inventaris

class Pegawai(models.Model):
  nama_pegawai = models.CharField(max_length=30)
  nip = models.CharField(max_length=20)
  alamat = models.TextField()

  def __str__(self):
    return self.nama_pegawai

class Peminjaman(models.Model):
  tanggal_pinjam = models.DateField()
  tanggal_kembali = models.DateField()
  status_peminjaman = models.BooleanField(default=True)
  id_pegawai = models.ForeignKey(Pegawai, on_delete=True)
  label = models.CharField(max_length=10, default='peminjaman')

  def __str__(self):
    return self.label

class DetilPinjam(models.Model):
  id_inventaris = models.ForeignKey(Inventaris, on_delete=True)
  id_peminjaman = models.ForeignKey(Peminjaman, on_delete=True)
  jumlah = models.IntegerField()
  label = models.CharField(max_length=12, default='detil pinjam')

  def __str__(self):
    return self.label