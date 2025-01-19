import React from 'react'
import { BrowserRouter, Route ,Routes} from 'react-router-dom'
import Login from '../pages/Login.jsx'
import Signup from '../pages/Signup.jsx'
import Home from '../pages/Home.jsx'

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes