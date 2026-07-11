# ADP KAI Kalender Bali Digital — PWA v0.4.4 / Phase 1.4.4

Patch: install helper + Tilem contrast + KD-Bali short name + forced manifest/icon refresh.

## Perubahan
- Tombol `Install App` selalu terlihat. Jika browser tidak memunculkan prompt otomatis, tombol akan memberi panduan install manual.
- Simbol Tilem/titik hitam diberi border/glow agar lebih kontras di Mode Tablet.
- `short_name` PWA diganti menjadi `KD-Bali`.
- Manifest baru: `manifest-v144.webmanifest`.
- Icon versi baru: `icon-192-v144.png`, `icon-512-v144.png`, `favicon-48-v144.png`, `apple-touch-icon-v144.png`.
- Service worker cache: `v1-4-4`.

## Deploy
Upload seluruh isi folder ini ke repo aktif `ADP-KAI-Kalender-Bali-App`, commit, push, lalu tunggu Vercel Ready.

## Test
Buka:
`/?v=144&app=kd-bali-v144`

Jika icon home screen masih lama, uninstall app lama dari Android Settings → Apps, lalu install ulang dari Chrome.
