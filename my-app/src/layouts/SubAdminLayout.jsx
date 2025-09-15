import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function SubAdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
