import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useCarStore } from '../store/useCarStore'

const MAPBOX_STYLE = 'mapbox://styles/icedmoca/cmeqyas1a00q101r99vze7oki'
const CONGRESS_START = [-110.969, 32.222]
const MAP_ZOOM = 18
const MAP_PITCH = 55
const MAP_BEARING = 90
const LNG_PER_FRAME = 0.000002

const accent = '#00e5c7'
const warn = '#ffb74d'
const danger = '#ff6b6b'
const signalGreen = '#22c55e'
const trendGray = 'rgba(160, 170, 180, 0.85)'
const glass = 'rgba(12, 18, 26, 0.35)'
const glassBorder = 'rgba(255,255,255,0.08)'
const glassBlur = 'blur(10px)'
const panelStyle = {
  backdropFilter: glassBlur,
  WebkitBackdropFilter: glassBlur
}

const ovalCardBg = 'radial-gradient(ellipse 75% 80% at 50% 50%, rgba(12, 18, 26, 0.6) 0%, rgba(12, 18, 26, 0.22) 40%, rgba(12, 18, 26, 0.03) 60%, transparent 75%)'

const ovalCardStyle = {
  padding: '12px 18px',
  borderRadius: '9999px',
  background: ovalCardBg,
  backdropFilter: glassBlur,
  WebkitBackdropFilter: glassBlur,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 80,
  minWidth: 100
}

function TurnArrow({ left, on }) {
  const path = left
    ? 'M 12 4 L 4 12 L 12 20 M 4 12 L 20 12'
    : 'M 12 4 L 20 12 L 12 20 M 20 12 L 4 12'
  return (
    <svg width={36} height={28} viewBox="0 0 24 24" fill="none" stroke={signalGreen} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: on ? 1 : 0.22, transition: 'opacity 0.2s' }}>
      <path d={path} />
    </svg>
  )
}

function SpeedTrend({ trend }) {
  if (trend === 'up') {
    return (
      <svg width={28} height={20} viewBox="0 0 24 24" fill="none" stroke={trendGray} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 12 19 L 12 5 M 6 11 L 12 5 L 18 11" />
      </svg>
    )
  }
  if (trend === 'down') {
    return (
      <svg width={28} height={20} viewBox="0 0 24 24" fill="none" stroke={trendGray} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 12 5 L 12 19 M 6 13 L 12 19 L 18 13" />
      </svg>
    )
  }
  return (
    <svg width={28} height={20} viewBox="0 0 24 24" fill="none" stroke={trendGray} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 5 12 L 19 12" />
      <path d="M 5 14 L 19 14" />
    </svg>
  )
}

