import { create } from 'zustand'

export const useCarStore = create((set) => ({
  // Primary gauges
  speed: 0,
  rpm: 0,
  fuel: 0.72,
  gear: 'D',

  // Extended cluster data
  outsideTemp: 18,        // °C
  range: 312,             // miles
  tripA: 47.3,
  tripB: 128.6,
  odometer: 28471,
  time: '14:32',
  turnSignalLeft: false,
  turnSignalRight: false,
  highBeams: false,
  headlights: true,
  fogLights: false,
  cruiseControl: true,
  cruiseSetSpeed: 65,
  laneAssist: true,
  tirePressureFL: 34,
  tirePressureFR: 33,
  tirePressureRL: 35,
  tirePressureRR: 34,
  doorOpen: false,
  seatbeltWarning: false,
  checkEngine: false,

  // Powertrain / Performance
  boostPsi: 0,
  maf: 0,              // g/s
  intakeTemp: 85,      // °F
  coolantTemp: 185,    // °F
  oilTemp: 190,        // °F
  oilPressure: 45,     // psi
  batteryVoltage: 14.2,
  throttlePos: 0,       // %
  afr: 14.7,           // air fuel ratio
  load: 0,             // %
  timingAdvance: 12,   // degrees
  iat: 80,             // intake air temp
  ambientTemp: 72,
  gForceX: 0,
  gForceY: 0,

  // System state
  driveMode: 'Sport',
  leftSignal: false,
  rightSignal: false,
  tractionControl: true,
  engineTemp: 185,
  warning: null,

  setSpeed: (speed) => set({ speed }),
  setRPM: (rpm) => set({ rpm }),
  setFuel: (fuel) => set({ fuel }),
  setGear: (gear) => set({ gear }),
  setBoostPsi: (v) => set({ boostPsi: v }),
  setMaf: (v) => set({ maf: v }),
  setIntakeTemp: (v) => set({ intakeTemp: v }),
  setCoolantTemp: (v) => set({ coolantTemp: v }),
  setOilTemp: (v) => set({ oilTemp: v }),
  setOilPressure: (v) => set({ oilPressure: v }),
  setBatteryVoltage: (v) => set({ batteryVoltage: v }),
  setThrottlePos: (v) => set({ throttlePos: v }),
  setAfr: (v) => set({ afr: v }),
  setLoad: (v) => set({ load: v }),
  setTimingAdvance: (v) => set({ timingAdvance: v }),
  setIat: (v) => set({ iat: v }),
  setAmbientTemp: (v) => set({ ambientTemp: v }),
  setGForceX: (v) => set({ gForceX: v }),
  setGForceY: (v) => set({ gForceY: v }),
  setOutsideTemp: (outsideTemp) => set({ outsideTemp }),
  setRange: (range) => set({ range }),
  setTripA: (tripA) => set({ tripA }),
  setTripB: (tripB) => set({ tripB }),
  setOdometer: (odometer) => set({ odometer }),
  setTime: (time) => set({ time }),
  setTurnSignalLeft: (turnSignalLeft) => set({ turnSignalLeft }),
  setTurnSignalRight: (turnSignalRight) => set({ turnSignalRight }),
  setHighBeams: (highBeams) => set({ highBeams }),
  setCruiseControl: (cruiseControl) => set({ cruiseControl }),
  setCruiseSetSpeed: (cruiseSetSpeed) => set({ cruiseSetSpeed }),
  setDriveMode: (driveMode) => set({ driveMode }),
  setLeftSignal: (v) => set({ leftSignal: v }),
  setRightSignal: (v) => set({ rightSignal: v }),
  setHeadlights: (v) => set({ headlights: v }),
  setTractionControl: (v) => set({ tractionControl: v }),
  setEngineTemp: (t) => set({ engineTemp: t }),
  setWarning: (w) => set({ warning: w }),
  updateCluster: (data) => set(data)
}))
