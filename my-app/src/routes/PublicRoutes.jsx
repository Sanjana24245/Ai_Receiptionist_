import { Routes, Route } from "react-router-dom";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Routes>
  );
}
