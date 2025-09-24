let currentWeightUnit = 'kg';
let currentHeightUnit = 'cm';
let currentData = {};

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

function toggleWeightUnit() {
    const weightInput = document.getElementById('weight');
    const unitButton = document.getElementById('weight-unit');
    const currentValue = parseFloat(weightInput.value) || 0;

    if (currentWeightUnit === 'kg') {

        weightInput.value = currentValue > 0 ? kgToLbs(currentValue).toFixed(1) : '';
        unitButton.textContent = 'lbs';
        currentWeightUnit = 'lbs';
    } else {

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

function calculateBMI(weightKg, heightCm) {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
}

function estimateBodyFat(bmi, age, gender) {
    let bodyFat;
    if (gender === 'male') {
        bodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
    } else if (gender === 'female') {
        bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
    } else {

        bodyFat = (1.20 * bmi) + (0.23 * age) - 10.8;
    }
    return Math.max(0, Math.min(50, bodyFat));
}

function calculateWaistHeightRatio(waistCm, heightCm) {
    if (!waistCm || !heightCm) return null;
    return waistCm / heightCm;
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return { category: 'underweight', text: 'Berat Badan Kurang' };
    if (bmi < 25) return { category: 'normal', text: 'Normal' };
    if (bmi < 30) return { category: 'overweight', text: 'Berat Badan Berlebih' };
    return { category: 'obese', text: 'Obesitas' };
}

function calculateIdealWeightRange(heightCm) {
    const heightM = heightCm / 100;
    const minWeight = 18.5 * (heightM * heightM);
    const maxWeight = 24.9 * (heightM * heightM);
    return { min: minWeight, max: maxWeight };
}

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

function updateBMIGauge(bmi) {
    const pointer = document.getElementById('bmi-pointer');

    let position = ((bmi - 15) / 20) * 100;
    position = Math.max(0, Math.min(100, position));
    pointer.style.left = position + '%';
}

function generateContextualAnalysis(data) {
    const { bmi, category, bodyType, waistHeightRatio, activityLevel, age, gender } = data;
    let analysis = `<h3>📊 Analisis Kontekstual</h3>`;
    
    analysis += `<p><strong>BMI Anda: ${bmi.toFixed(1)}</strong> - ${category.text}</p>`;

    if (category.category === 'overweight' || category.category === 'obese') {
        if (bodyType === 'mesomorph') {
            analysis += `<div class="warning-message">
                <strong>⚠️ Catatan Penting:</strong> BMI Anda menunjukkan ${category.text.toLowerCase()}, 
                namun tipe tubuh Mesomorph cenderung memiliki massa otot yang lebih tinggi. 
                BMI mungkin tidak mencerminkan komposisi tubuh yang sebenarnya. 
                Pertimbangkan pengukuran body fat dengan caliper atau BIA untuk hasil yang lebih akurat.
            </div>`;
        }
        
        if (waistHeightRatio && waistHeightRatio < 0.5) {
            analysis += `<div class="warning-message">
                <strong>✅ Indikator Positif:</strong> Meski BMI menunjukkan ${category.text.toLowerCase()}, 
                rasio pinggang-tinggi Anda (${(waistHeightRatio * 100).toFixed(1)}%) masih dalam kategori sehat (&lt;50%). 
                Ini menunjukkan distribusi lemak yang relatif baik.
            </div>`;
        }
    }

    if (waistHeightRatio) {
        if (waistHeightRatio >= 0.6) {
            analysis += `<div class="warning-message" style="border-color: var(--danger-color); background: #ffebee;">
                <strong>🚨 Peringatan Kesehatan:</strong> Rasio pinggang-tinggi Anda (${(waistHeightRatio * 100).toFixed(1)}%) 
                menunjukkan risiko tinggi penyakit metabolik. Konsultasikan dengan dokter untuk evaluasi lebih lanjut.
            </div>`;
        } else if (waistHeightRatio >= 0.5) {
            analysis += `<div class="warning-message">
                <strong>⚠️ Perhatian:</strong> Rasio pinggang-tinggi Anda (${(waistHeightRatio * 100).toFixed(1)}%) 
                berada di batas normal. Pertimbangkan pola makan sehat dan olahraga teratur.
            </div>`;
        }
    }

    if (activityLevel === 'very-active' || activityLevel === 'active') {
        if (category.category === 'overweight') {
            analysis += `<p><strong>💪 Catatan Aktivitas:</strong> Tingkat aktivitas Anda yang tinggi menunjukkan 
            kemungkinan massa otot yang lebih besar, yang dapat mempengaruhi interpretasi BMI.</p>`;
        }
    }

    if (age && age > 60) {
        analysis += `<p><strong>👴 Pertimbangan Usia:</strong> Pada usia ${age} tahun, 
        komposisi tubuh alami berubah dengan penurunan massa otot. Konsultasikan dengan profesional 
        kesehatan untuk evaluasi yang sesuai usia.</p>`;
    }

    return analysis;
}

function generateRecommendations(data) {
    const { category, activityLevel, age, bodyType } = data;
    let recommendations = `<h3>📋 Rekomendasi Personal</h3>`;

    switch (category.category) {
        case 'underweight':
            recommendations += `
                <div style="border-left: 4px solid #2196f3; padding-left: 15px;">
                    <h4>🍽️ Nutrisi:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Tingkatkan asupan kalori sehat dengan kacang-kacangan, alpukat, dan protein berkualitas</li>
                        <li>Makan lebih sering dengan porsi kecil (5-6x sehari)</li>
                        <li>Konsumsi smoothie tinggi kalori dan nutrisi</li>
                    </ul>
                    <h4>🏋️ Aktivitas:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Fokus pada latihan kekuatan untuk membangun massa otot</li>
                        <li>Kurangi cardio berlebihan yang dapat membakar kalori terlalu banyak</li>
                        <li>Istirahat cukup untuk pemulihan otot</li>
                    </ul>
                </div>`;
            break;

        case 'normal':
            recommendations += `
                <div style="border-left: 4px solid #4caf50; padding-left: 15px;">
                    <h4>✅ Pertahankan:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Pola makan seimbang dengan variasi nutrisi lengkap</li>
                        <li>Aktivitas fisik teratur minimal 150 menit per minggu</li>
                        <li>Kombinasi latihan kardio dan kekuatan</li>
                    </ul>
                    <h4>🎯 Optimalisasi:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Monitor komposisi tubuh, bukan hanya berat badan</li>
                        <li>Konsumsi cukup protein untuk mempertahankan massa otot</li>
                        <li>Kelola stres dan tidur berkualitas</li>
                    </ul>
                </div>`;
            break;

        case 'overweight':
            recommendations += `
                <div style="border-left: 4px solid #ff9800; padding-left: 15px;">
                    <h4>📉 Penurunan Berat:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Deficit kalori moderat 300-500 kalori per hari</li>
                        <li>Fokus pada makanan whole foods, kurangi makanan olahan</li>
                        <li>Tingkatkan konsumsi sayuran dan protein tanpa lemak</li>
                    </ul>
                    <h4>🚶 Aktivitas:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Kombinasi cardio moderat dan latihan kekuatan</li>
                        <li>Mulai dengan 30 menit aktivitas 5x seminggu</li>
                        <li>Tingkatkan aktivitas sehari-hari (jalan kaki, naik tangga)</li>
                    </ul>
                </div>`;
            break;

        case 'obese':
            recommendations += `
                <div style="border-left: 4px solid #f44336; padding-left: 15px;">
                    <h4>🏥 Konsultasi Medis:</h4>
                    <p style="background: #ffebee; padding: 10px; border-radius: 5px; margin: 10px 0;">
                        <strong>Penting:</strong> Disarankan berkonsultasi dengan dokter atau ahli gizi 
                        untuk program penurunan berat badan yang aman dan terstruktur.
                    </p>
                    <h4>🎯 Langkah Awal:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Mulai dengan perubahan kecil dan berkelanjutan</li>
                        <li>Aktivitas ringan seperti jalan santai 15-20 menit</li>
                        <li>Kurangi minuman manis dan makanan tinggi gula</li>
                        <li>Pantau tekanan darah dan gula darah secara rutin</li>
                    </ul>
                </div>`;
            break;
    }

    if (activityLevel === 'sedentary') {
        recommendations += `
            <div style="background: var(--bg-primary); padding: 15px; border-radius: 8px; margin-top: 15px; border: 2px solid var(--warning-color);">
                <h4>⚠️ Gaya Hidup Sedentary:</h4>
                <p>Mulai dengan aktivitas ringan seperti jalan kaki 10 menit setelah makan, 
                gunakan tangga instead lift, atau lakukan peregangan setiap jam saat bekerja.</p>
            </div>`;
    }

    recommendations += `
        <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #e3f2fd, #f3e5f5); border-radius: 8px;">
            <p><strong>💡 Tips:</strong> Perubahan kecil yang konsisten lebih efektif daripada perubahan drastis yang sulit dipertahankan. 
            Fokus pada pembentukan kebiasaan sehat jangka panjang.</p>
        </div>`;

    return recommendations;
}

function updateTargetWeight(targetWeight) {
    const heightCm = getHeightInCm();
    if (!heightCm) return;

    const targetBMI = calculateBMI(parseFloat(targetWeight), heightCm);
    const targetCategory = getBMICategory(targetBMI);

    document.getElementById('target-weight-display').textContent = `${targetWeight} kg`;
    document.getElementById('target-bmi-display').textContent = `BMI: ${targetBMI.toFixed(1)} (${targetCategory.text})`;
}

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

function getWeightInKg() {
    const weight = parseFloat(document.getElementById('weight').value);
    if (!weight) return null;
    return currentWeightUnit === 'kg' ? weight : lbsToKg(weight);
}

function validateForm() {
    let isValid = true;
    

    const weightInput = document.getElementById('weight');
    const weightError = document.getElementById('weight-error');
    const weight = getWeightInKg();
    
    if (!weight || weight < 10 || weight > 500) {
        weightError.textContent = currentWeightUnit === 'kg' 
            ? 'Berat badan harus antara 10-500 kg'
            : 'Berat badan harus antara 22-1100 lbs';
        weightError.style.display = 'block';
        isValid = false;
    } else {
        weightError.style.display = 'none';
    }

    const heightError = document.getElementById('height-error');
    const height = getHeightInCm();
    
    if (!height || height < 50 || height > 300) {
        heightError.textContent = currentHeightUnit === 'cm'
            ? 'Tinggi badan harus antara 50-300 cm'
            : 'Tinggi badan harus antara 1\'8" - 9\'10"';
        heightError.style.display = 'block';
        isValid = false;
    } else {
        heightError.style.display = 'none';
    }

    return isValid;
}

function performCalculation() {
    if (!validateForm()) return;

    const weight = getWeightInKg();
    const height = getHeightInCm();
    

    console.log('Weight in kg:', weight, 'Height in cm:', height);
    
    const age = parseInt(document.getElementById('age').value) || 0;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || 'other';
    const waist = parseFloat(document.getElementById('waist').value);
    const bodyType = document.getElementById('body-type').value;
    const activityLevel = document.getElementById('activity-level').value;

    const bmi = calculateBMI(weight, height);
    const category = getBMICategory(bmi);

    const bodyFatPercentage = age > 0 ? estimateBodyFat(bmi, age, gender) : null;
    const waistHeightRatio = waist ? calculateWaistHeightRatio(waist, height) : null;
    const idealWeightRange = calculateIdealWeightRange(height);

    currentData = {
        weight, height, age, gender, waist, bodyType, activityLevel,
        bmi, category, bodyFatPercentage, waistHeightRatio, idealWeightRange
    };

    updateUI(currentData);

    setupTargetWeightSimulator(weight, height);

    document.getElementById('results').classList.add('active');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

function updateUI(data) {
    const { bmi, category, bodyFatPercentage, waistHeightRatio, idealWeightRange } = data;

    animateNumber('bmi-value', 0, bmi);

    const categoryElement = document.getElementById('bmi-category');
    categoryElement.textContent = category.text;
    categoryElement.className = `bmi-category ${category.category}`;

    updateBMIGauge(bmi);

    document.getElementById('body-fat-percentage').textContent = 
        bodyFatPercentage ? `${bodyFatPercentage.toFixed(1)}%` : 'Data tidak lengkap';

    document.getElementById('waist-height-ratio').textContent = 
        waistHeightRatio ? `${(waistHeightRatio * 100).toFixed(1)}%` : 'Data tidak lengkap';

    document.getElementById('ideal-weight-range').textContent = 
        `${idealWeightRange.min.toFixed(1)}-${idealWeightRange.max.toFixed(1)} kg`;

    document.getElementById('contextual-analysis').innerHTML = generateContextualAnalysis(data);

    document.getElementById('recommendations').innerHTML = generateRecommendations(data);

    showMissingDataWarnings(data);
}

function showMissingDataWarnings(data) {
    const { age, waist, bodyType, activityLevel } = data;
    let warnings = [];

    if (!age) warnings.push('usia');
    if (!waist) warnings.push('lingkar pinggang');
    if (!bodyType) warnings.push('tipe tubuh');
    if (!activityLevel) warnings.push('tingkat aktivitas');

    if (warnings.length > 0) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'warning-message';
        warningDiv.innerHTML = `
            <strong>📝 Data Tambahan:</strong> Untuk analisis yang lebih akurat, 
            silakan lengkapi data: ${warnings.join(', ')}. 
            Ini akan membantu memberikan rekomendasi yang lebih personal.
        `;
        
        const contextualDiv = document.getElementById('contextual-analysis');
        contextualDiv.appendChild(warningDiv);
    }
}

function setupTargetWeightSimulator(currentWeight, height) {
    const slider = document.getElementById('target-weight-slider');
    

    const idealRange = calculateIdealWeightRange(height);
    const minWeight = Math.max(30, Math.min(idealRange.min - 10, currentWeight - 20));
    const maxWeight = Math.min(200, Math.max(idealRange.max + 10, currentWeight + 20));
    
    slider.min = minWeight.toFixed(1);
    slider.max = maxWeight.toFixed(1);
    slider.step = "0.1";
    slider.value = currentWeight.toFixed(1);
    
    updateTargetWeight(currentWeight);
}

function saveResult() {
    if (!currentData.bmi) {
        alert('Tidak ada data untuk disimpan. Silakan hitung BMI terlebih dahulu.');
        return;
    }

    const result = {
        date: new Date().toLocaleString('id-ID'),
        bmi: currentData.bmi.toFixed(1),
        category: currentData.category.text,
        weight: currentData.weight.toFixed(1),
        height: currentData.height.toFixed(1)
    };

    let savedResults = JSON.parse(localStorage.getItem('bmi_results') || '[]');
    

    savedResults.unshift(result);
    

    savedResults = savedResults.slice(0, 5);
    

    localStorage.setItem('bmi_results', JSON.stringify(savedResults));
    
    alert('Hasil berhasil disimpan! 💾');
    

    showSavedResults(savedResults);
}

function showSavedResults(results) {
    const resultsHTML = results.map(result => `
        <div style="background: var(--bg-primary); padding: 10px; border-radius: 8px; margin: 5px 0; border: 1px solid var(--border-color);">
            <strong>${result.date}</strong><br>
            BMI: ${result.bmi} (${result.category})<br>
            Berat: ${result.weight} kg, Tinggi: ${result.height} cm
        </div>
    `).join('');

    const historyDiv = document.createElement('div');
    historyDiv.innerHTML = `
        <h3>📅 Riwayat Hasil</h3>
        ${resultsHTML}
    `;
    

    const recommendationsDiv = document.getElementById('recommendations');
    if (recommendationsDiv.nextSibling) {
        recommendationsDiv.parentNode.insertBefore(historyDiv, recommendationsDiv.nextSibling);
    } else {
        recommendationsDiv.parentNode.appendChild(historyDiv);
    }
}

function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const button = document.querySelector('.dark-mode-toggle');
    button.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

function initializeApp() {

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const button = document.querySelector('.dark-mode-toggle');
    button.textContent = savedTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';

    const savedResults = JSON.parse(localStorage.getItem('bmi_results') || '[]');
    if (savedResults.length > 0) {

        console.log(`${savedResults.length} hasil tersimpan ditemukan`);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();

    document.getElementById('bmi-form').addEventListener('submit', function(e) {
        e.preventDefault();
        performCalculation();
    });

    document.getElementById('weight').addEventListener('input', function() {
        document.getElementById('weight-error').style.display = 'none';
    });

    document.getElementById('height').addEventListener('input', function() {
        document.getElementById('height-error').style.display = 'none';
    });

    const autoCalcInputs = ['weight', 'height'];
    autoCalcInputs.forEach(id => {
        document.getElementById(id).addEventListener('blur', function() {
            if (validateForm() && document.getElementById('results').classList.contains('active')) {

                performCalculation();
            }
        });
    });
});

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

console.log('🧮 BMI Calculator loaded successfully!');
console.log('💡 Tips: Use Ctrl+Enter to calculate, Ctrl+D to toggle dark mode');