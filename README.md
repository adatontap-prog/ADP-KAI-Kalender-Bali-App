# ADP KAI Kalender Bali Digital — PWA v0.4.1 / Phase 1.4.1

Patch: auto set tanggal sesuai hari ini di device, format dd/mm/yyyy, dan icon app HP baru.

## Perubahan
- Default tanggal memakai tanggal lokal perangkat. Jika tahun berjalan 2026, kalender langsung membuka tanggal hari ini.
- Query override tetap bisa: `?date=2026-07-11` atau `?d=11/07/2026`.
- Icon app HP diperbarui: simbol kalender Bali `KB`, titik Purnama merah, Tilem hitam, Rerainan emas, Otonan hijau.
- Manifest `start_url` dinaikkan ke `v=141`.
- Cache service worker dinaikkan ke `v1-4-1`.

## Deploy
Upload semua isi folder ke repo aktif `adatontap-prog/ADP-KAI-Kalender-Bali-App`, commit, lalu push origin.

Commit:
`ADP KAI Kalender Bali Digital phase 1.4.1 - Auto today and app icon refresh`
