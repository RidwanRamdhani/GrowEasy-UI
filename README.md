Aesthetic yang dipake: Biopunk / Organic-Digital — hitam hijau toska + amber, typo Syne + DM Mono + Lora, efek glowing sama animasi pulse
Yang udah dibuat:
Landing Page — Hero orb animasi 3-ring pulse, parallax mouse tracking buat blob background, statistik platform, sama CTA
Auth Page (Login/Register) — Form toggle tab, efek radial glow di background
Dashboard — Sidebar navigasi sticky, card "Start Analyze" gradient biopunk, stats grid, preview analisis ahkir
Analyze Page — flow 5 langkah animasi (GPS → Fetch API → Python ML → Gen AI → Done) progress bar glowing, dot-pulse indicator per step, hasil nanti muncul pake ScoreRing SVG animasi + chat AI real-time
History Page — Kartu accordion per analisis, expand buat liat detail soil/weather, AI summary, sama riwayat chat yang udah dikunci sama badge "🔒 Sesi chat ini telah berakhir."

## Untuk integrasi backend, tinggal ganti fungsi sleep() di startAnalysis() sama actual APInya calls ke endpoint-endpoint (GPS → Soil API → Weather API → Python endpoint → Gen AI endpoint)