function BoostCard({ value }) {
  const pct = Math.min(1, value / 18)
  const dash = 48 * pct
  return (
    <div style={ovalCardStyle}>
      <svg width={40} height={28} viewBox="0 0 40 28" style={{ marginBottom: '4px' }}>
        <path d="M 4 20 A 16 16 0 0 1 36 20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" strokeLinecap="round" />
        <path d="M 4 20 A 16 16 0 0 1 36 20" fill="none" stroke={warn} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${dash} 48`} style={{ transition: 'stroke-dasharray 0.2s' }} />
      </svg>
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>BOOST</div>
      <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{value.toFixed(1)} psi</div>
    </div>
  )
}

function OilCard({ value }) {
  const pct = Math.max(0, Math.min(1, (value - 160) / 80))
  const fillH = 4 + pct * 14
  const y = 26 - fillH
  return (
    <div style={ovalCardStyle}>
      <svg width={28} height={32} viewBox="0 0 28 32" style={{ marginBottom: '2px' }}>
        <ellipse cx="14" cy="6" rx="6" ry="4" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <path d="M 8 6 v 20 q 0 4 6 4 q 6 0 6 -4 v -20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <rect x="10" y={y} width="8" height={fillH} fill={accent} opacity="0.8" rx="1" style={{ transition: 'y 0.3s, height 0.3s' }} />
      </svg>
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>OIL</div>
      <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{Math.round(value)}°</div>
    </div>
  )
}

function CoolantCard({ value }) {
  const norm = Math.max(0, Math.min(1, (value - 160) / 60))
  const y = 22 - norm * 18
  const h = 2 + norm * 16
  return (
    <div style={ovalCardStyle}>
      <svg width={24} height={32} viewBox="0 0 24 32" style={{ marginBottom: '2px' }}>
        <rect x="8" y="2" width="8" height="22" rx="2" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <circle cx="12" cy="26" r="3" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <rect x="9.5" y={y} width="5" height={h} fill={accent} opacity="0.85" rx="1" style={{ transition: 'y 0.3s, height 0.3s' }} />
      </svg>
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>COOLANT</div>
      <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{Math.round(value)}°</div>
    </div>
  )
}

function AFRCard({ value }) {
  const isRich = value < 12.5
  return (
    <div style={ovalCardStyle}>
      <svg width={32} height={24} viewBox="0 0 32 24" style={{ marginBottom: '2px' }}>
        <circle cx="16" cy="12" r="8" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <path d="M 16 6 L 16 10 L 20 12 L 16 14 L 16 18" fill="none" stroke={isRich ? warn : accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'cluster-pulse 2s ease-in-out infinite' }} />
      </svg>
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>AFR</div>
      <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: '1rem', color: isRich ? warn : accent }}>{value.toFixed(1)}</div>
    </div>
  )
}

function BattCard({ value }) {
  const level = Math.min(1, (value - 11.5) / 2.5)
  return (
    <div style={ovalCardStyle}>
      <svg width={20} height={28} viewBox="0 0 20 28" style={{ marginBottom: '2px' }}>
        <rect x="2" y="4" width="16" height="20" rx="2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <rect x="7" y="1" width="6" height="3" rx="0.5" fill="rgba(255,255,255,0.4)" />
        <rect x="4" y={8 + (1 - level) * 16} width="12" height={level * 16} rx="1" fill={value >= 13.5 ? accent : warn} opacity="0.9" style={{ transition: 'height 0.3s' }} />
      </svg>
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>BATT</div>
      <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: '1rem', color: value >= 13.5 ? accent : warn }}>{value.toFixed(1)} V</div>
    </div>
  )
}

function GearCard({ gear }) {
  return (
    <div style={ovalCardStyle}>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: accent, marginBottom: '2px', fontVariantNumeric: 'tabular-nums', animation: 'cluster-soft-pulse 1.5s ease-in-out infinite' }}>{gear}</div>
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>GEAR</div>
    </div>
  )
}

function ModeCard({ mode }) {
  return (
    <div style={ovalCardStyle}>
      <svg width={28} height={20} viewBox="0 0 28 20" style={{ marginBottom: '2px' }}>
        <path d="M 4 10 L 10 4 L 16 10 L 22 4" fill="none" stroke={accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" strokeDasharray="6 4" style={{ animation: 'cluster-dash 3s linear infinite' }} />
      </svg>
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>MODE</div>
      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: accent }}>{mode}</div>
    </div>
  )
}

function FuelCard({ range, fuel, throttlePos }) {
  const level = Math.round(fuel * 100)
  return (
    <div style={ovalCardStyle}>
      <svg width={24} height={28} viewBox="0 0 24 28" style={{ marginBottom: '2px' }}>
        <path d="M 6 8 L 6 22 Q 6 26 12 26 Q 18 26 18 22 L 18 8 L 14 4 L 10 4 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="8" y={8 + (1 - fuel) * 14} width="8" height={fuel * 14} fill={fuel < 0.2 ? danger : accent} opacity="0.9" rx="1" style={{ transition: 'height 0.3s' }} />
      </svg>
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>FUEL</div>
      <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{Math.round(range)} mi</div>
      <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>to empty</div>
    </div>
  )
}

function RPMCard({ rpm }) {
  const pct = Math.min(1, rpm / 7000)
  const dash = 48 * pct
  const isHigh = rpm > 6000
  return (
    <div style={ovalCardStyle}>
      <svg width={40} height={28} viewBox="0 0 40 28" style={{ marginBottom: '4px' }}>
        <path d="M 4 20 A 16 16 0 0 1 36 20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" strokeLinecap="round" />
        <path d="M 4 20 A 16 16 0 0 1 36 20" fill="none" stroke={isHigh ? warn : accent} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${dash} 48`} style={{ transition: 'stroke-dasharray 0.15s' }} />
      </svg>
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>RPM</div>
      <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: '1rem', color: isHigh ? warn : '#fff' }}>{rpm.toLocaleString()}</div>
    </div>
  )
}

