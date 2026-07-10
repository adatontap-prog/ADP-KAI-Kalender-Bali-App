# ADP KAI Kalender Bali Digital — PWA v0.2 / Phase 1.2

Status: Phase 1.2 data foundation + mockup web integration.

## Isi
- `index.html` — mockup kalender meja/dinding, mode e-paper/tablet, installable PWA.
- `data/events.2026.json` — dataset event/rerainan 2026.
- `data/calendarDraft.2026.csv` — format impor/cek untuk tab Calendar Draft.
- `data/rerainanSourceIntake.2026.csv` — format intake sumber digital.
- `data/dataCoverage.2026.json` — ringkasan coverage per bulan.
- `data/familyMembers.sample.json` — placeholder anonim: Anggota Keluarga 1, Anggota Keluarga 2, Anak 1, User 1.

## Marker UI
- Purnama: titik merah.
- Tilem: titik hitam.
- Rerainan/Hari Raya lain: titik emas.

## Validasi
Data awal berstatus `digital_source_only`. Beberapa bulan yang gagal direct-fetch diberi status `needs_direct_source_recheck`. Untuk keputusan adat/upacara penting, tetap verifikasi dengan kalender Bali cetak/resmi, pemangku, atau sumber adat setempat.

## Test lokal
```bash
python -m http.server 5173
```
Buka `http://localhost:5173`.

## Deploy
Upload isi folder ke GitHub/Vercel. Setelah HTTPS aktif, buka di Chrome Android lalu pilih Install/Add to Home Screen.
