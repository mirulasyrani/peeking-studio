import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackToDashboard from '../../components/BackToDashboard';

type QuotationItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type Quotation = {
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  quotationDate: string;
  notes: string;
  items: QuotationItem[];
};

export default function CreateQuotation() {
  const navigate = useNavigate();

  const [quotation, setQuotation] = useState<Quotation>({
    clientName: '',
    clientEmail: '',
    projectTitle: '',
    quotationDate: new Date().toISOString().split('T')[0],
    notes: '',
    items: [
      { description: '', quantity: 1, unitPrice: 0, total: 0 },
    ],
  });

  const handleItemChange = (
    index: number,
    field: keyof QuotationItem,
    value: string | number
  ) => {
    const updatedItems = [...quotation.items];
    if (field === 'quantity' || field === 'unitPrice') {
      value = parseFloat(value as string) || 0;
    }
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    setQuotation({ ...quotation, items: updatedItems });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setQuotation({ ...quotation, [e.target.name]: e.target.value });
  };

  const addItemRow = () => {
    setQuotation({
      ...quotation,
      items: [...quotation.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }],
    });
  };

  const removeItemRow = (index: number) => {
    const updatedItems = [...quotation.items];
    updatedItems.splice(index, 1);
    setQuotation({ ...quotation, items: updatedItems });
  };

  const getTotal = () => {
    return quotation.items.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/admin/quotations/preview', { state: { ...quotation, grandTotal: getTotal() } });
  };

  return (
    <div className="min-h-screen py-24 px-6 bg-white text-gray-800">
      {/* Back to dashboard button */}
      <div className="mb-6">
        <BackToDashboard />
      </div>

      <h1 className="text-4xl font-bold text-center mb-8">Create Quotation</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-6">
        <input
          type="text"
          name="clientName"
          placeholder="Client Name"
          value={quotation.clientName}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded"
          required
        />

        <input
          type="email"
          name="clientEmail"
          placeholder="Client Email"
          value={quotation.clientEmail}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded"
          required
        />

        <input
          type="text"
          name="projectTitle"
          placeholder="Project Title"
          value={quotation.projectTitle}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded"
          required
        />

        <input
          type="date"
          name="quotationDate"
          value={quotation.quotationDate}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded"
          required
        />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Items</h2>
          {quotation.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                className="col-span-5 border border-gray-300 p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className="col-span-2 border border-gray-300 p-2 rounded"
                min={1}
                required
              />
              <input
                type="number"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                className="col-span-2 border border-gray-300 p-2 rounded"
                min={0}
                required
              />
              <div className="col-span-2 text-right pr-2 font-semibold">
                RM {item.total.toFixed(2)}
              </div>
              <button
                type="button"
                onClick={() => removeItemRow(index)}
                className="col-span-1 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItemRow}
            className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200"
          >
            + Add Item
          </button>
        </div>

        <textarea
          name="notes"
          placeholder="Additional Notes"
          value={quotation.notes}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded"
          rows={4}
        />

        <div className="text-right font-bold text-lg">
          Grand Total: RM {getTotal()}
        </div>

        <button
          type="submit"
          className="w-full bg-[#102866] text-white py-3 rounded hover:bg-[#1b2f70] transition"
        >
          Generate Quotation
        </button>
      </form>
    </div>
  );
}
