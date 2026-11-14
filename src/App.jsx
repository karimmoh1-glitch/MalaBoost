// App.jsx — the main page and all of the simulation logic.
//
// IMPORTANT: every number in this file is an arbitrary teaching value.
// None of them come from experiments on MalaBoost.

import { useState } from 'react'
import Cartridge from './Cartridge.jsx'
import SignalCard from './SignalCard.jsx'

// ---------- Simulation settings (arbitrary units, 0 to 100) ----------
const DEFAULT_PLDH_LEVEL = 30
const ENHANCEMENT_MULTIPLIER = 2 // enhanced line = base line x 2
const MAX_INTENSITY = 100 // nothing can be darker than 100
const NORMAL_BACKGROUND = 5 // a clean white membrane is almost colorless
const INTERFERENCE_BACKGROUND = 30 // membrane after unwanted background staining
const HRP2_LINE_INTENSITY = 60 // HRP2 line stays fixed in this model
const CONTROL_LINE_INTENSITY = 80 // control line is always visible

// ---------- Preset scenarios for "Test the Design" ----------
const SCENARIOS = [
  {
    number: 1,
    name: 'Weak pLDH Signal',
    pldhLevel: 15,
    hrp2Present: true,
    backgroundInterference: false,
    styleClass: 'scenario-teal',
    tag: 'Design goal',
    challenge:
      'The pLDH line is faint and could be missed by eye. This is the situation the optional enhancement step is designed for. Press "Activate Enhancement" and compare the contrast before and after.',
    takeaway: 'Enhancement is most useful when a real pLDH line is present but faint.',
  },
  {
    number: 2,
    name: 'HRP2 Absent',
    pldhLevel: 15,
    hrp2Present: false,
    backgroundInterference: false,
    styleClass: 'scenario-navy',
    tag: 'Why two antigens',
    challenge:
      'Some parasites do not produce detectable HRP2 (for example, because of hrp2 gene deletions). With no HRP2 line, the result depends on the weak pLDH line alone. This is why MalaBoost targets two independent antigens.',
    takeaway: 'A second, independent antigen line gives the test another way to show a signal when one antigen is missing.',
  },
  {
    number: 3,
    name: 'Background Interference',
    pldhLevel: 15,
    hrp2Present: true,
    backgroundInterference: true,
    styleClass: 'scenario-amber',
    tag: 'Key engineering tradeoff',
    challenge:
      'Enhancement can also darken the membrane around the line (non-specific background staining). Activate enhancement and watch the contrast: a darker line does not help if the background darkens too.',
    takeaway: 'An amplification step must be judged by contrast, not darkness: background staining can cancel the benefit.',
  },
]

// ---------- Simple calculation functions ----------

// Doubles the base pLDH intensity, but never goes above the maximum.
function calculateEnhancedIntensity(baseIntensity) {
  let enhanced = baseIntensity * ENHANCEMENT_MULTIPLIER
  if (enhanced > MAX_INTENSITY) {
    enhanced = MAX_INTENSITY
  }
  return enhanced
}

// The membrane only darkens when enhancement is on AND interference is on.
function calculateBackground(isEnhanced, backgroundInterference) {
  if (isEnhanced && backgroundInterference) {
    return INTERFERENCE_BACKGROUND
  }
  return NORMAL_BACKGROUND
}

// Contrast = Line Intensity - Background Intensity (never below 0).
function calculateContrast(lineIntensity, backgroundIntensity) {
  let contrast = lineIntensity - backgroundIntensity
  if (contrast < 0) {
    contrast = 0
  }
  return contrast
}

// Short description of what changed on the strip after enhancement.
function getEnhancementMessage(pldhLevel, enhancedPldh, backgroundInterference) {
  if (pldhLevel === 0) {
    return 'No pLDH line formed, so there was nothing for the enhancement step to darken. Enhancement can only strengthen a signal already captured at the line; it cannot create one.'
  }

  let message = 'The pLDH line darkened from ' + pldhLevel + ' to ' + enhancedPldh + ' units.'
  if (enhancedPldh === MAX_INTENSITY) {
    message = message + ' (It reached the maximum display value of ' + MAX_INTENSITY + '.)'
  }
  message = message + ' The HRP2 and control lines did not change, because this model only enhances the pLDH line.'

  if (backgroundInterference) {
    message =
      message + ' The membrane background also darkened from ' + NORMAL_BACKGROUND + ' to ' + INTERFERENCE_BACKGROUND + ' units.'
  }
  return message
}

