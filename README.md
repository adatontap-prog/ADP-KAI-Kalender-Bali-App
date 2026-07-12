# ADP KAI Kalender Bali Digital — Phase 2.5.2

## Firestore Seed Sync Pilot

Update ini menambahkan pilot sync cloud paling aman:

- Firebase Auth Pilot tetap ada.
- Firestore Seed Sync Pilot ditambahkan di Pengaturan.
- Data keluarga/adat bisa di-upload sebagai satu Cloud Seed.
- Di HP baru: login Google, ambil seed, restore ke browser.
- Belum real-time sync penuh dan belum struktur subcollection final.

Cloud path pilot:

`users/{uid}/families/{familyId}/cloudSeeds/latest`

Commit:

`ADP KAI Kalender Bali Digital phase 2.5.2 - Firestore Seed Sync Pilot`
