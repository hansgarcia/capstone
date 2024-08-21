const bcrypt = require('bcrypt');

async function testHash() {
    try {
        const password = 'testpassword';
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);
    } catch (error) {
        console.error('Error hashing password:', error);
    }
}

testHash();
