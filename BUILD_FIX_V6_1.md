# ZaynClock v6.1 build fix

Fixed the Hostinger TypeScript build failure in `hooks/usePreferences.tsx` by narrowing the legacy stored `clockType` value from `unknown` to a validated `ClockType` before using it.

Also removed the unused `archiver` development dependency.
