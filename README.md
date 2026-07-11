# ADP KAI Kalender Bali Digital — Phase 1.7

Phase 1.7 menambahkan **Backup Data Lokal + Export Jadwal Otonan** di atas Otonan Engine v2.

## Fitur baru

- Export backup JSON untuk data otonan lokal di HP/browser.
- Import backup JSON untuk memindahkan data ke perangkat lain.
- Export jadwal otonan 2026 ke CSV.
- Data otonan tetap tampil sebagai titik hijau di kalender.
- Input otonan tetap mendukung:
  - tanggal lahir Gregorian,
  - hari Bali langsung,
  - koreksi lahir sebelum matahari terbit.
- Short name tetap `KD-Bali`.
- Icon mandala tetap digunakan.
- Service worker cache: v1.7.

## Catatan penting

Data otonan masih tersimpan lokal di browser/perangkat. Lakukan export backup setelah memasukkan data penting. Untuk keputusan adat/upacara penting, tetap verifikasi dengan kalender Bali cetak/resmi, sumber adat setempat, atau pemangku.

## Deploy

Upload seluruh isi folder ini ke repo aktif:

```txt
ADP-KAI-Kalender-Bali-App
```

Commit:

```txt
ADP KAI Kalender Bali Digital phase 1.7 - Local backup and otonan export
```
