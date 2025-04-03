import React from 'react'
import AppRoutes from './routes/AppRoutes.jsx'
import  UserProvider  from './context/User.context.jsx'
import 'remixicon/fonts/remixicon.css'

const App = () => {
  return (
     <UserProvider>
        <AppRoutes />
     </UserProvider>
  )
}

export default App