import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Transactions from './components/Transactions';
import Balance from './components/Balance';
import Services from './components/Services';
import Contact from './components/ContactUs';
import Reports from './pages/Reports';
import AskAI from './pages/AskAi';
import About from './components/About';
import CustomerSupport from './components/Customer';
import FinanceHealth from './components/FinanceHealthAnalytics';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/transactions' element={<Transactions/>} />
        <Route path='/balance' element={<Balance />} />
        <Route path='/About' element={<About/>}/>
        <Route path='*' element={<h1>Not Found</h1>} />
        <Route path='/services' element={<Services/>} />
        <Route path='/contactus' element={<Contact/>}/>
        <Route path='/reports' element={<Reports/>}/>
        <Route path="/talktoai" element={<AskAI/>} />
        <Route path='/home' element={<Home />} />
        <Route path="/customer-support" element={<CustomerSupport />} />
        <Route path='/finance' element={<FinanceHealth />}/>
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;