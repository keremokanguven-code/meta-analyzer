const fs = require('fs');
const metadata_hunter_js = `const fs = require('fs');
const mode = process.argv[2]; // --analyze
const filePath = process.argv[3]; // Fotoğraf veya belge yolu
if (!mode || !filePath) {
    console.log("\\n⚠️ Kullanım Hatası!");
    console.log("  Kullanım: node metadata-hunter.js --analyze <dosya_yolu>");
    console.log("  Örnek  : node metadata-hunter.js --analyze fotograf.jpg\\n");
    process.exit(1);
}
function analyzeMetadata(fPath) {
    console.log(\`\\n '\${fPath}' dosyasının binary katmanları analiz ediliyor...\`);
    try {
        const buffer = fs.readFileSync(fPath);
        const hexString = buffer.toString('hex').toUpperCase();
        console.log("==================================================");
        console.log("      METADATA ANALİZ RAPORU ");
        console.log("==================================================");
        console.log(\`Dosya Adı: \${fPath}\`);
        console.log(\`Dosya Boyutu: \${buffer.length} bayt\`);
        console.log("--------------------------------------------------");
        if (!hexString.startsWith('FFD8')) {
            console.log(" Uyarı: Bu dosya standart bir JPEG görseli değil veya bozuk.");
            console.log("Yine de ham metin (string) taraması yapılıyor...");
        }
        const asciiText = buffer.toString('ascii');
        const brands = ['APPLE', 'SAMSUNG', 'XIAOMI', 'SONY', 'CANON', 'NIKON', 'HUAWEI'];
        let foundDevice = "Bilinmiyor (Metadata temizlenmiş olabilir)";
        for (const brand of brands) {
            if (asciiText.toUpperCase().includes(brand)) {
                foundDevice = brand;
                break;
            }
        }
        console.log(\` Çekim Yapılan Cihaz/Marka: \${foundDevice}\`);
        const dateRegex = /\\d{4}:\\d{2}:\\d{2} \\d{2}:\\d{2}:\\d{2}/;
        const dateMatch = asciiText.match(dateRegex);
        console.log(\` Orijinal Çekim Tarihi     : \${dateMatch ? dateMatch[0] : 'Bulunamadı'}\`);
        const softwareRegex = /(Adobe Photoshop|iOS|Android|Windows|macOS)[\\d\\.]*/i;
        const softwareMatch = asciiText.match(softwareRegex);
        console.log(\` Düzenleme/Sistem Yazılımı : \${softwareMatch ? softwareMatch[0] : 'Doğrudan Kameralı Çekim'}\`);
        console.log("--------------------------------------------------");
        console.log(" COĞRAFİ KONUM (GPS) İSTİHBARATI:");
        if (asciiText.includes('GPSVersionID') || asciiText.includes('GPSLatitude')) {
            console.log("   TEHLİKE! Dosya içinde gizli GPS koordinatları tespit edildi!");
            console.log("   Bu fotoğrafı internete yükleyen kişinin Evi/Konumu sızdırılabilir.");
        } else {
            console.log("   TEMİZ! Dosyada gizli GPS veya konum izine rastlanmadı.");
        }
        console.log("==================================================\\n");

    } catch (err) {
        console.error(" Dosya okunurken bir hata oluştu. Lütfen dosya yolunu kontrol edin.", err.message);
    }
}

analyzeMetadata(filePath);
`;

function kur() {
    fs.writeFileSync('metadata-hunter.js', metadata_hunter_js);
    console.log("--- OSINT Metadata & EXIF Extractor Kuruldu ---");
    console.log("+ 'metadata-hunter.js' adli bilişim motoru hazırlandı.\\n");
    console.log(" BİR DOSYAYI ANALİZ ETMEK İÇİN:");
    console.log("  node metadata-hunter.js --analyze <fotoğraf_veya_belge_yolu>\\n");
    console.log("*(Telefonunla çektiğin orijinal bir .jpg fotoğrafını bu klasöre atıp test edebilirsin!)*");
}

kur();
