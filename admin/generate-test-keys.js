
#!/usr/bin/env node
/*
  Generate 5 test licenses for unlocking the site
  Usage: node admin/generate-test-keys.js
*/

const fs = require('fs');
const path = require('path');
const { SignJWT, importPKCS8 } = require('jose');
const crypto = require('crypto');

async function generateTestLicenses() {
  const keyPath = path.resolve(__dirname, 'sample-keys/private-key.pem');
  const privateKeyPem = fs.readFileSync(keyPath, 'utf8');
  const privateKey = await importPKCS8(privateKeyPem, 'ES256');

  const licenses = [
    {
      name: 'OWNER_LICENSE',
      payload: {
        user_id: 'OWNER',
        issued_at: new Date().toISOString(),
        features: ['*'],
        expiry_iso: null,
        nonce: crypto.randomUUID(),
        is_owner: true,
      }
    },
    {
      name: 'PREMIUM_USER',
      payload: {
        user_id: 'USER_PREMIUM_001',
        issued_at: new Date().toISOString(),
        features: ['premium', 'boss_mode', 'pro_analytics'],
        expiry_iso: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        nonce: crypto.randomUUID(),
        is_owner: false,
      }
    },
    {
      name: 'BOSS_MODE_USER',
      payload: {
        user_id: 'USER_BOSS_002',
        issued_at: new Date().toISOString(),
        features: ['boss_mode'],
        expiry_iso: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
        nonce: crypto.randomUUID(),
        is_owner: false,
      }
    },
    {
      name: 'ANALYTICS_USER',
      payload: {
        user_id: 'USER_ANALYTICS_003',
        issued_at: new Date().toISOString(),
        features: ['pro_analytics', 'premium'],
        expiry_iso: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
        nonce: crypto.randomUUID(),
        is_owner: false,
      }
    },
    {
      name: 'TRIAL_USER',
      payload: {
        user_id: 'USER_TRIAL_004',
        issued_at: new Date().toISOString(),
        features: ['premium'],
        expiry_iso: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        nonce: crypto.randomUUID(),
        is_owner: false,
      }
    }
  ];

  console.log('🔑 Generating 5 test licenses...\n');

  for (const license of licenses) {
    const token = await new SignJWT(license.payload)
      .setProtectedHeader({ alg: 'ES256' })
      .sign(privateKey);

    const output = { token, meta: license.payload };
    const filename = `${license.name.toLowerCase()}_license.json`;
    const filepath = path.resolve(process.cwd(), filename);
    
    fs.writeFileSync(filepath, JSON.stringify(output, null, 2));

    console.log(`✅ ${license.name}`);
    console.log(`   File: ${filename}`);
    console.log(`   User: ${license.payload.user_id}`);
    console.log(`   Features: ${license.payload.features.join(', ')}`);
    console.log(`   Expires: ${license.payload.expiry_iso || 'Never'}`);
    console.log(`   Owner: ${license.payload.is_owner ? 'YES' : 'No'}`);
    console.log(`   Token: ${token.substring(0, 50)}...`);
    console.log('');
  }

  // Also create a quick-access file with just tokens
  const tokensOnly = licenses.map(l => ({
    name: l.name,
    user_id: l.payload.user_id,
    features: l.payload.features,
    is_owner: l.payload.is_owner
  }));

  fs.writeFileSync('test_licenses_summary.json', JSON.stringify(tokensOnly, null, 2));

  console.log('🎉 All licenses generated successfully!');
  console.log('\n📋 Quick instructions:');
  console.log('1. Copy any .json file content and paste in the license upload modal');
  console.log('2. Or copy just the "token" value for quick paste');
  console.log('3. Or rename any file to "yujiro_license.json" and place at web root for auto-discovery');
  console.log('\n🚀 Ready to unlock your site!');
}

generateTestLicenses().catch(console.error);
