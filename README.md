# ADP KAI Kalender Bali Digital — PWA v0.6 / Phase 1.6

Status: Phase 1.6 Otonan Engine v2.

## Isi update
- Input otonan bisa dari tanggal lahir Gregorian.
- Input otonan bisa dari hari Bali langsung: Saptawara, Pancawara, Wuku.
- Catatan batas hari Bali: pergantian hari mengikuti terbit matahari, bukan jam 24:00.
- Untuk input Gregorian, tersedia opsi lahir sebelum matahari terbit. Jika ya, `effectiveBaliDate` dicatat sebagai tanggal sebelumnya.
- Untuk input Hari Bali langsung, tanggal otonan acuan tetap diminta agar MVP bisa menandai semua jatuh otonan di kalender 2026.
- Otonan dicatat otomatis pada setiap tanggal jatuhnya di kalender sebagai titik hijau dan event lokal keluarga.
- Short name tetap `KD-Bali`.
- Icon mandala tetap dipakai.
- Service worker cache naik ke v1.6.

## Validasi
Data awal kalender tetap berstatus `digital_source_only`. Otonan adalah data lokal keluarga dan perlu verifikasi dengan catatan keluarga, kalender Bali cetak/resmi, sumber adat setempat, atau pemangku untuk keputusan adat penting.

## Deploy
Upload isi folder ke repo `ADP-KAI-Kalender-Bali-App`, commit, push, lalu tunggu Vercel auto-deploy.

Commit:
`ADP KAI Kalender Bali Digital phase 1.6 - Otonan Engine v2 Gregorian Bali input sunrise boundary`
