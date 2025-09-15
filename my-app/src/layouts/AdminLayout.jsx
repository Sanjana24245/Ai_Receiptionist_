import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout({ children }) {
  const role = "admin"; // hardcoded for now, or get from AuthContext

  return (
    <div className="flex">
      <Sidebar role={role} /> {/* ✅ Pass role here */}
      <div className="flex-1">
        <Navbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
