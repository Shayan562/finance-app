
import React, { useEffect } from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
// import Login from "./pages/Login";
import  {Login} from './pages/Login.jsx';
import { SignUp } from './pages/Signup.jsx';
import { ForgotPassword } from './pages/ForgotPassword.jsx';
import { Home } from './pages/Home.jsx';
import { NewTransaction } from './pages/NewTransaction.jsx';
import { NavBar } from './components/NavBar.jsx';
import { ManageGoals } from './pages/ManageGoals.jsx';
import { ManageTransactions } from './pages/ManageTransactions.jsx';
import { ManageTags } from './pages/ManageTags.jsx';
import { NewReport } from './pages/NewReport.jsx';
import { SavedReports } from './pages/SavedReports.jsx';
// import './App.scss';


function App() {
  useEffect(()=>{
    document.title="Penny Wise";
},[])
  return (
    <div className="App">
      <BrowserRouter>
        {/* <Navbar/> */}
        <Routes> 
          <Route path='/' element={<>
          {/* <NavBar/> */}
          <Home/></>}/>
          <Route path='/t' element={<NavBar/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path='/new-transaction' element={<NewTransaction/>}/>
          <Route path='/manage-transactions' element={<ManageTransactions/>}/>
          <Route path='/manage-tags' element={<ManageTags/>}/>
          <Route path='/new-report' element={<NewReport/>}/>
          <Route path='/new-transaction' element={<NewTransaction/>}/>
          <Route path='/saved-reports' element={<SavedReports/>}/>




          <Route path='/manage-goals' element={<ManageGoals/>}/>
 
          {/* <Route path="/test" element={<Test/>}/> */}
          <Route path="*" element={<h1>404 Not Found</h1>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
