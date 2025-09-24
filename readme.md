# Kalkulator BMI - Analisis Kesehatan Komprehensif

Aplikasi web kalkulator BMI (Body Mass Index) dengan analisis kesehatan yang mendalam dan standar medis yang ketat. Dilengkapi dengan mode gelap, unit converter, dan rekomendasi kesehatan yang personal.

## Fitur Utama

### Perhitungan BMI Akurat
- Perhitungan BMI dengan presisi tinggi (2 desimal)
- Klasifikasi berdasarkan standar WHO dengan kategori tambahan
- Gauge visual dengan pointer interaktif untuk menampilkan posisi BMI

### Converter Unit Otomatis
- **Berat badan**: Kilogram ⇄ Pounds (lbs)
- **Tinggi badan**: Sentimeter ⇄ Kaki/Inci (feet/inches)
- Konversi real-time saat mengubah unit

### Analisis Kesehatan Mendalam
- **Estimasi lemak tubuh** berdasarkan formula Deurenberg yang disesuaikan dengan usia dan gender
- **Rentang berat ideal** dengan standar BMI 20-23 untuk kesehatan optimal
- **Penilaian risiko kesehatan** berlevel dengan pertimbangan faktor usia

### Simulator Berat Target
- Slider interaktif untuk melihat perubahan BMI dengan berat berbeda
- Pratinjau kategori BMI untuk setiap berat target
- Membantu perencanaan target berat badan yang realistis

### Mode Gelap/Terang
- Toggle mode gelap dengan animasi smooth
- Kontras yang dioptimalkan untuk keterbacaan
- Penyimpanan preferensi pengguna

### Responsive Design
- Layout adaptif untuk desktop, tablet, dan mobile
- Grid system yang fleksibel
- Touch-friendly controls untuk perangkat mobile

## Kategori BMI yang Didukung

| BMI Range | Kategori | Risiko Kesehatan |
|-----------|----------|------------------|
| < 16.0 | Sangat Kurus | Sangat Tinggi |
| 16.0 - 18.4 | Kurus | Sedang |
| 18.5 - 24.9 | Normal | Minimal |
| 25.0 - 29.9 | Berat Berlebih | Sedang |
| 30.0 - 34.9 | Obesitas Tingkat 1 | Tinggi |
| 35.0 - 39.9 | Obesitas Tingkat 2 | Sangat Tinggi |
| ≥ 40.0 | Obesitas Tingkat 3 (Morbid) | Sangat Tinggi |

## Struktur Proyek

```
bmi-calculator/
│
├── index.html          # Struktur HTML utama
├── style.css           # Stylesheet dengan CSS custom properties
├── script.js           # Logic JavaScript dengan validasi ketat
└── README.md          # Dokumentasi proyek
```

## Cara Penggunaan

1. **Clone atau download** repository ini
2. **Buka** `index.html` di browser modern
3. **Masukkan data**:
   - Berat badan (20-300 kg atau setara)
   - Tinggi badan (100-250 cm atau setara)
   - Usia (opsional, untuk estimasi lemak tubuh)
   - Jenis kelamin (untuk akurasi perhitungan)
4. **Klik** tombol "Hitung BMI & Analisis"
5. **Lihat hasil** lengkap dengan rekomendasi medis

## Fitur Lanjutan

### Validasi Input Ketat
- Rentang berat: 20-300 kg (standar medis)
- Rentang tinggi: 100-250 cm (akurasi perhitungan)
- Error handling dengan pesan yang informatif

### Analisis Kontekstual
- Peringatan medis untuk BMI ekstrem
- Pertimbangan khusus untuk lansia (>65 tahun)
- Rekomendasi yang disesuaikan dengan kategori BMI

### Keyboard Shortcuts
- `Ctrl + Enter`: Hitung BMI
- `Ctrl + D`: Toggle mode gelap

### Penyimpanan Data
- Simpan hasil perhitungan ke localStorage
- Riwayat 5 perhitungan terakhir
- Ekspor data dalam format yang mudah dibaca

## Teknologi yang Digunakan

- **HTML5**: Struktur semantik dan form validation
- **CSS3**: 
  - CSS Custom Properties (CSS Variables)
  - Grid Layout dan Flexbox
  - Smooth animations dan transitions
  - Responsive breakpoints
- **Vanilla JavaScript**: 
  - ES6+ features
  - Event handling yang efisien
  - DOM manipulation optimized
  - Form validation real-time

## Konfigurasi & Kustomisasi

### CSS Custom Properties
Aplikasi menggunakan CSS variables untuk memudahkan kustomisasi:

```css
:root {
    --bg-primary: #ffffff;
    --text-primary: #212529;
    --accent-color: #007bff;
    --success-color: #28a745;
}
```

### JavaScript Configuration
Konstanta penting yang dapat disesuaikan:

```javascript
let currentWeightUnit = 'kg';
let currentHeightUnit = 'cm';

const WEIGHT_MIN = 20; // kg
const WEIGHT_MAX = 300; // kg
const HEIGHT_MIN = 100; // cm
const HEIGHT_MAX = 250; // cm
```

## Akurasi Medis

### Formula BMI
```
BMI = Berat (kg) / (Tinggi (m))²
```

### Estimasi Lemak Tubuh (Deurenberg Formula)
```
Pria: BF% = (1.20 × BMI) + (0.23 × Usia) - 16.2
Wanita: BF% = (1.20 × BMI) + (0.23 × Usia) - 5.4
```

### Rentang Berat Ideal
Menggunakan BMI 20.0-23.0 sebagai standar optimal untuk kesehatan jangka panjang.

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Opera 47+

## Disclaimer Medis

**Penting**: Aplikasi ini hanya untuk tujuan informasi dan edukasi. Hasil perhitungan tidak menggantikan konsultasi medis profesional. Untuk evaluasi kesehatan yang akurat, selalu konsultasikan dengan dokter atau tenaga medis yang berkualifikasi.

## Lisensi

Proyek ini bersifat open source dan dapat digunakan untuk tujuan edukasi dan non-komersial.

## Kontribusi

Kontribusi untuk peningkatan aplikasi sangat diterima:

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

---