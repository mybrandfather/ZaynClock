# ZaynClock Slide Clock update

This release keeps **Neon 3D** as the default for new visitors and adds **Slide Clock** as a fifth selectable option under **Settings → Main clock style**.

## Integration changes

- Reimplemented the original Pug/SCSS/JavaScript concept as a scoped React/TypeScript component.
- Uses ZaynClock's selected time zone and 12/24-hour preference.
- Honors the **Show seconds** preference.
- Uses ZaynClock theme, accent, selected clock font, fullscreen mode and reduced-motion behavior.
- Avoids global `body`, viewport and DOM-query rules that would interfere with the Next.js application.
- Adds an accessible text representation of the current time.

## Source and license

Design/code reference: Jacob Foster (`Alca`), “Slide Clock” public CodePen:
https://codepen.io/Alca/pen/BZbPrE

CodePen states that public Pens are MIT licensed. The attribution and MIT notice are retained in `THIRD_PARTY_NOTICES.md` and on `/credits`.

## Hostinger deployment

Upload the full `zaynclock-hostinger-ready-v3.zip` using Hostinger's Node.js **Settings and redeploy** screen.

Use:

- Framework: Next.js
- Node.js: 22.x
- Root directory: `./`
- Build command: `npm run build`
- Start command: `npm run start`
- Environment variable: `NEXT_PUBLIC_SITE_URL=https://zaynclock.com`
