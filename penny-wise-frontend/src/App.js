
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Login from "./pages/Login";
import { Login } from './pages/Login.jsx';
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
import { UserSettings } from './pages/UserSettings.jsx';
import { EditTransaction } from './pages/EditTransaction.jsx';
// import './App.scss';


function App() {
  const [loginStatus, setLoginStatus]=useState(false)
  useEffect(() => {
    document.title = "Penny Wise";
  }, [])
  return (
    <div className="App">
      {/* <>
        <NavBar />

      </> */}
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path='/' element={<>
            {/* <NavBar/> */}
            <Home /></>} />
          <Route path='/t' element={<NavBar />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/new-transaction' element={<>
            {/* <NavBar /> */}

            <NewTransaction />
          </>
          } />
          <Route path='/update-transaction' element={<EditTransaction/>}/>
          <Route path='/manage-transactions' element={<>
            {/* <NavBar /> */}

            <ManageTransactions />
          </>
          } />
          <Route path='/manage-tags' element={<>
            {/* <NavBar /> */}

            <ManageTags />
          </>
          } />
          <Route path='/new-report' element={<>
            {/* <NavBar /> */}

            <NewReport />
          </>
          } />
          <Route path='/new-transaction' element={<>
            {/* <NavBar /> */}

            <NewTransaction />
          </>
          } />
          <Route path='/saved-reports' element={<>
            {/* <NavBar /> */}

            <SavedReports />
          </>
          } />

          <Route path='/user-settings' element={<>
            {/* <NavBar /> */}

            <UserSettings />
          </>
          } />




          <Route path='/manage-goals' element={<>
            <NavBar />

            <ManageGoals />
          </>
          } />

          {/* <Route path="/test" element={<Test/>}/> */}
          <Route path="*" element={<h1 style={{ margin: 0, padding: 0 }}>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
