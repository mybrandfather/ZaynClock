# ZaynClock homepage hotfix v2

This patch prevents legacy or corrupted browser preferences from crashing the home clock.

## Changes
- Validates saved time zone values before passing them to `Intl.DateTimeFormat`.
- Migrates older clock-style values to `neon3d`.
- Validates all stored preference fields.
- Catches blocked/full localStorage writes.
- Falls back to UTC instead of throwing a client-side exception.
- Adds route and global recovery screens that can reset only ZaynClock preferences.

## Deploy
Upload the full `zaynclock-hostinger-ready-v2.zip` through Hostinger's Node.js **Settings and redeploy** workflow.
Use Node.js 22, build command `npm run build`, and start command `npm run start`.
