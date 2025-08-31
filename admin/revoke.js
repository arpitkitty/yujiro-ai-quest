#!/usr/bin/env node
/*
  Yujiro Mode - Revoke License by Nonce
  Usage:
    node admin/revoke.js --nonce=abcd1234 --reason="chargeback"
*/

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = {};
  for (const arg of process.argv.slice(2)) {
    const [k, v] = arg.split('=');
    const key = k.replace(/^--/, '');
    args[key] = v === undefined ? true : v;
  }
  return args;
}

function main() {
  const args = parseArgs();
  const nonce = args.nonce;
  const reason = args.reason || 'unspecified';
  if (!nonce) {
    console.error('Provide --nonce=...');
    process.exit(1);
  }

  const dbPath = path.resolve(__dirname, '../server/data/revoked.json');
  if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  let list = [];
  if (fs.existsSync(dbPath)) {
    list = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }
  if (!list.find((e) => e.nonce === nonce)) {
    list.push({ nonce, revoked_at: new Date().toISOString(), reason });
  }
  fs.writeFileSync(dbPath, JSON.stringify(list, null, 2));
  console.log('Revoked nonce saved to', dbPath);
}

main();
