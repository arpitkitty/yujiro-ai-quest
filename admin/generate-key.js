#!/usr/bin/env node
/*
  Yujiro Mode - License Generator (Customer)
  Usage examples:
    node admin/generate-key.js --user=USER_123 --features='["premium","boss_mode"]' --expiry=2026-12-31 --key=admin/sample-keys/private-key.pem --alg=ES256
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
  const user_id = args.user || args.u || 'USER_DEMO';
  const features = args.features ? JSON.parse(args.features) : ['premium'];
  const expiry_iso = args.expiry ? new Date(args.expiry).toISOString() : null;
  const alg = args.alg || 'ES256';
  const keyPath = args.key || path.resolve(__dirname, 'sample-keys/private-key.pem');

  if (!fs.existsSync(keyPath)) {
    console.error(`Private key not found at ${keyPath}. Provide --key=path/to/private-key.pem`);
    process.exit(1);
  }

  const privateKeyPem = fs.readFileSync(keyPath, 'utf8');
  const privateKey = await importPKCS8(privateKeyPem, alg);

  const nonce = crypto.randomUUID();
  const issued_at = new Date().toISOString();

  const payload = { user_id, issued_at, features, expiry_iso, nonce, is_owner: false };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .sign(privateKey);

  const out = {
    token,
    meta: payload,
  };

  const outPath = path.resolve(process.cwd(), 'yujiro_license.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

  console.log('License generated successfully!');
  console.log('JWT token:\n');
  console.log(token);
  console.log('\nSaved file:', outPath);
}

main().catch((e) => {
  console.error('Failed to generate license:', e);
  process.exit(1);
});
