# ZaynClock v5 — Original Sound Library & Reliability Update

## Original sound library

Added ten locally hosted audio files created specifically for ZaynClock:

- Classic Telephone
- Computer Ring
- Classic Chime
- Desk Bell
- Rain on Window
- Ocean Shore
- Jungle Morning
- Peaceful Piano
- Soft Guitar
- Acoustic Sunrise

No third-party music, samples, or externally hosted audio are bundled. This avoids attribution uncertainty and CDN failures.

## Sound behavior

- Built-in sound choices are available from the global Settings panel.
- Nature and music previews automatically stop after 12 seconds.
- Alarm audio loops until Dismiss or Snooze is pressed.
- Dismiss and Snooze now reliably stop active audio.
- Existing custom sound upload remains available.
- Existing timers, Pomodoro, classroom timer, and exam timer use the selected sound.

## Verification performed

- Parsed all TypeScript and TSX source files for syntax errors.
- Verified all ten referenced audio files exist locally.
- Checked static internal links against application routes.
- Re-reviewed Chess Clock physical-switch behavior, pause/resume, reset, increment, and background-tab deadline logic.

## Build note

A clean `npm ci` could not be completed in the provided build environment because its internal npm mirror returned 404 responses for packages. No new npm dependency was added for this release. Hostinger should install using the existing lockfile as it did for prior deployments. Keep the previous live release available until the deployment log confirms a successful build.
