# ADP KAI Kalender Bali Digital — Phase 2.6.5

## Phase
Cloud Sync Real Blueprint before implementation.

## Isi update
- Tambah panel Cloud Sync Real Blueprint di Pengaturan.
- Memetakan struktur Firestore target berbasis user/family/subcollection.
- Menetapkan conflict policy: tidak ada silent overwrite, wajib review, backup sebelum restore, sync log, dan rollback path.
- Export Blueprint TXT dan Copy Blueprint.
- Menambah schema: data/cloudSyncRealBlueprint.schema.json.
- Service worker cache naik ke v2.6.5.

## Policy
Real-time sync penuh belum diaktifkan. Manual Cloud Seed tetap menjadi mode aman sampai dry-run subcollection writer diuji.

## Commit
ADP KAI Kalender Bali Digital phase 2.6.5 - Cloud Sync Real Blueprint