export default function Cluster() {
  const {
    speed,
    rpm,
    gear,
    fuel,
    coolantTemp,
    oilTemp,
    batteryVoltage,
    afr,
    boostPsi,
    gForceX,
    gForceY,
    outsideTemp,
    range,
    tripA,
    tripB,
    odometer,
    time,
    leftSignal,
    rightSignal,
    headlights,
    tractionControl,
    laneAssist,
    driveMode,
    warning,
    throttlePos
  } = useCarStore()

  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const prevSpeedRef = useRef(speed)

  const speedTrend = speed > prevSpeedRef.current ? 'up' : speed < prevSpeedRef.current ? 'down' : 'same'
  useEffect(() => {
    prevSpeedRef.current = speed
  }, [speed])

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    if (!token || !mapContainerRef.current) return

    mapboxgl.accessToken = token
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_STYLE,
      center: [...CONGRESS_START],
      zoom: MAP_ZOOM,
      pitch: MAP_PITCH,
      bearing: MAP_BEARING,
      antialias: true
    })

    let animationId
    const centerRef = { current: [...CONGRESS_START] }

    function animate() {
      centerRef.current[0] += LNG_PER_FRAME
      map.jumpTo({
        center: [...centerRef.current],
        zoom: MAP_ZOOM,
        pitch: MAP_PITCH,
        bearing: MAP_BEARING
      })
      animationId = requestAnimationFrame(animate)
    }

    map.on('load', () => {
      map.setFog({
        color: 'rgb(220, 230, 240)',
        'horizon-blend': 0.02
      })
      map.dragPan.disable()
      map.dragRotate.disable()
      map.scrollZoom.disable()
      map.doubleClickZoom.disable()
      map.touchZoomRotate.disable()
      map.keyboard.disable()
      animationId = requestAnimationFrame(animate)
    })

    mapRef.current = map
    const onResize = () => map.resize()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', onResize)
      map.remove()
      mapRef.current = null
    }
  }, [])

  const gMag = Math.min(1.5, Math.sqrt(gForceX * gForceX + gForceY * gForceY))

  return (
    <div className="cluster-root" style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <style>{`
          @keyframes cluster-blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.2; }
          }
          @keyframes cluster-pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          @keyframes cluster-soft-pulse {
            0%, 100% { opacity: 0.9; }
            50% { opacity: 1; }
          }
          @keyframes cluster-dash {
            to { stroke-dashoffset: -20; }
          }
          .cluster-root { --cluster-accent: ${accent}; --cluster-warn: ${warn}; --cluster-danger: ${danger}; }
          .cluster-turn-on { animation: cluster-blink 1s ease-in-out infinite; }
        `}</style>

        <div style={{ minHeight: '100vh', color: '#e4e8ec', fontFamily: '"Outfit", system-ui, sans-serif', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>

          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 18px', background: glass, borderRadius: '12px', border: `1px solid ${glassBorder}`, ...panelStyle }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.05em' }}>{time}</span>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>OUT {outsideTemp}°C</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>A {tripA.toFixed(1)}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>B {tripB.toFixed(1)}</span>
              <span style={{ color: accent, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{Math.round(range)} mi</span>
            </div>
          </div>

          {warning && (
            <div style={{ padding: '10px 20px', background: 'rgba(255,107,107,0.25)', border: '1px solid rgba(255,107,107,0.4)', borderRadius: '10px', color: danger, fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.05em', textAlign: 'center', ...panelStyle }}>{warning}</div>
          )}

          {/* Center cluster: speed oval in middle, cards around it */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', flex: 1 }}>
            {/* Top: Boost, Oil, Coolant */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <BoostCard value={boostPsi} />
              <OilCard value={oilTemp} />
              <CoolantCard value={coolantTemp} />
            </div>

            {/* Middle: Left cards | Speed oval | Right cards */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AFRCard value={afr} />
                <BattCard value={batteryVoltage} />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                padding: '14px 36px',
                minWidth: 340,
                borderRadius: '9999px',
                background: 'radial-gradient(ellipse 70% 90% at 50% 50%, rgba(12, 18, 26, 0.72) 0%, rgba(12, 18, 26, 0.25) 35%, rgba(12, 18, 26, 0.04) 55%, transparent 70%)',
                backdropFilter: glassBlur,
                WebkitBackdropFilter: glassBlur
              }}>
                <div className={leftSignal ? 'cluster-turn-on' : ''} style={{ color: signalGreen, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <TurnArrow left on={leftSignal} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 200 }}>
                  <div style={{ fontSize: '6rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1, width: 200, textAlign: 'center', background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.88) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{speed}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '-4px' }}>
                    <span style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.2em' }}>MPH</span>
                    <SpeedTrend trend={speedTrend} />
                  </div>
                </div>
                <div className={rightSignal ? 'cluster-turn-on' : ''} style={{ color: signalGreen, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <TurnArrow left={false} on={rightSignal} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <GearCard gear={gear} />
                <ModeCard mode={driveMode} />
              </div>
            </div>

            {/* Bottom: Fuel, RPM */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <FuelCard range={range} fuel={fuel} throttlePos={throttlePos} />
              <RPMCard rpm={rpm} />
            </div>
          </div>

          {/* Bottom row: LIGHTS, TC, LANE, odometer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: glass, borderRadius: '12px', border: `1px solid ${glassBorder}`, ...panelStyle }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {headlights && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>LIGHTS</span>}
              {tractionControl && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>TC</span>}
              {laneAssist && <span style={{ color: accent, fontSize: '0.8rem' }}>LANE</span>}
            </div>
            <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500, fontSize: '0.9rem' }}>{odometer.toLocaleString()} mi</span>
          </div>
        </div>

        {/* G-force overlay */}
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', width: 80, height: 80, borderRadius: '50%', background: 'rgba(12, 18, 26, 0.4)', border: `2px solid ${glassBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', ...panelStyle }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: gMag > 0.5 ? (gMag > 1 ? danger : warn) : accent, transform: `translate(${gForceX * 18}px, ${-gForceY * 18}px)`, transition: 'transform 0.08s ease-out', opacity: 0.9 }} />
          <div style={{ position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>G</div>
        </div>
      </div>
    </div>
  )
}
