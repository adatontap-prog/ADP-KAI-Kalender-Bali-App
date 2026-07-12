# ADP KAI Kalender Bali Digital — Phase 2.4

Phase 2.0 menambahkan Data Validation Console untuk audit kualitas data Kalender Bali 2026.

## Fitur baru

- Data Validation Console di dalam app
- Ringkasan total event, direct fetch, needs recheck, dan quality score
- Tabel coverage per bulan
- Work queue bulan yang harus cross-check
- Export Validation CSV
- Live Display Feed, ICS export, backup JSON, dan otonan lokal tetap dipertahankan
- Icon mandala dan short name `KD-Bali` tetap dipakai

## Link setelah deploy

App:
`https://adp-kai-kalender-bali-app.vercel.app/?v=200&app=kd-bali-v200`

Display mode:
`https://adp-kai-kalender-bali-app.vercel.app/?v=200&app=kd-bali-v200&display=1`

Live feed sample:
`https://adp-kai-kalender-bali-app.vercel.app/?v=200&app=kd-bali-v200&feed=display&d=10/07/2026`

## Catatan validasi

Data awal tetap `digital_source_only`. Kolom `needsRecheck` menandai data yang harus diprioritaskan untuk cross-check dengan kalender Bali cetak/resmi, sumber adat setempat, atau pemangku sebelum dipakai untuk keputusan adat penting.


## Phase 2.1 - Family Adat Memory System

Update ini menambahkan fondasi local-first untuk mencatat adat keluarga:

- Merajan / Sanggah Profile
- Pelinggih Registry
- Catatan Keputusan Adat
- Banten & Sarana Template awal
- Export Adat Memory JSON
- Integrasi awal event piodalan merajan ke kalender 2026

Catatan: data masih tersimpan lokal di browser/PWA dan siap dimigrasikan ke Cloud Sync setelah Firebase Authentication + Firestore disiapkan. KD-Bali tidak menjadi standar tunggal adat; app mencatat versi keluarga dan sumber validasi.


## Phase 2.2 - Cloud Sync Foundation

Update ini menambahkan fondasi sinkronisasi cloud tanpa mengaktifkan Firebase real terlebih dahulu:

- Profil sync user/family berbasis email dan familyId
- Export Cloud Seed JSON untuk migrasi manual / persiapan Firestore
- Import Cloud Seed JSON agar data bisa dipindahkan ke perangkat lain sebelum login real aktif
- Backup JSON sekarang mencakup otonan, Adat Memory, dan profil sync lokal
- Schema path Firestore-ready: users/{uid}, families/{familyId}, members, adatPlaces, shrines, adatDecisions, bantenTemplates, eventInstances
- File schema teknis: `data/firebaseSync.schema.json`

Catatan: Phase 2.2 masih local-first. Login Google/email dan sinkron otomatis lintas perangkat akan membutuhkan Firebase project config, Firebase Auth, Firestore rules, dan migration flow pada phase berikutnya.

Link setelah deploy:
`https://adp-kai-kalender-bali-app.vercel.app/?v=220&app=kd-bali-v220`


## Phase 2.3 - Banten & Sarana Checklist Engine

Update ini menambahkan checklist banten/sarana per event adat keluarga:

- Pilih event piodalan merajan/sanggah 2026
- Pilih template umum: Piodalan Merajan Alit atau Ageng
- Generate checklist lokal per event
- Centang item persiapan satu per satu
- Tambah item khusus versi keluarga
- Export Banten Checklist CSV
- Backup JSON, Adat Memory export, dan Cloud Seed JSON sekarang menyertakan `eventChecklists`
- Display feed menampilkan ringkasan checklist untuk event adat pada tanggal yang dipilih

Catatan: template banten/sarana tetap bersifat contoh umum dan harus dikonfirmasi mengikuti tradisi keluarga, pemangku, tetua, desa adat, atau griya. KD-Bali mencatat versi keluarga, bukan menetapkan standar tunggal adat.

Link setelah deploy:
`https://adp-kai-kalender-bali-app.vercel.app/?v=230&app=kd-bali-v230`


## Phase 2.4 - Arsip Upacara & Biaya/Tugas Adat

Update ini menambahkan modul arsip pelaksanaan upacara keluarga:

- Arsip Upacara per event piodalan merajan/sanggah
- Catatan status: planned, selesai, perlu review, family confirmed
- Catatan estimasi/realisasi biaya
- Catatan pembagian tugas keluarga
- Catatan pelaksanaan dan evaluasi untuk upacara berikutnya
- Catatan sumber/konfirmasi: pemangku, tetua keluarga, serati, griya, kalender cetak, atau desa adat
- Export Arsip Upacara CSV
- Backup JSON, Adat Memory export, dan Cloud Seed JSON menyertakan `ceremonyArchives`
- Schema teknis baru: `data/ceremonyArchive.schema.json`

Catatan: Arsip Upacara adalah memori adat keluarga/private. KD-Bali tetap tidak menjadi hakim adat atau standar tunggal.

Link setelah deploy:
`https://adp-kai-kalender-bali-app.vercel.app/?v=240&app=kd-bali-v240`
