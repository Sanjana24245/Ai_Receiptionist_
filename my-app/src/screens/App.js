
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import DoctorManagement from './components/DoctorManagement';
import PatientManagement from './components/PatientManagement';
import CallsManagement from './components/CallsManagement';
import Sidebar from './components/Sidebar';
import Appointment from './components/Appointment';
import Navbar from './components/Navbar';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [calls, setCalls] = useState([]); // Added calls state

  return (
    <Router>
      <Routes>
        {/* Login & Register */}
        <Route path="/" element={<LoginForm onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Main Pages */}
        <Route 
          path="/Sidebar" 
          element={<Sidebar doctors={doctors} patients={patients} calls={calls} />} 
        />
        <Route 
          path="/Navbar" 
          element={<Navbar doctors={doctors} patients={patients} calls={calls} />} 
        />
        <Route path="/AnalyticsDashboard" element={<AnalyticsDashboard />} />
        <Route 
          path="/DoctorManagement" 
          element={<DoctorManagement doctors={doctors} setDoctors={setDoctors} />} 
        />
        <Route 
          path="/PatientManagement" 
          element={<PatientManagement patients={patients} setPatients={setPatients} />} 
        />
        
        <Route 
          path="/CallsManagement" 
          element={<CallsManagement calls={calls} />} 
        />
        
        <Route 
          path="/PatientManagement" 
          element={<PatientManagement patients={patients} setPatients={setPatients} />} 
        />
        <Route 
          path="/Appointment" 
          element={<Appointment patients={patients} setPatients={setPatients} />} 
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
