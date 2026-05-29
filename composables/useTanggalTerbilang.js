/* 
 * Thank You, @Develoka for this lib.
 */
import angkaTerbilang from '@develoka/angka-terbilang-js'

const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const bulan = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

export const useTanggalTerbilang = () => {
  const formatTanggalTerbilang = (input) => {
    if (!input) return 'Tanggal tidak valid'

    let date

    // Parsing Format 1: "Jumat, 29 Mei 2026"
    const matchFormatTeks = input.match(
      /^([A-Za-z]+),\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/
    )

    if (matchFormatTeks) {
      const [, , tanggalStr, bulanStr, tahunStr] = matchFormatTeks
      const bulanIndex = bulan.findIndex(
        b => b.toLowerCase() === bulanStr.toLowerCase()
      )

      if (bulanIndex !== -1) {
        date = new Date(Number(tahunStr), bulanIndex, Number(tanggalStr))
      }
    }

    // Parsing Format 2: "Senin, 01-06-2026" atau "01/06/2026"
    if (!date || isNaN(date.getTime())) {
      const cleaned = input.replace(/^[A-Za-z]+,\s*/, '')
      const parts = cleaned.split(/[-/]/)

      if (parts.length === 3) {
        let day, month, year

        // Cek apakah format DD-MM-YYYY atau MM-DD-YYYY
        if (parseInt(parts[0]) > 12) {
          // Kemungkinan DD-MM-YYYY
          day = parseInt(parts[0])
          month = parseInt(parts[1]) - 1
          year = parseInt(parts[2])
        } else {
          day = parseInt(parts[1])
          month = parseInt(parts[0]) - 1
          year = parseInt(parts[2])
        }
        date = new Date(year, month, day)
      }
    }

    if (!date || isNaN(date.getTime())) {
      return 'Format tgl gak dikenal'
    }

    const namaHari = hari[date.getDay()]
    const tanggal = date.getDate()
    const namaBulan = bulan[date.getMonth()]
    const tahun = date.getFullYear()

    return `${namaHari} tanggal ${angkaTerbilang(tanggal)} bulan ${namaBulan} tahun ${angkaTerbilang(tahun)}`
  }

  return { formatTanggalTerbilang }
}
