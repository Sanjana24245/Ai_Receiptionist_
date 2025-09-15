import { Routes, Route } from "react-router-dom";
import SubAdminLayout from "../layouts/SubAdminLayout";
import AnalyticsDashboard from "../screens/SubAdmin/AnalyticsDashboard";
import Appointment from "../screens/SubAdmin/Appointment";
import CallsManagement from "../screens/SubAdmin/CallsManagement";
import Chatbot from "../screens/SubAdmin/Chatbot";
import DoctorManagement from "../screens/SubAdmin/DoctorManagement";
import PatientManagement from "../screens/SubAdmin/PatientManagement";

export default function SubAdminRoutes() {
  return (
    <SubAdminLayout>
      <Routes>
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="appointments" element={<Appointment />} />
        <Route path="calls" element={<CallsManagement />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="doctors" element={<DoctorManagement />} />
        <Route path="patients" element={<PatientManagement />} />
      </Routes>
    </SubAdminLayout>
  );
}
