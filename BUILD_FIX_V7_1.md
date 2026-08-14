# ZaynClock v7.1 Chess Clock Pointer Fix

- Chess clock panels now react on `pointerdown` for mouse, touch, and pen.
- Left mouse button is explicitly supported on desktop.
- Touch and mouse no longer risk double-triggering through a second click event.
- Keyboard Enter/Space activation remains supported.
- Added `touch-action: manipulation` and disabled text selection on clock panels.
