// Global variables
let currentWeightUnit = 'kg';
let currentHeightUnit = 'cm';
let currentData = {};

// Unit conversion functions
function kgToLbs(kg) {
    return kg * 2.20462;
}

function lbsToKg(lbs) {
    return lbs / 2.20462;
}

function cmToFeet(cm) {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return { feet, inches };
}

function feetToCm(feet, inches) {
    return (feet * 12 + inches) * 2.54;
}

// Toggle functions
function toggleWeightUnit() {
    const weightInput = document.getElementById('weight');
    const unitButton = document.getElementById('weight-unit');
    const currentValue = parseFloat(weightInput.value) || 0;

    if (currentWeightUnit === 'kg') {
        // Convert to lbs
        weightInput.value = currentValue > 0 ? kgToLbs(currentValue).toFixed(1) : '';
        unitButton.textContent = 'lbs';
        currentWeightUnit = 'lbs';
    } else {
        // Convert to kg
        weightInput.value = currentValue > 0 ? lbsToKg(currentValue).toFixed(1) : '';
        unitButton.textContent = 'kg';
        currentWeightUnit = 'kg';
    }
}

function toggleHeightUnit() {
    const heightInput = document.getElementById('height');
    const heightInchesInput = document.getElementById('height-inches');
    const unitButton = document.getElementById('height-unit');
    const currentValue = parseFloat(heightInput.value) || 0;

    if (currentHeightUnit === 'cm') {
        // Convert to feet/inches
        if (currentValue > 0) {
            const feetInches = cmToFeet(currentValue);
            heightInput.value = Math.floor(feetInches.feet);
            heightInchesInput.value = feetInches.inches.toFixed(1);
        } else {
            heightInput.value = '';
            heightInchesInput.value = '';
        }
        heightInput.setAttribute('placeholder', 'Kaki');
        heightInchesInput.style.display = 'block';
        unitButton.textContent = 'ft/in';
        currentHeightUnit = 'ft';
    } else {
        // Convert to cm
        const feet = parseFloat(heightInput.value) || 0;
        const inches = parseFloat(heightInchesInput.value) || 0;
        if (feet > 0 || inches > 0) {
            heightInput.value = feetToCm(feet, inches).toFixed(1);
        } else {
            heightInput.value = '';
        }
        heightInput.setAttribute('placeholder', '');
        heightInchesInput.style.display = 'none';
        unitButton.textContent = 'cm';
        currentHeightUnit = 'cm';
    }
}

// Strict BMI calculation with higher precision
function calculateBMI(weightKg, heightCm) {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return parseFloat(bmi.toFixed(2));
}

// Medical-grade body fat estimation with age and gender consideration
function estimateBodyFat(bmi, age, gender) {
    if (!age || age < 10) return null;
    
    let bodyFat;
    // Enhanced Deurenberg formula with more precision
    if (gender === 'male') {
        bodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
        // Adjustment for very lean or muscular men
        if (bmi < 20 && age < 30) bodyFat -= 2;
    } else if (gender === 'female') {
        bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
        // Women naturally have higher body fat
        if (age > 40) bodyFat += 1;
    } else {
        // Average calculation
        bodyFat = (1.20 * bmi) + (0.23 * age) - 10.8;
    }
    
    return Math.max(3, Math.min(50, parseFloat(bodyFat.toFixed(1))));
}

// Strict BMI category classification (WHO + additional precision)
function getBMICategory(bmi) {
    if (bmi < 16) return { category: 'severely-underweight', text: 'Sangat Kurus', risk: 'very-high' };
    if (bmi < 18.5) return { category: 'underweight', text: 'Kurus', risk: 'moderate' };
    if (bmi < 25) return { category: 'normal', text: 'Normal', risk: 'minimal' };
    if (bmi < 30) return { category: 'overweight', text: 'Berat Berlebih', risk: 'moderate' };
    if (bmi < 35) return { category: 'obese-1', text: 'Obesitas Tingkat 1', risk: 'high' };
    if (bmi < 40) return { category: 'obese-2', text: 'Obesitas Tingkat 2', risk: 'very-high' };
    return { category: 'obese-3', text: 'Obesitas Tingkat 3 (Morbid)', risk: 'very-high' };
}

