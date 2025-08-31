# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/1439429b-1867-4051-b8a7-912deb05b226

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1439429b-1867-4051-b8a7-912deb05b226) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1439429b-1867-4051-b8a7-912deb05b226) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## License System - Quick Start

1) Generate keys (owner machine only)
- ES256 recommended:
  - openssl ecparam -genkey -name prime256v1 -noout -out private-key.pem
  - openssl ec -in private-key.pem -pubout -out public-key.pem
- Replace client public key: copy your public-key.pem into src/lib/license/public-key.pem

2) Create a customer license
- node admin/generate-key.js --user=USER_123 --features='["premium","boss_mode"]' --expiry=2026-12-31 --key=path/to/private-key.pem
- Output: yujiro_license.json with { token, meta }

3) Create an OWNER license
- node admin/generate-owner-key.js --key=path/to/private-key.pem

4) Install the license
- Easiest: place yujiro_license.json at the web root so the app auto-discovers it
- Or in app: Unlock → Upload license file or paste token

5) Optional revocation API
- Run: ts-node server/index.ts (or compile to JS)
- Revoke: node admin/revoke.js --nonce=abcd1234

Notes
- Verification is stateless and offline. Only the public key is shipped.
- Owner license (is_owner:true) unlocks all features regardless of expiry/features.
- Private key must NEVER be checked into your client app.
