# Generated by Django 2.1 on 2019-01-11 07:53

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='DetilPinjam',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('jumlah', models.IntegerField()),
                ('label', models.CharField(default='detil pinjam', max_length=12)),
            ],
        ),
        migrations.CreateModel(
            name='Inventaris',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nama', models.CharField(max_length=30)),
                ('kondisi', models.CharField(choices=[('bagus', 'Bagus'), ('rusak', 'Rusak')], max_length=5)),
                ('keterangan', models.TextField()),
                ('jumlah', models.IntegerField()),
                ('tanggal_register', models.DateField()),
                ('kode_inventaris', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Jenis',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nama_jenis', models.CharField(max_length=20)),
                ('kode_jenis', models.CharField(max_length=20)),
                ('keterangan', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Level',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nama_level', models.CharField(max_length=13)),
            ],
        ),
        migrations.CreateModel(
            name='Pegawai',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nama_pegawai', models.CharField(max_length=30)),
                ('nip', models.CharField(max_length=20)),
                ('alamat', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Peminjaman',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tanggal_pinjam', models.DateField()),
                ('tanggal_kembali', models.DateField()),
                ('status_peminjaman', models.BooleanField(default=True)),
                ('label', models.CharField(default='peminjaman', max_length=10)),
                ('id_pegawai', models.ForeignKey(on_delete=True, to='app_sarpras.Pegawai')),
            ],
        ),
        migrations.CreateModel(
            name='Petugas',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nama_petugas', models.CharField(max_length=20)),
                ('id_level', models.ForeignKey(on_delete=True, to='app_sarpras.Level')),
                ('username', models.ForeignKey(on_delete=True, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Ruang',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nama_ruang', models.CharField(max_length=15)),
                ('kode_ruang', models.CharField(max_length=20)),
                ('keterangan', models.TextField()),
            ],
        ),
        migrations.AddField(
            model_name='inventaris',
            name='id_jenis',
            field=models.ForeignKey(on_delete=True, to='app_sarpras.Jenis'),
        ),
        migrations.AddField(
            model_name='inventaris',
            name='id_petugas',
            field=models.ForeignKey(on_delete=True, to='app_sarpras.Petugas'),
        ),
        migrations.AddField(
            model_name='inventaris',
            name='id_ruang',
            field=models.ForeignKey(on_delete=True, to='app_sarpras.Ruang'),
        ),
        migrations.AddField(
            model_name='detilpinjam',
            name='id_inventaris',
            field=models.ForeignKey(on_delete=True, to='app_sarpras.Inventaris'),
        ),
        migrations.AddField(
            model_name='detilpinjam',
            name='id_peminjaman',
            field=models.ForeignKey(on_delete=True, to='app_sarpras.Peminjaman'),
        ),
    ]
