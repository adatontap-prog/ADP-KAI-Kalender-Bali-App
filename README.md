# ADP KAI Kalender Bali Digital — Phase 2.6.11

Phase 2.6.11 menambahkan **Structured Restore Preview**.

## Fokus
- Membaca dokumen Firestore subcollection final secara penuh.
- Membuat kandidat restore lokal: anggota keluarga, Merajan/Sanggah, Pelinggih, keputusan adat, template banten, checklist, dan arsip upacara.
- Membandingkan hitungan data lokal dengan kandidat data cloud.
- Export Restore Preview Report TXT.
- Menandai Restore Preview aman sebagai gate sebelum Manual Local Restore Pilot.

## Policy
Preview only. Tidak ada overwrite localStorage, tidak ada write Firestore, tidak ada auto-sync, tidak ada listener real-time, dan tidak ada silent restore. Restore aktual harus masuk phase terpisah dengan backup lokal dan checkbox konfirmasi eksplisit.

## Commit
ADP KAI Kalender Bali Digital phase 2.6.11 - Structured Restore Preview
