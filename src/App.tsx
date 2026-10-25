import { Suspense, lazy, useEffect, useState } from 'react'
import './App.css'

const CyberCoreScene = lazy(() => import('./components/CyberCoreScene'))

type PaletteKey = 'cyan' | 'violet' | 'emerald'

type Palette = {
  name: string
  accent: string
  secondary: string
  glow: string
  edge: string
  body: string
}

const palettePresets: Record<PaletteKey, Palette> = {
  cyan: {
    name: 'Cyan',
    accent: '#6fe7ff',
    secondary: '#2f8cff',
    glow: '#85f6ff',
    edge: '#96dbff',
    body: '#0d1a23',
  },
  violet: {
    name: 'Violet',
    accent: '#d7a2ff',
    secondary: '#8f61ff',
    glow: '#b98dff',
    edge: '#f1dcff',
    body: '#170f2d',
  },
  emerald: {
    name: 'Emerald',
    accent: '#77f8c6',
    secondary: '#30d8a6',
    glow: '#a0ffd7',
    edge: '#d8fff0',
    body: '#081d1d',
  },
}

function App() {
  const [selectedPalette, setSelectedPalette] = useState<PaletteKey>('cyan')
  const [wireframe, setWireframe] = useState(false)
  const [paused, setPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [webglAvailable, setWebglAvailable] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handlePreferenceChange = () => {
      const reducedMotion = mediaQuery.matches
      setPrefersReducedMotion(reducedMotion)
      if (reducedMotion) {
        setPaused(true)
      }
    }

    handlePreferenceChange()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handlePreferenceChange)
      return () => mediaQuery.removeEventListener('change', handlePreferenceChange)
    }

    mediaQuery.addListener(handlePreferenceChange)
    return () => mediaQuery.removeListener(handlePreferenceChange)
  }, [])

  useEffect(() => {
    const supported = typeof window !== 'undefined' && !!window.WebGLRenderingContext
    setWebglAvailable(supported)
  }, [])

  const activePalette = palettePresets[selectedPalette]

  const resetDefaults = () => {
    setSelectedPalette('cyan')
    setWireframe(false)
    setPaused(prefersReducedMotion)
  }

  const animationStatus = prefersReducedMotion ? 'Reduced motion' : paused ? 'Paused' : 'Running'

  return (
    <div className="app-shell">
      <div className="scanlines" aria-hidden="true" />

      <header className="topbar">
        <div className="brand" aria-label="Cyber Core label">
          <span className="brand-mark" aria-hidden="true" />
          CYBER CORE
        </div>
        <div className="status-pill" aria-live="polite">
          <span className="status-dot" aria-hidden="true" />
          {animationStatus}
        </div>
      </header>

      <main className="dashboard">
        <section className="content-panel">
          <p className="eyebrow">AUTONOMOUS SECURITY LATTICE</p>
          <h1>Threat intelligence, rendered live.</h1>
          <p className="lede">
            A secure-by-design core that visualizes signal stability, network defense,
            and lockstep resilience through a responsive 3D computational engine.
          </p>

          <div className="control-group" aria-label="Core controls">
            <div className="preset-row" role="group" aria-label="Material palettes">
              {(Object.keys(palettePresets) as PaletteKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`preset-button ${selectedPalette === key ? 'selected' : ''}`}
                  style={{
                    ['--swatch' as string]: palettePresets[key].accent,
                    ['--swatch-soft' as string]: palettePresets[key].secondary,
                  }}
                  onClick={() => setSelectedPalette(key)}
                  aria-label={`Select ${palettePresets[key].name} palette`}
                  aria-pressed={selectedPalette === key}
                >
                  <span className="preset-dot" aria-hidden="true" />
                  {palettePresets[key].name}
                </button>
              ))}
            </div>

            <div className="action-row">
              <button
                type="button"
                className="action-button"
                onClick={() => setWireframe((current) => !current)}
                aria-label={wireframe ? 'Disable wireframe' : 'Enable wireframe'}
                aria-pressed={wireframe}
              >
                {wireframe ? 'Wireframe: On' : 'Wireframe: Off'}
              </button>

              <button
                type="button"
                className="action-button"
                onClick={() => setPaused((current) => !current)}
                aria-label={paused ? 'Resume animation' : 'Pause animation'}
              >
                {paused ? 'Resume' : 'Pause'}
              </button>

              <button
                type="button"
                className="action-button secondary"
                onClick={resetDefaults}
                aria-label="Reset Cyber Core settings"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="status-panel" aria-live="polite">
            <div>
              <span className="label">Selected</span>
              <strong>{activePalette.name}</strong>
            </div>
            <div>
              <span className="label">Animation</span>
              <strong>{animationStatus}</strong>
            </div>
            <div>
              <span className="label">Mode</span>
              <strong>{wireframe ? 'Wireframe' : 'Solid'}</strong>
            </div>
          </div>
        </section>

        <section className="scene-panel" aria-label="3D cyber core scene">
          {!webglAvailable ? (
            <div className="webgl-fallback" role="status">
              WebGL is unavailable in this browser, so the core is displayed as a static
              diagnostic panel.
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="scene-fallback" role="status" aria-live="polite">
                  Initializing network lattice…
                </div>
              }
            >
              <CyberCoreScene
                preset={activePalette}
                wireframe={wireframe}
                paused={paused || prefersReducedMotion}
                reducedMotion={prefersReducedMotion}
              />
            </Suspense>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