// Compares contrast before and after. Returns an object with a style and a sentence.
function getContrastVerdict(beforeLine, afterLine, beforeContrast, afterContrast) {
  const verdict = { style: '', title: '', text: '' }

  if (afterContrast > beforeContrast) {
    verdict.style = 'verdict-good'
    verdict.title = 'Contrast improved'
    verdict.text =
      'Contrast rose from ' + beforeContrast + ' to ' + afterContrast + ' units, so the pLDH line stands out more from the membrane.'
  } else if (afterLine > beforeLine) {
    verdict.style = 'verdict-warning'
    verdict.title = 'Darker line, but no better contrast'
    verdict.text =
      'The line got darker (' + beforeLine + ' → ' + afterLine + '), but contrast went from ' + beforeContrast + ' to ' +
      afterContrast + ' units because the background darkened too. Stronger color is not the same as a clearer result.'
  } else {
    verdict.style = 'verdict-neutral'
    verdict.title = 'No change'
    if (beforeLine === 0) {
      verdict.text = 'There was no pLDH signal to amplify, so contrast stayed at ' + afterContrast + ' units.'
    } else {
      verdict.text = 'The line was already at the maximum display value, so enhancement could not change it.'
    }
  }
  return verdict
}

// ---------- Main page component ----------
function App() {
  // Simulation state (the values the user can change)
  const [pldhLevel, setPldhLevel] = useState(DEFAULT_PLDH_LEVEL)
  const [hrp2Present, setHrp2Present] = useState(true)
  const [backgroundInterference, setBackgroundInterference] = useState(false)
  const [isEnhanced, setIsEnhanced] = useState(false)
  const [scenarioMessage, setScenarioMessage] = useState('')
  const [selectedScenario, setSelectedScenario] = useState(0) // 0 means "none selected"

  // --- Calculations: run again every time the page redraws ---
  const enhancedPldh = calculateEnhancedIntensity(pldhLevel)

  // "Before" numbers: no enhancement yet
  const beforeLine = pldhLevel
  const beforeBackground = calculateBackground(false, backgroundInterference)
  const beforeContrast = calculateContrast(beforeLine, beforeBackground)

  // "After" numbers: enhancement applied
  const afterLine = enhancedPldh
  const afterBackground = calculateBackground(true, backgroundInterference)
  const afterContrast = calculateContrast(afterLine, afterBackground)

  // What the live cartridge should show right now
  let displayedPldh = beforeLine
  let displayedBackground = beforeBackground
  if (isEnhanced) {
    displayedPldh = afterLine
    displayedBackground = afterBackground
  }

  let hrp2Intensity = 0
  if (hrp2Present) {
    hrp2Intensity = HRP2_LINE_INTENSITY
  }

  const verdict = getContrastVerdict(beforeLine, afterLine, beforeContrast, afterContrast)

  // --- Event handlers ---
  function handleActivate() {
    setIsEnhanced(true)
  }

  function handleReset() {
    setPldhLevel(DEFAULT_PLDH_LEVEL)
    setHrp2Present(true)
    setBackgroundInterference(false)
    setIsEnhanced(false)
    setScenarioMessage('')
    setSelectedScenario(0)
  }

  function handleScenario(scenario) {
    setPldhLevel(scenario.pldhLevel)
    setHrp2Present(scenario.hrp2Present)
    setBackgroundInterference(scenario.backgroundInterference)
    setIsEnhanced(false)
    setScenarioMessage('Scenario ' + scenario.number + ' — ' + scenario.name + ': ' + scenario.challenge)
    setSelectedScenario(scenario.number)
    window.scrollTo({ top: 0, behavior: 'smooth' }) // jump back up to the cartridge
  }

  return (
    <div className="page">
      {/* ---------- Header ---------- */}
      <header className="header">
        <div>
          <h1>MalaBoost Interactive Lab</h1>
          <p className="subtitle">Exploring Dual-Antigen Detection and Optional Signal Amplification</p>
        </div>
        <div className="header-notes">
          <span className="badge">Educational Simulation — Not Clinical Data</span>
          <p className="disclaimer">Illustrative model only. Signal behavior is not based on experimental MalaBoost data.</p>
        </div>
      </header>

      {/* ---------- Main interface: fits on one laptop screen ---------- */}
      <section className="lab-grid">
        <div className="main-column">
          <div className="panel cartridge-panel">
            <Cartridge
              pldhIntensity={displayedPldh}
              hrp2Intensity={hrp2Intensity}
              controlIntensity={CONTROL_LINE_INTENSITY}
              backgroundIntensity={displayedBackground}
              isEnhanced={isEnhanced}
              onActivate={handleActivate}
            />
          </div>

          <div className="panel">
            <div className="panel-heading">
              <h2>Before vs. After Enhancement</h2>
              <span className="units-note">All values: arbitrary illustrative simulation units (0–100)</span>
            </div>
            <div className="card-row">
              <SignalCard
                title="Before Enhancement"
                hrp2Intensity={hrp2Intensity}
                controlIntensity={CONTROL_LINE_INTENSITY}
                lineIntensity={beforeLine}
                backgroundIntensity={beforeBackground}
                contrast={beforeContrast}
                isAvailable={true}
              />
              <SignalCard
                title="After Enhancement"
                hrp2Intensity={hrp2Intensity}
                controlIntensity={CONTROL_LINE_INTENSITY}
                lineIntensity={afterLine}
                backgroundIntensity={afterBackground}
                contrast={afterContrast}
                isAvailable={isEnhanced}
              />
            </div>
            {isEnhanced && (
              <div className={'verdict ' + verdict.style}>
                <strong>{verdict.title}.</strong> {verdict.text}
              </div>
            )}
            <p className="formula">Contrast = Line Intensity − Background Intensity</p>
          </div>
        </div>

        <div className="panel side-column">
          <h2>Simulation Controls</h2>

          <div className="control">
            <label htmlFor="pldh-slider">
              pLDH Level <span className="control-value">{pldhLevel}</span>
            </label>
            <input
              id="pldh-slider"
              type="range"
              min="0"
              max="100"
              value={pldhLevel}
              onChange={(event) => setPldhLevel(Number(event.target.value))}
            />
            <p className="hint">Darkness of the pLDH line before enhancement.</p>
          </div>

          <div className="control">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={hrp2Present}
                onChange={(event) => setHrp2Present(event.target.checked)}
              />
              HRP2 Present
            </label>
            <p className="hint">Unchecked: the HRP2 line disappears.</p>
          </div>

          <div className="control">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={backgroundInterference}
                onChange={(event) => setBackgroundInterference(event.target.checked)}
              />
              Background Interference
            </label>
            <p className="hint">Checked: the membrane darkens after enhancement.</p>
          </div>

          <button className="reset-button" onClick={handleReset}>
            Reset Simulation
          </button>

          {/* Explanations appear here so they stay next to the controls */}
          {scenarioMessage !== '' && (
            <div className="result-box">
              <strong>Engineering challenge</strong>
              <p>{scenarioMessage}</p>
            </div>
          )}
          {isEnhanced && (
            <div className="result-box">
              <strong>What happened</strong>
              <p>{getEnhancementMessage(pldhLevel, enhancedPldh, backgroundInterference)}</p>
            </div>
          )}
        </div>
      </section>

      {/* ---------- Test the Design ---------- */}
      <section className="panel">
        <h2>Test the Design</h2>
        <p className="hint">Load a scenario: the controls update, enhancement resets, and the page returns to the cartridge.</p>
        <div className="scenario-grid">
          {SCENARIOS.map((scenario) => {
            let cardClass = 'scenario-card ' + scenario.styleClass
            if (selectedScenario === scenario.number) {
              cardClass = cardClass + ' scenario-selected'
            }
            return (
              <div key={scenario.number} className={cardClass}>
                <span className="scenario-tag">{scenario.tag}</span>
                <h3>
                  Scenario {scenario.number}: {scenario.name}
                </h3>
                <p className="scenario-takeaway">
                  <strong>Takeaway:</strong> {scenario.takeaway}
                </p>
                <button className="scenario-button" onClick={() => handleScenario(scenario)}>
                  Load Scenario {scenario.number}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* ---------- Mechanism ---------- */}
      <section className="panel">
        <h2>Proposed Enhancement Mechanism</h2>
        <p className="proposed-flag">Proposed design — not experimentally demonstrated in MalaBoost</p>
        <ol className="mechanism-steps">
          <li>
            <strong>Capture.</strong> As the sample flows along the strip, antibodies on the HRP2 line and the pLDH line
            each capture their own antigen, together with a colored detection label.
          </li>
          <li>
            <strong>Optional press.</strong> If the pLDH line looks faint, the user can press the button to release an
            enhancement reagent toward the pLDH test line.
          </li>
          <li>
            <strong>Catalytic color enhancement.</strong> The proposal is that a catalytic reaction at the captured label
            produces extra color right at the pLDH line, making a faint line easier to see.
          </li>
          <li>
            <strong>Tradeoff.</strong> The same reagent could also stain the membrane around the line, raising the
            background and lowering contrast. Controlling this would be a key part of testing the design.
          </li>
        </ol>
      </section>

      {/* ---------- Key science points ---------- */}
      <section className="panel">
        <h2>Key Science Points</h2>
        <ul className="science-list">
          <li>
            <strong>HRP2</strong> and <strong>pLDH</strong> are two independent malaria antigens. Each has its own test
            line.
          </li>
          <li>In lateral-flow testing, antibodies on each line recognize and capture their specific antigen.</li>
          <li>MalaBoost proposes an optional, press-activated catalytic enhancement of the pLDH test line.</li>
          <li>Stronger color does not automatically mean greater diagnostic accuracy.</li>
          <li>Background staining and false-positive-looking signals are important engineering concerns.</li>
          <li>MalaBoost is a design concept and has not been experimentally validated.</li>
        </ul>
      </section>

      <footer className="footer">
        MalaBoost Interactive Lab — TSA Biotechnology Design educational simulation. Not a diagnostic tool.
        <br />
        Built from the <a href="https://shadcndashboard.dev/">Shadcn Dashboard</a> template (MIT License).
      </footer>
    </div>
  )
}

export default App