// More accurate ideal weight calculation based on strict medical standards
function calculateIdealWeightRange(heightCm) {
    const heightM = heightCm / 100;
    // Stricter range: 20-23 BMI for optimal health
    const minWeight = 20.0 * (heightM * heightM);
    const maxWeight = 23.0 * (heightM * heightM);
    return { min: minWeight, max: maxWeight };
}

// Health risk assessment
function getHealthRisk(bmi, age, gender) {
    const category = getBMICategory(bmi);
    let riskLevel = category.risk;
    
    // Age adjustments
    if (age > 65) {
        if (bmi >= 22 && bmi <= 27) riskLevel = 'minimal'; // Elderly can tolerate slightly higher BMI
    }
    
    return {
        level: riskLevel,
        description: getHealthRiskDescription(riskLevel, bmi)
    };
}

function getHealthRiskDescription(riskLevel, bmi) {
    switch (riskLevel) {
        case 'minimal':
            return 'Risiko Minimal';
        case 'low':
            return 'Risiko Rendah';
        case 'moderate':
            return 'Risiko Sedang';
        case 'high':
            return 'Risiko Tinggi';
        case 'very-high':
            return 'Risiko Sangat Tinggi';
        default:
            return 'Tidak Diketahui';
    }
}

// Animate number counter
function animateNumber(elementId, startValue, endValue, duration = 1000) {
    const element = document.getElementById(elementId);
    const increment = (endValue - startValue) / (duration / 16);
    let currentValue = startValue;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if ((increment > 0 && currentValue >= endValue) || (increment < 0 && currentValue <= endValue)) {
            currentValue = endValue;
            clearInterval(timer);
        }
        element.textContent = currentValue.toFixed(1);
    }, 16);
}

// Update BMI gauge pointer with more precision
function updateBMIGauge(bmi) {
    const pointer = document.getElementById('bmi-pointer');
    // More precise BMI scale mapping
    let position;
    
    if (bmi <= 16) position = 0;
    else if (bmi <= 18.5) position = ((bmi - 16) / (18.5 - 16)) * 15;
    else if (bmi <= 25) position = 15 + ((bmi - 18.5) / (25 - 18.5)) * 45;
    else if (bmi <= 30) position = 60 + ((bmi - 25) / (30 - 25)) * 15;
    else if (bmi <= 35) position = 75 + ((bmi - 30) / (35 - 30)) * 10;
    else if (bmi <= 40) position = 85 + ((bmi - 35) / (40 - 35)) * 10;
    else position = 95 + Math.min(((bmi - 40) / 10) * 5, 5);
    
    position = Math.max(0, Math.min(100, position));
    pointer.style.left = position + '%';
}

// Generate strict contextual analysis
function generateContextualAnalysis(data) {
    const { bmi, category, age, gender, healthRisk } = data;
    let analysis = `<h3>📊 Analisis Medis</h3>`;
    
    analysis += `<p><strong>BMI Anda: ${bmi}</strong> - ${category.text}</p>`;
    
    // Health risk assessment
    analysis += `<div class="health-risk risk-${healthRisk.level}">
        <strong>⚠️ ${healthRisk.description}</strong>
    </div>`;
    
    // Detailed medical interpretation
    if (bmi < 16) {
        analysis += `<div class="warning-message" style="border-color: var(--danger-color); background: #ffebee;">
            <strong>🚨 Peringatan Medis:</strong> BMI di bawah 16 menunjukkan kondisi sangat kurus yang berbahaya. 
            Segera konsultasi dengan dokter untuk evaluasi medis lengkap dan program peningkatan berat badan.
        </div>`;
    } else if (bmi < 18.5) {
        analysis += `<div class="warning-message">
            <strong>⚠️ Perhatian:</strong> Berat badan kurang dapat meningkatkan risiko osteoporosis, 
            gangguan sistem imun, dan masalah kesuburan. Konsultasi dengan ahli gizi dianjurkan.
        </div>`;
    } else if (bmi >= 25 && bmi < 30) {
        analysis += `<div class="warning-message">
            <strong>📊 Berat Berlebih:</strong> Risiko diabetes tipe 2, penyakit jantung, dan hipertensi mulai meningkat. 
            Penurunan 5-10% berat badan dapat memberikan manfaat kesehatan yang signifikan.
        </div>`;
    } else if (bmi >= 30) {
        analysis += `<div class="warning-message" style="border-color: var(--danger-color); background: #ffebee;">
            <strong>🚨 Obesitas:</strong> Risiko tinggi penyakit kardiovaskular, diabetes, sleep apnea, 
            dan berbagai jenis kanker. Segera konsultasi dengan tenaga medis untuk program penurunan berat yang aman.
        </div>`;
    }
    
    // Age-specific considerations
    if (age && age > 65) {
        if (bmi >= 22 && bmi <= 27) {
            analysis += `<div class="warning-message" style="border-color: var(--info-color);">
                <strong>👴 Pertimbangan Usia:</strong> Pada usia ${age} tahun, BMI sedikit lebih tinggi (22-27) 
                dapat memberikan perlindungan terhadap patah tulang dan infeksi.
            </div>`;
        }
    }
    
    return analysis;
}

// Generate strict recommendations
function generateRecommendations(data) {
    const { category, age, gender, bmi } = data;
    let recommendations = `<h3>📋 Rekomendasi Medis</h3>`;

    switch (category.category) {
        case 'severely-underweight':
        case 'underweight':
            recommendations += `
                <div style="border-left: 4px solid #1565c0; padding-left: 15px;">
                    <h4>🏥 Konsultasi Medis Prioritas:</h4>
                    <p style="background: #e3f2fd; padding: 10px; border-radius: 5px; margin: 10px 0;">
                        <strong>Penting:</strong> Segera konsultasi dengan dokter untuk evaluasi penyebab 
                        berat badan kurang dan kemungkinan kondisi medis yang mendasari.
                    </p>
                    <h4>🍽️ Strategi Nutrisi:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Tingkatkan asupan kalori dengan makanan padat nutrisi</li>
                        <li>Konsumsi 6-8 porsi kecil per hari</li>
                        <li>Fokus pada protein berkualitas: telur, ikan, daging tanpa lemak</li>
                        <li>Tambahkan lemak sehat: alpukat, kacang, minyak zaitun</li>
                    </ul>
                </div>`;
            break;

        case 'normal':
            recommendations += `
                <div style="border-left: 4px solid #2e7d32; padding-left: 15px;">
                    <h4>✅ Pertahankan Berat Ideal:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Pola makan seimbang: 50% karbohidrat, 20% protein, 30% lemak</li>
                        <li>Olahraga teratur: 150 menit/minggu intensitas sedang</li>
                        <li>Kombinasi latihan kardiovaskular dan kekuatan</li>
                        <li>Monitoring rutin berat badan dan komposisi tubuh</li>
                    </ul>
                </div>`;
            break;

        case 'overweight':
            recommendations += `
                <div style="border-left: 4px solid #ef6c00; padding-left: 15px;">
                    <h4>📉 Program Penurunan Berat:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Target penurunan: 0.5-1 kg per minggu</li>
                        <li>Defisit kalori: 300-500 kalori per hari</li>
                        <li>Olahraga: 250-300 menit/minggu untuk penurunan berat</li>
                        <li>Monitoring tekanan darah dan gula darah</li>
                    </ul>
                </div>`;
            break;

        case 'obese-1':
        case 'obese-2':
        case 'obese-3':
            recommendations += `
                <div style="border-left: 4px solid #d32f2f; padding-left: 15px;">
                    <h4>🏥 Intervensi Medis Diperlukan:</h4>
                    <p style="background: #ffebee; padding: 10px; border-radius: 5px; margin: 10px 0;">
                        <strong>Wajib:</strong> Konsultasi dengan tim medis (dokter, ahli gizi, psikolog) 
                        untuk program komprehensif dan aman.
                    </p>
                    <h4>🎯 Pendekatan Bertahap:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Target awal: 5-10% penurunan berat dalam 6 bulan</li>
                        <li>Evaluasi medis lengkap (jantung, diabetes, sleep apnea)</li>
                        <li>Pertimbangan terapi farmakologis atau bedah bariatrik</li>
                        <li>Dukungan psikologis dan perubahan perilaku</li>
                    </ul>
                </div>`;
            break;
    }

    recommendations += `
        <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #e8f5e8, #f3e5f5); border-radius: 8px;">
            <p><strong>💡 Prinsip Dasar:</strong> Perubahan gaya hidup yang berkelanjutan lebih efektif 
            daripada diet ekstrem. Fokus pada kesehatan jangka panjang, bukan hanya angka timbangan.</p>
        </div>`;

    return recommendations;
}

