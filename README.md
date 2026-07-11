# ADP KAI Kalender Bali Digital — Phase 2.0

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
