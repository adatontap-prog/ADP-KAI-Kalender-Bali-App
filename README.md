# ADP KAI Kalender Bali Digital — PWA v0.3 / Phase 1.3

Status: Phase 1.3 input otonan keluarga + reminder list lokal.

## Isi Phase 1.3

- Kalender Bali 2026 dari dataset digital source.
- Format tanggal `dd/mm/yyyy`.
- Layout mobile tidak terpotong.
- Purnama: titik merah.
- Tilem: titik hitam.
- Rerainan/Hari Raya: titik emas.
- Otonan keluarga: titik hijau.
- Form tambah/update otonan keluarga.
- Data otonan tersimpan di `localStorage` browser HP.
- Reminder terdekat menggabungkan event kalender dan otonan keluarga.

## Catatan validasi

Data kalender awal berstatus `digital_source_only` dan perlu cross-check adat. Untuk keputusan adat/upacara penting, tetap verifikasi dengan kalender Bali cetak/resmi, sumber adat setempat, atau pemangku.

## Privasi mockup publik

Untuk demo publik, gunakan placeholder:

- Anggota Keluarga 1
- Anggota Keluarga 2
- Anak 1
- User 1

Jangan tampilkan identitas keluarga asli pada mockup publik.

## Cara deploy

Upload seluruh isi folder ke repo GitHub aktif:

`adatontap-prog / ADP-KAI-Kalender-Bali-App`

Commit:

`ADP KAI Kalender Bali Digital phase 1.3 - Otonan family input and reminder list`

Setelah push ke GitHub, Vercel akan auto-deploy.

## Test lokal

```bash
python -m http.server 5173
```

Buka:

`http://localhost:5173`
