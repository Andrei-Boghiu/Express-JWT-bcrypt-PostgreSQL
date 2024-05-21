// # GENERATE RANDOM HEXADECIMAL STRING

const crypto = require('crypto');
const length = process.argv[2] || 32; // Default length is 32 characters
const randomHexString = crypto.randomBytes(length / 2).toString('hex');
console.log(randomHexString);

// INSTRUCTIONS
// 1. Open a terminal or command prompt and navigate to the current directory.
// 2. Run the script using the following command:
//      - node generate-random-hex.js [length]
// 3. Replace [length] with the desired length of the hexadecimal string (optional). If no length is provided, the script will generate a 32-character hexadecimal string by default.

// EXAMPLES:
// CLI COMMAND: $ node generate-random-hex.js
// OUTPUT: e7d7c7b1a5d4f6c9b8a3d8d848620d75

// CLI COMMAND: $ node generate-random-hex.js 64
// OUTPUT: e7d7c7b1a5d4f6c9b8a3d8d848620d75a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7