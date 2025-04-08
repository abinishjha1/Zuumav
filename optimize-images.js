const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = './images';
const outputDir = './images/optimized';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Optimization settings
const settings = {
    jpg: {
        quality: 80,
        chromaSubsampling: '4:4:4'
    }
};

// Process each image
fs.readdir(imageDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        if (file.match(/\.(jpg|jpeg|png)$/i)) {
            const inputPath = path.join(imageDir, file);
            const outputPath = path.join(outputDir, file);

            // Resize and optimize
            sharp(inputPath)
                .resize(600, 400, {
                    fit: 'cover',
                    position: 'center'
                })
                .jpeg(settings.jpg)
                .toFile(outputPath)
                .then(info => console.log(`Optimized ${file}: ${info.size} bytes`))
                .catch(err => console.error(`Error processing ${file}:`, err));
        }
    });
}); 