// Target weight simulator with strict BMI ranges
function updateTargetWeight(targetWeight) {
    const heightCm = getHeightInCm();
    if (!heightCm) return;

    const targetBMI = calculateBMI(parseFloat(targetWeight), heightCm);
    const targetCategory = getBMICategory(targetBMI);

    document.getElementById('target-weight-display').textContent = `${targetWeight} kg`;
    document.getElementById('target-bmi-display').textContent = `BMI: ${targetBMI}`;
    
    const categoryDisplay = document.getElementById('target-category-display');
    categoryDisplay.textContent = targetCategory.text;
    categoryDisplay.className = `bmi-category ${targetCategory.category}`;
}

// Get height in cm regardless of current unit
function getHeightInCm() {
    const heightInput = document.getElementById('height');
    const heightInchesInput = document.getElementById('height-inches');
    
    if (currentHeightUnit === 'cm') {
        const height = parseFloat(heightInput.value);
        return height || null;
    } else {
        const feet = parseFloat(heightInput.value) || 0;
        const inches = parseFloat(heightInchesInput.value) || 0;
        if (feet === 0 && inches === 0) return null;
        return feetToCm(feet, inches);
    }
}

// Get weight in kg regardless of current unit
function getWeightInKg() {
    const weight = parseFloat(document.getElementById('weight').value);
    if (!weight) return null;
    return currentWeightUnit === 'kg' ? weight : lbsToKg(weight);
}

// Enhanced form validation with stricter criteria
function validateForm() {
    let isValid = true;
    
    // Weight validation
    const weightInput = document.getElementById('weight');
    const weightError = document.getElementById('weight-error');
    const weight = getWeightInKg();
    
    if (!weight || weight < 20 || weight > 300) {
        weightError.textContent = 'Berat badan harus antara 20-300 kg untuk akurasi medis';
        weightError.style.display = 'block';
        isValid = false;
    } else {
        weightError.style.display = 'none';
    }

    // Height validation with medical standards
    const heightError = document.getElementById('height-error');
    const height = getHeightInCm();
    
    if (!height || height < 100 || height > 250) {
        heightError.textContent = 'Tinggi badan harus antara 100-250 cm untuk perhitungan akurat';
        heightError.style.display = 'block';
        isValid = false;
    } else {
        heightError.style.display = 'none';
    }

    return isValid;
}

