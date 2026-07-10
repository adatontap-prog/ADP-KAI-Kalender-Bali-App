# ADP KAI Kalender Bali Digital — PWA v0.4 / Phase 1.4

Status: Phase 1.4 pusat reminder + display mode.

## Isi Phase 1.4

- Semua fitur Phase 1.3 tetap ada.
- Pusat reminder dengan label Hari-H, H-1, H-3, H-7, H-30.
- Ringkasan status: agenda hari ini, reminder terdekat, status notifikasi, mode display.
- Mode Display untuk meja/tablet: fokus tampilan kalender dan reminder, form input disembunyikan.
- Tombol tes notifikasi memakai reminder terdekat sebagai isi notifikasi.
- Data otonan lokal tetap tersimpan di browser/HP.
- Cache service worker dinaikkan ke v1.4.

## Marker UI

- Purnama: titik merah.
- Tilem: titik hitam.
- Rerainan/Hari Raya: titik emas.
- Otonan keluarga: titik hijau.

## Catatan validasi

Data kalender awal berstatus `digital_source_only` dan perlu cross-check adat. Untuk keputusan adat/upacara penting, tetap verifikasi dengan kalender Bali cetak/resmi, sumber adat setempat, atau pemangku.

## Privasi mockup publik

Untuk demo publik, gunakan placeholder:

- Anggota Keluarga 1
- Anggota Keluarga 2
- Anak 1
- User 1

Jangan tampilkan identitas keluarga asli pada mockup publik.

## Deploy

Upload seluruh isi folder ke repo aktif:

`adatontap-prog / ADP-KAI-Kalender-Bali-App`

Commit:

`ADP KAI Kalender Bali Digital phase 1.4 - Reminder center and display mode`

Setelah push ke GitHub, Vercel akan auto-deploy.

## Test lokal

```bash
python -m http.server 5173
```

Buka:

`http://localhost:5173`

Untuk mode display langsung:

`http://localhost:5173/?display=1`
