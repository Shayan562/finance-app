
import React, { useEffect } from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
// import Login from "./pages/Login";
import  {Login} from './pages/Login.jsx';
import { SignUp } from './pages/Signup.jsx';
import { ForgotPassword } from './pages/ForgotPassword.jsx';
import { Home } from './pages/Home.jsx';
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
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          {/* <Route path="/test" element={<Test/>}/> */}
          <Route path="*" element={<h1>404 Not Found</h1>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
