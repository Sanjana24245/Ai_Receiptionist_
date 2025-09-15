import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminAnalytics from "../screens/Admin/Admin_AnalyticsDashboard";
import AdminDoctor from "../screens/Admin/Admin_DoctorManagement";
import AdminSubAdmin from "../screens/Admin/Admin_SubAdminManagement";

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="doctors" element={<AdminDoctor />} />
        <Route path="subadmins" element={<AdminSubAdmin />} />
      </Routes>
    </AdminLayout>
  );
}
