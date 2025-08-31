Yujiro Mode - Admin Toolkit

WARNING: Never ship your real private key in the client. Use these tools on a secure machine.

1) Generate ES256 keypair
- Recommended: ES256 (P-256)

Using OpenSSL:
  openssl ecparam -genkey -name prime256v1 -noout -out private-key.pem
  openssl ec -in private-key.pem -pubout -out public-key.pem

2) Install public key in client
- Replace src/lib/license/public-key.pem with your public-key.pem contents.

3) Generate customer license
  node admin/generate-key.js --user=USER_123 \
    --features='["premium","boss_mode"]' \
    --expiry=2026-12-31 \
    --key=path/to/private-key.pem

4) Generate OWNER license
  node admin/generate-owner-key.js --key=path/to/private-key.pem

5) Install license locally
- Save file as yujiro_license.json next to your index.html or app root so the client can auto-discover.
- Or open the app and use Manage License → Upload → paste token.

6) Optional revocation API
- Run server: `npm run server` (configure build) or `ts-node server/index.ts`
- Revoke: node admin/revoke.js --nonce=<license_nonce>

7) Security
- Private key stays offline. Public key only in client.
- Owner licenses grant full access regardless of features/expiry.

