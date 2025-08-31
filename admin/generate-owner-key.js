#!/usr/bin/env node
/*
  Yujiro Mode - OWNER License Generator
  Usage:
    node admin/generate-owner-key.js --out=owner_license.json --key=admin/sample-keys/private-key.pem --alg=ES256
*/

const fs = require('fs');
const path = require('path');
const { SignJWT, importPKCS8 } = require('jose');
const crypto = require('crypto');

function parseArgs() {
  const args = {};
  for (const arg of process.argv.slice(2)) {
    const [k, v] = arg.split('=');
    const key = k.replace(/^--/, '');
    args[key] = v === undefined ? true : v;
  }
  return args;
}

async function main() {
  const args = parseArgs();
  const alg = args.alg || 'ES256';
  const keyPath = args.key || path.resolve(__dirname, 'sample-keys/private-key.pem');
  const outPath = path.resolve(process.cwd(), args.out || 'owner_license.json');

  if (!fs.existsSync(keyPath)) {
    console.error(`Private key not found at ${keyPath}. Provide --key=path/to/private-key.pem`);
    process.exit(1);
  }

  const privateKeyPem = fs.readFileSync(keyPath, 'utf8');
  const privateKey = await importPKCS8(privateKeyPem, alg);

  const payload = {
    user_id: 'OWNER',
    issued_at: new Date().toISOString(),
    features: ['*'],
    expiry_iso: null,
    nonce: crypto.randomUUID(),
    is_owner: true,
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .sign(privateKey);

  const out = { token, meta: payload };
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

  console.log('Owner license generated! Saved to', outPath);
  console.log('\nJWT token:\n');
  console.log(token);
}

main().catch((e) => {
  console.error('Failed to generate owner license:', e);
  process.exit(1);
});
