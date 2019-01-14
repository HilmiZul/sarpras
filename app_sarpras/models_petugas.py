from django.db import models
from django.contrib.auth.models import User

class Level(models.Model):
  nama_level = models.CharField(max_length=13)

  def __str__(self):
    return self.nama_level

class Petugas(models.Model):
  username = models.ForeignKey(User, on_delete=True)
  nama_petugas = models.CharField(max_length=20)
  id_level = models.ForeignKey(Level, on_delete=True)

  def __str__(self):
    return self.nama_petugas