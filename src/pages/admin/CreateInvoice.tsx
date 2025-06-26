import React, { useState } from 'react';
import BackToDashboard from '../../components/BackToDashboard';
import { useNavigate } from 'react-router-dom';

export default function CreateInvoice() {
  const [invoice, setInvoice] = useState({
    clientName: '',
    email: '',
    sessionType: '',
    date: '',
    clientAddress: '',
    notes: '',
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Invoice data:', invoice);

    // Navigate to the preview page with form data
    navigate('/admin/invoices/preview', { state: invoice });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 py-32 px-6">
      <BackToDashboard />

      <h1 className="text-4xl font-bold text-center mb-8">Create Invoice</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <input
          type="text"
          name="clientName"
          placeholder="Client Name"
          value={invoice.clientName}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Client Email"
          value={invoice.email}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded"
          required
        />
        <select
          name="sessionType"
          value={invoice.sessionType}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded"
          required
        >
          <option value="">Select Session Type</option>
          <option value="Portrait">Portrait</option>
          <option value="Event">Event</option>
          <option value="Branding">Branding</option>
          <option value="Studio Rental">Studio Rental</option>
        </select>
        <input
          type="date"
          name="date"
          value={invoice.date}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded"
          required
        />
        <textarea
          name="clientAddress"
          placeholder="Client Address"
          value={invoice.clientAddress}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded"
          required
        />
        <textarea
          name="notes"
          placeholder="Additional Notes"
          value={invoice.notes}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded"
          rows={5}
        />

        <button
          type="submit"
          className="w-full bg-[#102866] text-white py-3 rounded hover:bg-[#1b2f70] transition"
        >
          Generate Invoice
        </button>
      </form>
    </div>
  );
}
