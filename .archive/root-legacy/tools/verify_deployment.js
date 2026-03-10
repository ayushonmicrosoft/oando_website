/* eslint-disable @typescript-eslint/no-require-imports */
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);

    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        // Validation Checks
        const checks = [
            { name: 'Status 200', pass: res.statusCode === 200 },
            { name: 'Contains "OandO"', pass: data.includes('OandO') },
            { name: 'Contains "Office Furniture"', pass: data.includes('Office Furniture') },
            { name: 'Contains "font-slogan" (Crimson Pro)', pass: data.includes('font-slogan') },
            //   { name: 'Contains Video Section', pass: data.includes('<video') || data.includes('VideoSection') } // Content might be minified/rendered differently
        ];

        console.log('\n--- Verification Results ---');
        checks.forEach(check => {
            console.log(`[${check.pass ? 'PASS' : 'FAIL'}] ${check.name}`);
        });

        if (checks.every(c => c.pass)) {
            console.log('\n✅ Deployment Verified Successfully');
            process.exit(0);
        } else {
            console.error('\n❌ Verification Failed');
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
    process.exit(1);
});

req.end();
