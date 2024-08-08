import React from 'react'
import Subscription from './components/Subscription'
import RevenueReport from './components/RevenueReport'
import { Link,BrowserRouter,Routes,Route } from 'react-router-dom'
import Navbar from './components/Navbar'
function App() {
  return (<>  
  
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Subscription />} />
      <Route path="/report" element={<RevenueReport />} />
      
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App