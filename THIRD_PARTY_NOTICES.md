# Third-Party Notices and Design References

ZaynClock's application code is released separately by its owner. This file preserves notices for external code/design references and production services used by the project.

## Neon 3D Seven-Segment Digital Clock

- Original author: Metty
- Original public Pen: https://codepen.io/Metty/pen/poYwNjv
- Reference listing: FreeFrontend, “Neon 3D Seven-Segment Digital Clock”
- License: MIT (the FreeFrontend listing identifies it as MIT, and CodePen applies the MIT License to public Pens)
- ZaynClock treatment: rewritten as a scoped React/TypeScript component integrated with ZaynClock's time-zone, 12/24-hour, seconds, fullscreen, theme and reduced-motion preferences. The original remote background image, page-wide reset styles and procedural DOM script are not included.

## Digital-Analog Dial Clock (“Dail”)

- Original author: Vineeth.TR (`vineethtrv`)
- Original public Pen: https://codepen.io/vineethtrv/pen/abjrWyW
- Reference listing: FreeFrontend, “Digital-Analog Dial Clock”
- License: MIT (CodePen applies the MIT License to public Pens)
- ZaynClock treatment: rewritten as a scoped React/TypeScript component with responsive sizing, ZaynClock theme variables, accessible text, time-zone support, 12/24-hour support and reduced-motion behavior. The original Pug, SCSS and JavaScript files are not bundled verbatim.

## Slide Clock

- Original author: Jacob Foster (`Alca`)
- Original public Pen: https://codepen.io/Alca/pen/BZbPrE
- License: MIT (CodePen applies the MIT License to public Pens)
- ZaynClock treatment: rewritten as a scoped React/TypeScript component with responsive sizing, ZaynClock theme variables, accessible text, time-zone support, 12/24-hour support, optional seconds and reduced-motion behavior. The original Pug, SCSS, viewport-wide body rules and interval-driven DOM mutation script are not bundled verbatim.

## MIT License Notice for the Referenced Public Pens

Copyright (c) Metty
Copyright (c) Vineeth.TR
Copyright (c) 2017 Jacob Foster

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Open-Meteo

Weather, air-quality, pollen, geocoding and reverse-geocoding requests use Open-Meteo endpoints. Review Open-Meteo's current terms, attribution and rate-limit requirements before production launch.

## Google services

Google AdSense may be enabled through environment configuration. Google font families are loaded through Next.js font optimization. Review and follow the current Google terms, consent and privacy requirements before enabling advertising.

## ZaynClock Original Audio Library

The audio files in `public/audio/` were procedurally composed and generated specifically for ZaynClock. They do not contain third-party recordings, samples, melodies, or externally hosted media. Copyright © 2026 ZaynClock. All rights reserved as part of the ZaynClock application.
