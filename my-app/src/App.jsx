
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./screens/Register";
import LoginForm from "./screens/Login";
import Chatbot from "./screens/Chatbot";
import AnalyticsDashboard from './screens/AnalyticsDashboard';
import DoctorManagement from './screens/DoctorManagement';
import PatientManagement from './screens/PatientManagement';
import CallsManagement from './screens/CallsManagement';
import Sidebar from './screens/Sidebar';
import Appointment from './screens/Appointment';
import Navbar from './screens/Navbar';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [calls, setCalls] = useState([]); // Added calls state

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />

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
          path="/Appointment" 
          element={<Appointment patients={patients} setPatients={setPatients} />} 
        />
      </Routes>
    </Router>
  );
}
