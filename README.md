# ADP KAI Kalender Bali Digital — Phase 2.6.8

Phase 2.6.8 menambahkan **Actual Write Pilot Manual**.

## Fokus
- Menulis data lokal ke Firestore subcollection final secara manual dan terbatas.
- Berbasis hasil Dry Run Subcollection Writer.
- Wajib Firebase Config, login Google, backup lokal, dry-run gate, path unik, dan konfirmasi checkbox.
- Write menggunakan `setDoc(..., { merge: true })` agar tidak silent destructive overwrite.
- Semua aksi masuk Sync Log.
- Real-time sync masih belum aktif.

## Policy
Manual actual write only. Tidak ada listener real-time, tidak ada auto-sync, dan tidak ada overwrite diam-diam. Phase ini untuk pilot write pertama sebelum desain sync otomatis.

## Commit
ADP KAI Kalender Bali Digital phase 2.6.8 - Actual Write Pilot Manual


## Phase 2.6.9 — Actual Write Readback Verification

Update ini menambahkan panel **Actual Write Readback Verification** di menu Pengaturan.

Fungsi utama:
- Membaca ulang dokumen Firestore hasil Actual Write Pilot Manual.
- Membandingkan target Dry Run Payload dengan dokumen cloud yang ditemukan.
- Menandai missing docs, field mismatch, dan dokumen tanpa `_syncMeta`.
- Export Readback Verification Report TXT.
- Menandai readback aman sebagai gate sebelum phase read/write guard berikutnya.

Policy tetap aman:
- Tidak ada real-time sync.
- Tidak ada auto-sync.
- Tidak ada restore lokal.
- Tidak ada write tambahan dari panel readback.
- Tidak ada silent overwrite.


## Phase 2.6.10 — Cloud Pull Preview & Conflict Guard

Update ini menambahkan panel **Structured Cloud Pull Preview** di menu Pengaturan.

Fungsi utama:
- Membaca struktur Firestore final hasil Actual Write Pilot secara read-only.
- Membandingkan cloud docs dengan Dry Run Payload dan data lokal.
- Menandai missing path, extra path, dan dokumen tanpa `_syncMeta`.
- Export Cloud Pull Preview Report TXT.
- Menandai Pull Preview aman sebagai gate sebelum restore preview berbasis subcollection.

Policy tetap aman:
- Tidak ada write Firestore.
- Tidak ada restore ke localStorage.
- Tidak ada auto-sync.
- Tidak ada real-time listener.
- Tidak ada silent overwrite.
