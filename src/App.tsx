import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GalleryPage from './pages/GalleryPage';
import GalleryProjectPage from './pages/GalleryProjectPage';
import Book from './pages/Book';
import PaymentPage from './pages/PaymentPage';
import Login from './pages/Login';
import Admin from './pages/Admin';
import CreateInvoice from './pages/admin/CreateInvoice';
import InvoicePreview from './pages/admin/InvoicePreview';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { AuthProvider } from './utils/AuthContext';
import PrivateRoute from './utils/PrivateRoute';

import 'react-datepicker/dist/react-datepicker.css';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-sans text-white scroll-smooth bg-[#17388E]">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* ✅ Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/gallery/:projectFolder" element={<GalleryProjectPage />} />
              <Route path="/book" element={<Book />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/login" element={<Login />} />

              {/* 🔐 Admin-Protected Routes */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <Admin />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/invoices/create"
                element={
                  <PrivateRoute>
                    <CreateInvoice />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/invoices/preview"
                element={
                  <PrivateRoute>
                    <InvoicePreview />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
