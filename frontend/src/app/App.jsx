import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../features/home/pages/Home'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import Verify from '../features/auth/pages/Verify'
import Success from '../features/auth/pages/Success'

import DashboardLayout from '../components/layouts/DashboardLayout'
// import ProtectedRoute from '../components/layouts/ProtectedRoute'

import Dashboard from '../features/dashboard/pages/Dashboard'
import LihatKulkas from '../features/kulkas/pages/LihatKulkas'
import Selamatkan from '../features/selamatkan/pages/Selamatkan'
import PoinBerkah from '../features/poin/pages/PoinBerkah'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/verify"    element={<Verify />} />
        <Route path="/success"   element={<Success />} />

        {/* <Route element={<ProtectedRoute />}> */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/kulkas"     element={<LihatKulkas />} />
            <Route path="/selamatkan" element={<Selamatkan />} />
            <Route path="/poin"       element={<PoinBerkah />} />
          </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App