const https = require('https');
const fs = require('fs');
const path = require('path');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// List of dirt bike images from Unsplash
const images = [
    {
        url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87',
        filename: 's8.jpg',
        description: 'ZUUMAV S8 - Black and white dual-sport motorcycle'
    },
    {
        url: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f',
        filename: 'k7.jpg',
        description: 'ZUUMAV K7 - Professional motocross bike in action'
    },
    {
        url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39',
        filename: 's6.jpg',
        description: 'ZUUMAV S6 - Competition dirt bike with rider'
    },
    {
        url: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8',
        filename: 'h6.jpg',
        description: 'ZUUMAV H6 - Racing dirt bike in dynamic pose'
    },
    {
        url: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8',
        filename: 'hero-bg.jpg',
        description: 'Hero background - Professional dirt bike racing scene'
    }
];

console.log('Starting download of ZUUMAV bike images from Unsplash...');
console.log('Images will be saved in the images folder');

// Download each image
images.forEach(image => {
    const file = fs.createWriteStream(path.join(imagesDir, image.filename));
    
    // Add quality parameters to Unsplash URLs
    const imageUrl = `${image.url}?q=85&w=1200&fit=crop`;
    
    https.get(imageUrl, response => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded: ${image.filename} - ${image.description}`);
        });
    }).on('error', err => {
        fs.unlink(path.join(imagesDir, image.filename), () => {});
        console.error(`Error downloading ${image.filename}: ${err.message}`);
    });
}); 