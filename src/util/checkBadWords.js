const badWords = require('../config/badwords');

function containsBadWords(text) {
    const lowerText = text.toLowerCase();
    return badWords.some((word) => lowerText.includes(word));
}

module.exports = containsBadWords;
