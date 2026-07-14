# ADP KAI Kalender Bali Digital — Phase 2.6.12

Phase 2.6.12 menambahkan **Manual Local Restore Pilot**.

## Fokus

- Terapkan kandidat cloud dari Structured Restore Preview ke data lokal browser secara manual.
- Wajib backup sebelum restore.
- Wajib checkbox konfirmasi eksplisit.
- Tidak ada write Firestore.
- Tidak ada real-time sync.
- Tidak ada auto-sync.
- Tidak ada silent overwrite.

## Cara deploy

1. Copy semua isi folder ke repo `ADP-KAI-Kalender-Bali-App`.
2. Replace file lama.
3. Commit:

```txt
ADP KAI Kalender Bali Digital phase 2.6.12 - Manual Local Restore Pilot
```

4. Push origin.
5. Buka:

```txt
https://adp-kai-kalender-bali-app.vercel.app/?v=272&app=kd-bali-v272
```

## Urutan test aman

1. Jalankan Cloud Pull Preview.
2. Jalankan Structured Restore Preview.
3. Tandai Restore Preview Aman.
4. Masuk Pengaturan → Manual Local Restore Pilot.
5. Preview Manual Restore Plan.
6. Download Backup Sebelum Restore.
7. Centang konfirmasi.
8. Execute Manual Local Restore.
9. Cek Otonan, Adat Keluarga, Kalender.
10. Export Restore Report.
