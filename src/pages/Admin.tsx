import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';

export default function Admin() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#17388E] text-white py-20 px-6 relative">
      {/* ✅ Logout Button */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          Logout
        </button>
      </div>

      <h1 className="text-4xl font-bold text-center mb-12">Admin Dashboard</h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link to="/admin/upload">
          <div className="bg-white text-black p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition">
            <h2 className="text-2xl font-semibold mb-2">📸 Upload Images</h2>
            <p>Upload and preview photos for a new project folder.</p>
          </div>
        </Link>

        <Link to="/admin/invoices/create">
          <div className="bg-white text-black p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition">
            <h2 className="text-2xl font-semibold mb-2">🧾 Generate Invoice</h2>
            <p>Create and send invoices for client bookings.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
