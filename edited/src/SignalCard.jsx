// SignalCard.jsx — one Before or After card.
// It shows a small test-strip picture, a large contrast number,
// and two thin bars for line and background intensity.
// Each bar's width (in %) equals its value, since values go from 0 to 100.

import { TestStrip } from './Cartridge.jsx'

function Bar(props) {
  return (
    <div className="bar-row">
      <div className="bar-label">
        <span>{props.label}</span>
        <strong>{props.value}</strong>
      </div>
      <div className="bar-track">
        <div className={'bar-fill ' + props.colorClass} style={{ width: props.value + '%' }}></div>
      </div>
    </div>
  )
}

function SignalCard(props) {
  if (!props.isAvailable) {
    return (
      <div className="signal-card signal-card-empty">
        <h3>{props.title}</h3>
        <div className="strip-placeholder">Not activated yet</div>
        <p className="hint">Press "Activate Enhancement" on the cartridge to see the enhanced strip.</p>
      </div>
    )
  }

  return (
    <div className="signal-card">
      <h3>{props.title}</h3>
      <TestStrip
        hrp2Intensity={props.hrp2Intensity}
        pldhIntensity={props.lineIntensity}
        controlIntensity={props.controlIntensity}
        backgroundIntensity={props.backgroundIntensity}
        sizeClass="strip-small"
      />

      <div className="contrast-box">
        <span className="contrast-label">Illustrative contrast</span>
        <span className="contrast-value">{props.contrast}</span>
        <span className="contrast-units">units</span>
      </div>

      <Bar label="pLDH line intensity" value={props.lineIntensity} colorClass="bar-line" />
      <Bar label="Background intensity" value={props.backgroundIntensity} colorClass="bar-background" />
    </div>
  )
}

export default SignalCard
