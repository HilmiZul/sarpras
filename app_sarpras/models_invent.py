from django.db import models
from .models_petugas import Petugas

class Jenis(models.Model):
  nama_jenis = models.CharField(max_length=20)
  kode_jenis = models.CharField(max_length=20)
  keterangan = models.TextField()

  def __str__(self):
    return self.nama_jenis

class Ruang(models.Model):
  nama_ruang = models.CharField(max_length=15)
  kode_ruang = models.CharField(max_length=20)
  keterangan = models.TextField()

  def __str__(self):
    return self.nama_ruang

class Inventaris(models.Model):
  kondisi_choices = (
    ('bagus', 'Bagus'),
    ('rusak', 'Rusak'),
  )
  
  nama = models.CharField(max_length=30)
  kondisi = models.CharField(max_length=5, choices=kondisi_choices)
  keterangan = models.TextField()
  jumlah = models.IntegerField()
  id_jenis = models.ForeignKey(Jenis, on_delete=True)
  tanggal_register = models.DateField()
  id_ruang = models.ForeignKey(Ruang, on_delete=True)
  kode_inventaris = models.CharField(max_length=20)
  id_petugas = models.ForeignKey(Petugas, on_delete=True)

  def __str__(self):
    return self.nama