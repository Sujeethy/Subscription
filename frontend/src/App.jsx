import React from 'react'
import Subscription from './components/Subscription'
import RevenueReport from './components/RevenueReport'
import { Link,BrowserRouter,Routes,Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { SnackbarProvider, useSnackbar } from 'notistack';

function App() {
  
  return (<>  
  
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={
        
        <SnackbarProvider maxSnack={3}>
        <Subscription />
        </SnackbarProvider>
        
        } />
      <Route path="/report" element={<RevenueReport />} />
      
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App