import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import logo from '../../assets/peeking-inv-logo.png';

function numberToWords(n: number): string {
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(num: number): string {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + inWords(num % 100) : '');
    if (num < 1000000) return inWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ', ' + inWords(num % 1000) : '');
    return '';
  }

  const [wholeStr, decimalStr] = n.toFixed(2).split('.');
  const whole = parseInt(wholeStr, 10);
  const cents = parseInt(decimalStr, 10);

  let result = inWords(whole) + ' Ringgit';
  if (cents > 0) {
    result += ' and ' + inWords(cents) + ' Cents';
  }

  return result;
}

export default function InvoicePreview() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const locationState = location.state || {};

    const [invoiceData, setInvoiceData] = useState({
        invoiceNo: 'INV-001',
        date: locationState.date || new Date().toLocaleDateString(),
        clientName: locationState.clientName || '',
        clientAddress: locationState.clientAddress || '',
        eventDate: locationState.date || '', // default to booking date
        eventEndDate: '',
        isMultipleDay: false,
        comments: '',
        total: '',
        totalWords: '',
    });

  type ItemField = 'eventType' | 'description' | 'duration' | 'rate' | 'amount';

  type Item = {
    eventType: string;
    description: string;
    duration: string;
    rate: string;
    amount: string;
  };

  const [items, setItems] = useState<Item[]>([
    { eventType: '', description: '', duration: '', rate: '', amount: '' },
  ]);

  const handleChange = (field: string, value: string | boolean) => {
    setInvoiceData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: ItemField, value: string) => {
    const updatedItems = [...items];
    if (field === 'amount' || field === 'rate') {
      value = value.replace(/[^\d.]/g, '');
    }
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addRow = () => {
    setItems([...items, { eventType: '', description: '', duration: '', rate: '', amount: '' }]);
  };

  useEffect(() => {
    const total = items.reduce((sum, item) => {
      const raw = parseFloat(item.amount.replace(/,/g, ''));
      return sum + (isNaN(raw) ? 0 : raw);
    }, 0);

    const formatted = total.toLocaleString('en-MY', { minimumFractionDigits: 2 });
    setInvoiceData((prev) => ({
      ...prev,
      total: formatted,
      totalWords: numberToWords(total),
    }));
  }, [items]);

  const handleDownloadPDF = () => {
    if (invoiceRef.current) {
      html2pdf().from(invoiceRef.current).save(`Invoice-${invoiceData.invoiceNo}.pdf`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#102866]">QUOTATION UPDATED</h1>
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download PDF
          </button>
        </div>

        <div ref={invoiceRef} className="bg-white border p-8 rounded shadow-md space-y-6 text-sm">
          <div className="flex justify-between">
            <img src={logo} alt="Logo" className="h-32" />
          </div>

          <div className="flex justify-between">
            <div>
              <p className="font-bold uppercase">PEEKING VISUALS</p>
              <p>A-1-6 Pusat Komersial Parklane,</p>
              <p>Jalan SS7/26 Petaling Jaya, 47301</p>
              <p>Petaling Jaya, Selangor</p>
            </div>
            <div className="text-right space-y-1">
              <p><strong>Invoice:</strong> <input type="text" value={invoiceData.invoiceNo} onChange={(e) => handleChange('invoiceNo', e.target.value)} className="border-b w-40" /></p>
              <p><strong>Date:</strong> <input type="text" value={invoiceData.date} onChange={(e) => handleChange('date', e.target.value)} className="border-b w-40" /></p>
            </div>
          </div>

          <div>
            <p><strong>Client Name:</strong> <input type="text" value={invoiceData.clientName} onChange={(e) => handleChange('clientName', e.target.value)} className="border-b w-60 font-bold" /></p>
            <p><strong>Client Address:</strong> <input type="text" value={invoiceData.clientAddress} onChange={(e) => handleChange('clientAddress', e.target.value)} className="border-b w-96" /></p>
          </div>

          <div className="space-y-2">
            <p>
              {invoiceData.isMultipleDay
                ? <>
                    This invoice is for the event from{' '}
                    <input type="text" value={invoiceData.eventDate} onChange={(e) => handleChange('eventDate', e.target.value)} className="border-b w-32" />
                    {' '}to{' '}
                    <input type="text" value={invoiceData.eventEndDate} onChange={(e) => handleChange('eventEndDate', e.target.value)} className="border-b w-32" />
                  </>
                : <>
                    This invoice is for the event on{' '}
                    <input type="text" value={invoiceData.eventDate} onChange={(e) => handleChange('eventDate', e.target.value)} className="border-b w-40" />
                  </>
              }
            </p>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={invoiceData.isMultipleDay as boolean}
                onChange={(e) => handleChange('isMultipleDay', e.target.checked)}
              />
              Multiple day event
            </label>
          </div>

          <table className="w-full border mt-4 text-sm">
            <thead>
              <tr className="bg-gray-200 text-black text-center">
                <th className="border px-2 py-1">Description</th>
                <th className="border px-2 py-1">Package</th>
                <th className="border px-2 py-1">Unit Price</th>
                <th className="border px-2 py-1">Amount (RM)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">
                    <input type="text" value={item.eventType} onChange={(e) => handleItemChange(index, 'eventType', e.target.value)} className="w-full" />
                    <input type="text" placeholder="short description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="w-full text-xs mt-1" />
                  </td>
                  <td className="border px-2 py-1">
                    <input type="text" value={item.duration} onChange={(e) => handleItemChange(index, 'duration', e.target.value)} className="w-full" />
                  </td>
                  <td className="border px-2 py-1">
                    <input type="text" inputMode="decimal" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value)} className="w-full text-right" />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={item.amount}
                      onChange={(e) => handleItemChange(index, 'amount', e.target.value.replace(/[^\d.]/g, ''))}
                      onBlur={(e) => {
                        const raw = parseFloat(e.target.value.replace(/,/g, ''));
                        const updated = [...items];
                        updated[index].amount = isNaN(raw)
                          ? ''
                          : raw.toLocaleString('en-MY', { minimumFractionDigits: 2 });
                        setItems(updated);
                      }}
                      className="w-full text-right"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addRow}
            className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Item
          </button>

          <div>
            <p><strong>Additional Comments:</strong></p>
            <textarea value={invoiceData.comments} onChange={(e) => handleChange('comments', e.target.value)} className="w-full border p-2 rounded" rows={3} />
          </div>

          <div className="text-right space-y-2">
            <p>
              <strong>Total Amount:</strong>{' '}
              <input
                type="text"
                value={invoiceData.total}
                onChange={(e) => handleChange('total', e.target.value)}
                className="border-b w-40 font-bold text-right"
              />
            </p>
            <p><span className="italic">{invoiceData.totalWords}</span></p>
            <p className="italic text-xs">* Ringgit Malaysia Only *</p>
          </div>

          <div className="pt-6">
            <p className="font-bold">PAYMENT DETAILS:</p>
            <p>MAYBANK</p>
            <p>PK VISUALS ENTERPRISE</p>
            <p>512353003041</p>
            <p>shalmabruhanutheen@gmail.com</p>
            <p>60122962550</p>
          </div>
        </div>
      </div>
    </div>
  );
}
