import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LihatKulkas from './pages/LihatKulkas'
import Selamatkan from './pages/Selamatkan'
import PoinBerkah from './pages/PoinBerkah'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Verify from './pages/Verify'
import Success from './pages/Success'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/success" element={<Success />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kulkas" element={<LihatKulkas />} />
        <Route path="/selamatkan" element={<Selamatkan />} />
        <Route path="/poin" element={<PoinBerkah />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App