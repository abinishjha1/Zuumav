const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = './images';
const outputDir = './images/optimized';

// Image sizes for responsive images
const sizes = [
    { width: 320, height: 213, suffix: 'sm' },
    { width: 640, height: 427, suffix: 'md' },
    { width: 960, height: 640, suffix: 'lg' }
];

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Optimization settings
const settings = {
    jpeg: {
        quality: 70,
        chromaSubsampling: '4:4:4',
        mozjpeg: true
    },
    webp: {
        quality: 75,
        lossless: false,
        effort: 6
    }
};

// Process each image
async function optimizeImage(inputFile) {
    const filename = path.parse(inputFile).name;
    const inputPath = path.join(imageDir, inputFile);
    
    try {
        // Generate different sizes and formats
        for (const size of sizes) {
            const image = sharp(inputPath);
            
            // Get image metadata
            const metadata = await image.metadata();
            const aspectRatio = metadata.width / metadata.height;
            
            // Calculate height maintaining aspect ratio
            const targetHeight = Math.round(size.width / aspectRatio);
            
            // Process JPEG version
            await image
                .resize(size.width, targetHeight, { fit: 'cover' })
                .jpeg(settings.jpeg)
                .toFile(path.join(outputDir, `${filename}-${size.suffix}.jpg`));
            
            // Process WebP version
            await image
                .resize(size.width, targetHeight, { fit: 'cover' })
                .webp(settings.webp)
                .toFile(path.join(outputDir, `${filename}-${size.suffix}.webp`));
            
            console.log(`Processed ${filename} - ${size.suffix}`);
        }
    } catch (err) {
        console.error(`Error processing ${inputFile}:`, err);
    }
}

// Process all images
fs.readdir(imageDir, async (err, files) => {
    if (err) throw err;

    const imageFiles = files.filter(file => 
        file.match(/\.(jpg|jpeg|png)$/i) && 
        !file.includes('optimized')
    );

    for (const file of imageFiles) {
        await optimizeImage(file);
    }
    
    console.log('Image optimization complete!');
}); 