# MalaBoost Interactive Lab

An educational, one-page web simulation for the TSA Biotechnology Design project **MalaBoost**: a proposed malaria rapid diagnostic test that detects two antigens (HRP2 and pLDH), with an optional press-activated signal enhancement step for the pLDH line.

> **Illustrative model only.** Signal behavior is not based on experimental MalaBoost data. This is not a diagnostic tool, and MalaBoost has not been experimentally validated.

## Setup

You need [Node.js](https://nodejs.org/) version 20.19 or newer.

```bash
npm install
npm run dev
```

Then open the address shown in the terminal (usually http://localhost:5173).

No backend, database or internet connection is needed after `npm install`.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The single HTML page; React draws into its `root` div |
| `src/main.jsx` | React entry point: starts the app |
| `src/App.jsx` | Main page, all simulation variables and calculations |
| `src/Cartridge.jsx` | Draws the test cartridge, plus `TestStrip`, the strip picture reused in the cards |
| `src/SignalCard.jsx` | One Before/After card: strip picture, large contrast number, two bars |
| `src/App.css` | All styling (colors, layout, the line-darkening transition) |
| `public/fonts/` | Geist font from the template |

## 60–90 second demo

1. Point out the two independent test lines (HRP2, pLDH) and the control line.
2. Drag the **pLDH Level** slider to show line darkness changing.
3. Click **Activate Enhancement**: the pLDH line darkens; HRP2 and C stay the same.
4. Click **Scenario 2** (HRP2 absent), then **Scenario 3** (background interference) and enhance again to show that contrast can drop even when the line gets darker.
5. Click **Reset Simulation**.

## Credits and license

Built from the [Shadcn Dashboard](https://shadcndashboard.dev/) template, which is © shadcndashboard.dev and licensed under the MIT License (see `LICENSE`). The Geist font is by Vercel, licensed under the SIL Open Font License.
