import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import { z } from 'zod';

type Item = {
  description: string;
  quantity: string;
  unit_price: string;
  total: string;
};

// Zod schema for frontend validation
const frontendSchema = z.object({
  quotation_no: z.string().min(1),
  client_name: z.string().min(1),
  client_email: z.string().email(),
  client_address: z.string().min(1),
  project_title: z.string().min(1),
  project_date: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0),
      unit_price: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0),
      total: z.string().optional(),
    })
  ).nonempty(),
  total_amount: z.number().min(0),
  amount_in_words: z.string().min(1),
});

export default function CreateQuotation() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    quotation_no: 'QT-' + Date.now(),
    client_name: '',
    client_email: '',
    client_address: '',
    project_title: '',
    project_date: '',
    notes: '',
  });

  const [items, setItems] = useState<Item[]>([
    { description: '', quantity: '', unit_price: '', total: '' },
  ]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string
  ) => {
    const updated = [...items];
    updated[index][field] = value;

    const qty = parseFloat(updated[index].quantity) || 0;
    const price = parseFloat(updated[index].unit_price) || 0;
    updated[index].total = (qty * price).toFixed(2);

    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: '', unit_price: '', total: '' }]);
  };

  const total_amount = items.reduce((sum, item) => sum + parseFloat(item.total || '0'), 0);
  const amount_in_words = total_amount === 0 ? '' : numberToWords(total_amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      quotation_no: formData.quotation_no.trim(),
      client_name: formData.client_name.trim(),
      client_email: formData.client_email.trim(),
      client_address: formData.client_address.trim(),
      project_title: formData.project_title.trim(),
      project_date: formData.project_date.trim(),
      notes: formData.notes?.trim() || '',
      items: items.map(item => ({
        description: item.description.trim(),
        quantity: item.quantity.trim(),
        unit_price: item.unit_price.trim(),
        total: item.total,
      })),
      total_amount,
      amount_in_words,
    };

    const parsed = frontendSchema.safeParse(payload);
    if (!parsed.success) {
      console.error('Validation errors:', parsed.error.format());
      alert('Please check the form for errors before submitting.');
      return;
    }

    try {
      const res = await axios.post('/quotations', payload);
      navigate(`/admin/quotations/${res.data.id}`);

      setFormData({
        quotation_no: 'QT-' + Date.now(),
        client_name: '',
        client_email: '',
        client_address: '',
        project_title: '',
        project_date: '',
        notes: '',
      });
      setItems([{ description: '', quantity: '', unit_price: '', total: '' }]);
    } catch (err) {
      console.error('Failed to create quotation:', err);
      alert('Error saving quotation.');
    }
  };

  return (
    <div className="min-h-screen bg-white py-20 px-6 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-8">Create Quotation</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <input
          type="text"
          name="client_name"
          placeholder="Client Name"
          value={formData.client_name}
          onChange={handleFormChange}
          required
          className="w-full border p-3 rounded"
        />
        <input
          type="email"
          name="client_email"
          placeholder="Client Email"
          value={formData.client_email}
          onChange={handleFormChange}
          required
          className="w-full border p-3 rounded"
        />
        <textarea
          name="client_address"
          placeholder="Client Address"
          value={formData.client_address}
          onChange={handleFormChange}
          required
          className="w-full border p-3 rounded"
        />
        <input
          type="text"
          name="project_title"
          placeholder="Project Title"
          value={formData.project_title}
          onChange={handleFormChange}
          required
          className="w-full border p-3 rounded"
        />
        <input
          type="date"
          name="project_date"
          value={formData.project_date}
          onChange={handleFormChange}
          required
          className="w-full border p-3 rounded"
        />
        <textarea
          name="notes"
          placeholder="Additional Notes"
          value={formData.notes}
          onChange={handleFormChange}
          className="w-full border p-3 rounded"
        />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quotation Items</h2>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                className="col-span-2 border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Unit Price"
                value={item.unit_price}
                onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          ))}
          <button type="button" onClick={addItem} className="text-sm text-blue-600 underline">
            + Add Item
          </button>
        </div>

        <div className="text-right font-semibold">
          Total: RM {total_amount.toFixed(2)}
          <br />
          <span className="italic text-sm">{amount_in_words}</span>
        </div>

        <button
          type="submit"
          className="w-full bg-[#102866] text-white py-3 rounded hover:bg-[#1b2f70]"
        >
          Save & Preview Quotation
        </button>
      </form>
    </div>
  );
}

function numberToWords(n: number): string {
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const toWords = (num: number): string => {
    if (num < 20) return ones[num];
    if (num < 100)
      return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000)
      return ones[Math.floor(num / 100)] + ' Hundred' +
        (num % 100 ? ' and ' + toWords(num % 100) : '');
    if (num < 1000000)
      return toWords(Math.floor(num / 1000)) + ' Thousand' +
        (num % 1000 ? ', ' + toWords(num % 1000) : '');
    return '';
  };

  const [intPart, decimalPart] = n.toFixed(2).split('.');
  let result = toWords(parseInt(intPart)) + ' Ringgit';
  if (parseInt(decimalPart) > 0) {
    result += ' and ' + toWords(parseInt(decimalPart)) + ' Cents';
  }
  return result;
}
