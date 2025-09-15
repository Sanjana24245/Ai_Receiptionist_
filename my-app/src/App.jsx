import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import SubAdminRoutes from "./routes/SubAdminRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes (login, register) */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        {/* SubAdmin routes */}
        <Route
          path="/subadmin/*"
          element={
            <ProtectedRoute role="subadmin">
              <SubAdminRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
