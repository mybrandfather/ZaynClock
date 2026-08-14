# ZaynClock v4 Quality Release

## Fixed
- Rebuilt Chess Clock turn logic to match a physical chess clock: pressing your clock starts the opponent's time.
- Added accurate deadline-based timing to Chess Clock to reduce background-tab drift.
- Added pause/resume that preserves the correct active player.
- Corrected increment, move counting, flag fall, reset, mobile resize, status text, and accessibility labels.
- Moved browser notification permission requests to user actions for Timer and Alarm.
- Corrected effect dependencies for timer/alarm sound preferences.
- Removed unreliable hard-coded `lastmod` dates from static sitemap entries.

## Added
- New `/interval-timer` with preparation, work, rest, rounds, presets, fullscreen, pause/resume, and timestamp-based timing.
- Interval Timer links in header, footer, All Tools, and sitemap.
- Web app manifest for installability and browser metadata.

## Audit checks completed
- Parsed all TypeScript/TSX source files for syntax errors.
- Compared internal static links with available app routes: no missing static routes found.
- Verified all page routes include page-level metadata or generated metadata.
- Verified sitemap includes the new tool and current static routes.

## Deployment note
A clean production build could not be executed in this environment because the internal npm mirror returned a missing package error for `zip-stream`. The project source was syntax-checked, but the Hostinger build log should still be reviewed after upload.
