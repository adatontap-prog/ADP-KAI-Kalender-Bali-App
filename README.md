ADP KAI Kalender Bali Digital / KD-Bali
Phase 2.5 - Firebase Setup Kit

Update ini menyiapkan tahap sebelum login email/Google real:
- Firebase web config form di Pengaturan
- Simpan config lokal
- Export Firebase Config JSON
- Copy ENV untuk migrasi build app nanti
- Cloud Readiness Gate sekarang mengarahkan ke Firebase Setup saat data inti sudah siap

Catatan: Phase ini belum mengaktifkan Firebase Auth/Firestore real. Login real dilakukan setelah Firebase project config dan security rules siap.


## Phase 2.5.1 — Firebase Auth Pilot

- Adds a Firebase Auth Pilot panel in Pengaturan.
- Uses locally saved Firebase web config.
- Tests Google login only.
- Does not write family/adat data to Firestore yet.
- Successful login updates local Sync Profile email/familyId.
- Next phase can add Firestore write guardrails after Auth is confirmed.
