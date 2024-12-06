import React from 'react'
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/saga-green/theme.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MySidebar from "./MySidebar";
import Dashboard from "./Dashboard";
import Details from "./Details";
import Incomes from "./Incomes";
import Expenses from "./Expenses";
import AuthPage from "./AuthPage";
import NotFound from './NotFound';

const App = () => {
  return (
      <BrowserRouter>
        <PrimeReactProvider>  
          <Routes>
            <Route exact path="/" element={<AuthPage />}/>
            <Route exact path="/home" element={<><MySidebar/><Dashboard /></>}/>
            <Route exact path="/detail" element={<><MySidebar /><Details/></>}/>
            <Route exact path="/income" element={<><MySidebar /><Incomes/></>}/>
            <Route exact path="/expense" element={<><MySidebar /><Expenses/></>}/>
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </PrimeReactProvider>
      </BrowserRouter>
  )
}

export default App
