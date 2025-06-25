import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GalleryPage from './pages/GalleryPage';
import GalleryProjectPage from './pages/GalleryProjectPage';
import Book from './pages/Book';
import PaymentPage from './pages/PaymentPage';
import Login from './pages/Login';
import Admin from './pages/Admin';
import CreateInvoice from './pages/admin/CreateInvoice';
import InvoicePreview from './pages/admin/InvoicePreview';
import CreateQuotation from './pages/admin/CreateQuotation';
import QuotationPreview from './pages/admin/QuotationPreview';
import ProtectedRoute from './utils/ProtectedRoute';
import UploadImages from './pages/admin/UploadImages';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './utils/AuthProvider';

import 'react-datepicker/dist/react-datepicker.css';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen font-sans text-white scroll-smooth bg-[#17388E]">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery/:projectFolder" element={<GalleryProjectPage />} />
            <Route path="/book" element={<Book />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Pages */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/admin/invoices/create" element={
              <ProtectedRoute adminOnly>
                <CreateInvoice />
              </ProtectedRoute>
            } />
            <Route path="/admin/invoices/preview" element={
              <ProtectedRoute adminOnly>
                <InvoicePreview />
              </ProtectedRoute>
            } />
            <Route path="/admin/quotations/create" element={
              <ProtectedRoute adminOnly>
                <CreateQuotation />
              </ProtectedRoute>
            } />
            <Route path="/admin/quotations/preview" element={
              <ProtectedRoute adminOnly>
                <QuotationPreview />
              </ProtectedRoute>
            } />
            <Route path="/admin/quotations/:id" element={
              <ProtectedRoute adminOnly>
                <QuotationPreview />
              </ProtectedRoute>
            } />
            <Route path="/admin/upload" element={
              <ProtectedRoute adminOnly>
                <UploadImages />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}
