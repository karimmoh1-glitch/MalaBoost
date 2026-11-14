// Cartridge.jsx — draws the lateral-flow test cartridge and its test strip.
// It does no simulation math. It only displays the numbers App.jsx gives it.

// Turns an intensity (0 to 100) into a solid color between white and dark purple-red.
// 0 = white, 100 = rgb(110, 30, 80). Each color channel moves part of the way
// from 255 toward the dark color, using basic arithmetic.
export function intensityToColor(intensity) {
  const fraction = intensity / 100
  const red = Math.round(255 - (255 - 110) * fraction)
  const green = Math.round(255 - (255 - 30) * fraction)
  const blue = Math.round(255 - (255 - 80) * fraction)
  return 'rgb(' + red + ', ' + green + ', ' + blue + ')'
}

// A line can never look lighter than the membrane it sits on.
// If the line is fainter than the background, it simply blends in (contrast 0).
function visibleIntensity(lineIntensity, backgroundIntensity) {
  if (lineIntensity < backgroundIntensity) {
    return backgroundIntensity
  }
  return lineIntensity
}

// The membrane strip with its three lines. Used by the cartridge AND by the
// Before / After comparison cards, so all three pictures are drawn the same way.
export function TestStrip(props) {
  const background = props.backgroundIntensity
  const hrp2Shown = visibleIntensity(props.hrp2Intensity, background)
  const pldhShown = visibleIntensity(props.pldhIntensity, background)
  const controlShown = visibleIntensity(props.controlIntensity, background)

  return (
    <div className={'strip ' + props.sizeClass}>
      <div className="strip-labels">
        <span>HRP2</span>
        <span>pLDH</span>
        <span>C</span>
      </div>
      <div className="membrane" style={{ backgroundColor: intensityToColor(background) }}>
        <div className="test-line" style={{ backgroundColor: intensityToColor(hrp2Shown) }}></div>
        <div className="test-line" style={{ backgroundColor: intensityToColor(pldhShown) }}></div>
        <div className="test-line" style={{ backgroundColor: intensityToColor(controlShown) }}></div>
      </div>
    </div>
  )
}

function Cartridge(props) {
  let buttonText = 'Activate Enhancement'
  if (props.isEnhanced) {
    buttonText = 'Enhancement Active'
  }

  return (
    <div className="cartridge">
      <div className="cartridge-top">
        <div>
          <span className="cartridge-brand">MalaBoost</span>
          <span className="cartridge-model">Dual-antigen RDT · design concept</span>
        </div>
        {props.isEnhanced && <span className="status-chip">pLDH enhanced</span>}
      </div>

      <div className="cartridge-body">
        {/* Sample well */}
        <div className="well-area">
          <div className="sample-well">
            <div className="sample-well-inner"></div>
          </div>
          <span className="cartridge-label">S · Sample</span>
        </div>

        {/* Result window showing the membrane strip */}
        <div className="window-area">
          <div className="result-window">
            <TestStrip
              hrp2Intensity={props.hrp2Intensity}
              pldhIntensity={props.pldhIntensity}
              controlIntensity={props.controlIntensity}
              backgroundIntensity={props.backgroundIntensity}
              sizeClass="strip-large"
            />
          </div>
          <div className="flow-label">Sample flow →</div>
        </div>

        {/* Press-activated enhancement button */}
        <div className="press-area">
          <button className="enhance-button" onClick={props.onActivate} disabled={props.isEnhanced}>
            {buttonText}
          </button>
          <span className="cartridge-label">Press to enhance pLDH</span>
        </div>
      </div>
    </div>
  )
}

export default Cartridge
