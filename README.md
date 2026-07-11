# ADP KAI Kalender Bali Digital — Phase 1.8

Phase 1.8 menambahkan **Export Kalender ICS + Display Feed JSON** di atas backup lokal dan Otonan Engine v2.

## Fitur baru

- Export kalender 2026 ke file `.ics`.
- File `.ics` bisa diimpor manual ke Google Calendar / Apple Calendar / Outlook.
- Export Display JSON untuk tanggal yang sedang dipilih.
- Display JSON menjadi jembatan awal untuk tablet dashboard, ESP32, dan e-paper.
- Export backup JSON dan jadwal otonan CSV tetap tersedia.
- Otonan tetap tampil sebagai titik hijau di kalender.
- Purnama titik merah, Tilem titik hitam dengan highlight kontras, rerainan titik emas.
- Short name tetap `KD-Bali`.
- Icon mandala tetap digunakan.
- Service worker cache: v1.8.

## Catatan penting

Data kalender awal masih `digital_source_only`. Untuk keputusan adat/upacara penting, tetap verifikasi dengan kalender Bali cetak/resmi, sumber adat setempat, atau pemangku.

## Deploy

Upload seluruh isi folder ini ke repo aktif:

```txt
ADP-KAI-Kalender-Bali-App
```

Commit:

```txt
ADP KAI Kalender Bali Digital phase 1.8 - ICS export and display feed
```

Setelah Vercel `Ready`, buka:

```txt
https://adp-kai-kalender-bali-app.vercel.app/?v=180&app=kd-bali-v180
```
