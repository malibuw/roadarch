import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Center from './pages/Center.jsx'
import Cluster from './pages/Cluster.jsx'
import { startSimulation } from './telemetry/simulator'

startSimulation()

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/center" element={<Center />} />
      <Route path="/cluster" element={<Cluster />} />
    </Routes>
  </BrowserRouter>
)
