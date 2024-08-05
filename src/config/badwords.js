const fs = require('fs');
const path = require('path');

const badWordsFilePath = path.join(__dirname, 'vn_offensive_words.txt');

let badWords = [];

try {
    const data = fs.readFileSync(badWordsFilePath, 'utf8');
    badWords = data.split(/\r?\n/).filter((word) => word.trim() !== '');
} catch (err) {
    console.error('Error reading bad words file:', err);
}

module.exports = badWords;
