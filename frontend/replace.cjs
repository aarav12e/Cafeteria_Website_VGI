const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace gradient prefixes
    content = content.replace(/bg-gradient-to-[a-z]+/g, 'bg-gray-800');
    content = content.replace(/from-orange-[0-9]+/g, 'bg-gray-800');
    content = content.replace(/to-red-[0-9]+/g, '');
    content = content.replace(/via-[a-z]+-[0-9]+/g, '');
    content = content.replace(/from-[a-z]+-[0-9]+/g, 'bg-gray-800');
    content = content.replace(/to-[a-z]+-[0-9]+/g, '');
    
    // Replace text and bg colors
    content = content.replace(/text-orange-[0-9]+/g, 'text-gray-100');
    content = content.replace(/bg-orange-[0-9]+/g, 'bg-gray-800');
    content = content.replace(/border-orange-[0-9]+/g, 'border-gray-700');
    content = content.replace(/shadow-orange-[0-9]+\/[0-9]+/g, 'shadow-black/50');
    
    content = content.replace(/text-red-[0-9]+/g, 'text-gray-100');
    content = content.replace(/bg-red-[0-9]+/g, 'bg-gray-800');
    content = content.replace(/border-red-[0-9]+/g, 'border-gray-700');
    
    content = content.replace(/text-amber-[0-9]+/g, 'text-gray-100');
    content = content.replace(/bg-amber-[0-9]+/g, 'bg-gray-800');
    
    // Remove background clip text transparent and gradients that look weird now
    content = content.replace(/bg-clip-text text-transparent/g, 'text-white');
    content = content.replace(/bg-gradient-to-[a-z]+/g, 'bg-gray-800');
    
    fs.writeFileSync(file, content);
});

console.log('Replaced colors in', files.length, 'files');
