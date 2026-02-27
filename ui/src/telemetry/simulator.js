import { useCarStore } from '../store/useCarStore'

export function startSimulation() {
  const {
    setSpeed,
    setRPM,
    setFuel,
    setGear,
    setDriveMode,
    setLeftSignal,
    setRightSignal,
    setEngineTemp,
    setWarning,
    setBoostPsi,
    setMaf,
    setIntakeTemp,
    setCoolantTemp,
    setOilTemp,
    setOilPressure,
    setBatteryVoltage,
    setThrottlePos,
    setAfr,
    setLoad,
    setTimingAdvance,
    setIat,
    setAmbientTemp,
    setGForceX,
    setGForceY
  } = useCarStore.getState()

  let speed = 0
  let prevSpeed = 0

  setInterval(() => {
    const state = useCarStore.getState()

    speed += Math.random() * 10 - 5
    speed = Math.max(0, Math.min(140, speed))

    setSpeed(Math.floor(speed))
    const rpm = Math.floor(speed * 50 + 800)
    setRPM(rpm)

    setFuel(Math.max(0, state.fuel - 0.0005))

    const gears = ['P', 'R', 'N', 'D']
    setGear(gears[Math.floor(Math.random() * gears.length)])

    const modes = ['Eco', 'Comfort', 'Sport', 'Track']
    setDriveMode(modes[Math.floor(Math.random() * modes.length)])

    setLeftSignal(Math.random() > 0.8)
    setRightSignal(Math.random() > 0.8)

    setEngineTemp(170 + Math.random() * 40)

    if (Math.random() > 0.97) {
      setWarning('LOW TIRE PRESSURE')
    } else {
      setWarning(null)
    }

    // Derived powertrain (realistic, not random)
    const throttlePos = Math.min(100, (speed / 120) * 100 + (Math.random() - 0.5) * 10)
    setThrottlePos(Math.max(0, throttlePos))

    const boostPsi = Math.max(0, (throttlePos / 100) * (rpm / 7000) * 18)
    setBoostPsi(boostPsi)

    const maf = throttlePos * 0.8 + rpm * 0.02
    setMaf(maf)

    setAfr(throttlePos > 60 ? 11.8 : 14.7)

    const oilTemp = 180 + (rpm / 7000) * 40
    setOilTemp(oilTemp)

    const oilPressure = 20 + rpm * 0.01
    setOilPressure(oilPressure)

    setBatteryVoltage(13.5 + Math.random() * 0.5)

    const coolantTemp = 170 + (rpm / 7000) * 30 + (throttlePos / 100) * 15
    setCoolantTemp(coolantTemp)

    const load = Math.min(100, (throttlePos / 100) * (rpm / 7000) * 100)
    setLoad(load)

    setTimingAdvance(8 + (rpm / 7000) * 20 - (throttlePos / 100) * 4)

    const ambientTemp = 72
    setAmbientTemp(ambientTemp)
    setIntakeTemp(ambientTemp + load * 0.25)
    setIat(ambientTemp + load * 0.2)

    const gForceX = (speed - prevSpeed) * 0.015
    const gForceY = (Math.random() - 0.5) * 0.1
    setGForceX(Math.max(-1, Math.min(1, gForceX)))
    setGForceY(Math.max(-0.5, Math.min(0.5, gForceY)))

    prevSpeed = speed
  }, 200)
}