// Main calculation with enhanced accuracy
function performCalculation() {
    if (!validateForm()) return;

    const weight = getWeightInKg();
    const height = getHeightInCm();
    const age = parseInt(document.getElementById('age').value) || 0;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || 'male';

    // Calculate BMI with high precision
    const bmi = calculateBMI(weight, height);
    const category = getBMICategory(bmi);
    const healthRisk = getHealthRisk(bmi, age, gender);

    // Calculate metrics
    const bodyFatPercentage = age > 0 ? estimateBodyFat(bmi, age, gender) : null;
    const idealWeightRange = calculateIdealWeightRange(height);

    // Store current data
    currentData = {
        weight, height, age, gender, bmi, category, healthRisk, 
        bodyFatPercentage, idealWeightRange
    };

    // Update UI
    updateUI(currentData);
    setupTargetWeightSimulator(weight, height);

    // Show results
    document.getElementById('results').classList.add('active');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// Update UI with enhanced precision
function updateUI(data) {
    const { bmi, category, bodyFatPercentage, idealWeightRange, healthRisk } = data;

    // Animate BMI value with precision
    animateNumber('bmi-value', 0, bmi);

    // Update BMI category
    const categoryElement = document.getElementById('bmi-category');
    categoryElement.textContent = category.text;
    categoryElement.className = `bmi-category ${category.category}`;

    // Update BMI gauge with precision
    updateBMIGauge(bmi);

    // Update health metrics
    document.getElementById('body-fat-percentage').textContent = 
        bodyFatPercentage ? `${bodyFatPercentage}%` : 'Perlu data usia';

    document.getElementById('ideal-weight-range').textContent = 
        `${idealWeightRange.min.toFixed(1)}-${idealWeightRange.max.toFixed(1)} kg`;

    document.getElementById('health-risk').textContent = healthRisk.description;

    // Generate analysis and recommendations
    document.getElementById('contextual-analysis').innerHTML = generateContextualAnalysis(data);
    document.getElementById('recommendations').innerHTML = generateRecommendations(data);
}

// Setup target weight simulator with tighter ranges
function setupTargetWeightSimulator(currentWeight, height) {
    const slider = document.getElementById('target-weight-slider');
    const idealRange = calculateIdealWeightRange(height);
    
    // More realistic range based on your feedback
    const minWeight = Math.max(25, currentWeight - 15);
    const maxWeight = Math.min(120, currentWeight + 15);
    
    slider.min = minWeight.toFixed(1);
    slider.max = maxWeight.toFixed(1);
    slider.step = "0.1";
    slider.value = currentWeight.toFixed(1);
    
    updateTargetWeight(currentWeight);
}

// Save result to localStorage
function saveResult() {
    if (!currentData.bmi) {
        alert('Tidak ada data untuk disimpan. Silakan hitung BMI terlebih dahulu.');
        return;
    }

    const result = {
        date: new Date().toLocaleString('id-ID'),
        bmi: currentData.bmi,
        category: currentData.category.text,
        weight: currentData.weight.toFixed(1),
        height: currentData.height.toFixed(1),
        healthRisk: currentData.healthRisk.description
    };

    let savedResults = JSON.parse(localStorage.getItem('bmi_results') || '[]');
    savedResults.unshift(result);
    savedResults = savedResults.slice(0, 5);
    localStorage.setItem('bmi_results', JSON.stringify(savedResults));
    
    alert('Hasil berhasil disimpan!');
}

// Dark mode toggle
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const button = document.querySelector('.dark-mode-toggle');
    button.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Initialize app
function initializeApp() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const button = document.querySelector('.dark-mode-toggle');
    button.textContent = savedTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();

    // Form submission
    document.getElementById('bmi-form').addEventListener('submit', function(e) {
        e.preventDefault();
        performCalculation();
    });

    // Input validation
    document.getElementById('weight').addEventListener('input', function() {
        document.getElementById('weight-error').style.display = 'none';
    });

    document.getElementById('height').addEventListener('input', function() {
        document.getElementById('height-error').style.display = 'none';
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        performCalculation();
    }
    
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
    }
});