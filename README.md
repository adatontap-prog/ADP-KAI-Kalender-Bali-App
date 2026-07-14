# ADP KAI Kalender Bali Digital — Phase 2.6.14

Phase 2.6.14 menambahkan **Pilot Stable Baseline Gate**.

## Fokus

- Mengunci milestone cloud pilot setelah write/readback/pull/restore/verification aman.
- Menampilkan score stable baseline.
- Export baseline report TXT.
- Tetap aman: tidak ada Firestore write, tidak ada restore localStorage, tidak ada auto-sync, tidak ada real-time listener.

## Cara deploy

1. Copy semua isi folder ke repo `ADP-KAI-Kalender-Bali-App`.
2. Replace file lama.
3. Commit:

```txt
ADP KAI Kalender Bali Digital phase 2.6.14 - Pilot Stable Baseline Gate
```

4. Push origin.
5. Buka:

```txt
https://adp-kai-kalender-bali-app.vercel.app/?v=274&app=kd-bali-v274
```

## Urutan test aman

1. Pastikan Actual Write Pilot pernah sukses.
2. Pastikan Readback Verification aman.
3. Pastikan Cloud Pull Preview aman.
4. Pastikan Structured Restore Preview aman.
5. Pastikan Manual Local Restore pernah dieksekusi.
6. Pastikan Post-Restore Verification valid.
7. Masuk Pengaturan → Pilot Stable Baseline.
8. Refresh Baseline Gate.
9. Jika score aman, Lock Pilot Stable Baseline.
10. Export Baseline Report TXT.
