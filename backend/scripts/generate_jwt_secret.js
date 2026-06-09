#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateSecret() {
    return crypto.randomBytes(48).toString('hex');
}

const secret = generateSecret();

if (process.argv.includes('--apply')) {
    const envPath = path.join(__dirname, '..', '.env');
    try {
        let envContents = '';
        if (fs.existsSync(envPath)) {
            envContents = fs.readFileSync(envPath, 'utf8');
            const backupPath = envPath + '.bak.' + Date.now();
            fs.copyFileSync(envPath, backupPath);
            console.log('Backup of existing .env written to:', backupPath);
        }

        // Remove any existing JWT_SECRET entries
        const cleaned = envContents.replace(/^JWT_SECRET=.*(\r?\n|$)/m, '');
        const final = cleaned + `JWT_SECRET=${secret}\n`;
        fs.writeFileSync(envPath, final, { encoding: 'utf8' });
        console.log('Wrote new JWT_SECRET to', envPath);
    } catch (err) {
        console.error('Failed to apply new JWT secret:', err.message);
        process.exit(1);
    }
} else {
    console.log('Generated JWT secret:');
    console.log(secret);
    console.log('\nTo apply this secret to backend/.env run:');
    console.log('  node scripts/generate_jwt_secret.js --apply');
}
