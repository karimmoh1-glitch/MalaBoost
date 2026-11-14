# MalaBoost Interactive Lab — TSA Biotechnology Design

An educational, one-page simulation of **MalaBoost**, a proposed dual-antigen (HRP2 + pLDH) malaria rapid diagnostic test with an optional press-activated signal enhancement step.

> Illustrative model only. Signal behavior is not based on experimental MalaBoost data. Not a diagnostic tool.

## Repository layout

| Folder | What it contains |
| --- | --- |
| [`template/`](template/) | The original [Shadcn Dashboard](https://shadcndashboard.dev/) template, **unchanged**, exactly as downloaded. Kept for reference and attribution. |
| [`edited/`](edited/) | The MalaBoost Interactive Lab website: everything written or changed for this project. |

The MalaBoost site is a separate, much smaller project. It keeps the template's visual style (Geist font, clean card layout), its MIT license, and its required footer attribution, but uses plain React + Vite instead of the template's full dashboard code.

## Run the website

```bash
cd edited
npm install
npm run dev
```

Then open http://localhost:5173. See [`edited/README.md`](edited/README.md) for file explanations and a demo script.

## Credits and license

Template: © [shadcndashboard.dev](https://shadcndashboard.dev/), MIT License (see `template/LICENSE` and `edited/LICENSE`).
