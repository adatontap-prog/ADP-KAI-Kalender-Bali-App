# ADP KAI Kalender Bali Digital — Phase 2.6.1

Phase 2.6.1 menambahkan Auto Backup Reminder / Backup Discipline:
- panel Backup Discipline di Hari Ini dan Pengaturan
- skor umur backup lokal, Cloud Seed, baseline hardening, dan restore review
- tombol Export Backup JSON dari panel reminder
- Export Backup Discipline Report TXT
- status review backup discipline lokal
- schema data/autoBackupReminder.schema.json

Catatan: real-time multi-device sync belum diaktifkan. Policy tetap: backup lokal dulu → Cloud Seed manual → review restore → hardening → baru desain sync real.
