import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import logo from '../../assets/peeking-inv-logo.png';
import axios from '../../api/axiosInstance';

function numberToWords(n: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(num: number): string {
    if (num === 0) return '';
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
  if (cents > 0) result += ' and ' + inWords(cents) + ' Cents';
  return result;
}

export default function InvoicePreview() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const locationState = location.state || {};

  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: 'INV-001',
    date: locationState.date || new Date().toLocaleDateString('en-MY'),
    clientName: locationState.clientName || '',
    clientAddress: locationState.clientAddress || '',
    eventDate: locationState.date || '',
    eventEndDate: '',
    isMultipleDay: false,
    comments: '',
    total: '',
    totalWords: '',
  });

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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

  const [showMenu, setShowMenu] = useState(false);

  const descriptionRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  useEffect(() => {
    if (!isGeneratingPdf) {
      descriptionRefs.current.forEach(textarea => {
        if (textarea) {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      });
    }
  }, [items, isGeneratingPdf]);

  const pdfOptions = {
    margin: 0,
    filename: `Invoice-${invoiceData.invoiceNo}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    },
    jsPDF: {
      unit: 'pt',
      format: 'a4',
      orientation: 'portrait',
    },
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    if (invoiceRef.current) {
      html2pdf().set(pdfOptions).from(invoiceRef.current).save();
    }
    setIsGeneratingPdf(false);
  };

  const uploadAndEmailInvoice = async () => {
    try {
      setIsGeneratingPdf(true);
      await new Promise(resolve => setTimeout(resolve, 50));
      if (!invoiceRef.current) {
        setIsGeneratingPdf(false);
        return;
      }
      const pdfBlob = await html2pdf().set(pdfOptions).from(invoiceRef.current).outputPdf('blob');
      const formData = new FormData();
      formData.append('pdf', pdfBlob, `Invoice-${invoiceData.invoiceNo}.pdf`);
      await axios.post(`/invoices/${invoiceData.invoiceNo}/pdf`, formData);
      await axios.post(`/invoices/${invoiceData.invoiceNo}/email`);
      alert('✅ Invoice emailed successfully.');
    } catch (err) {
      console.error('❌ Email send failed:', err);
      alert('❌ Failed to email invoice.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: ItemField, value: string) => {
    const updated = [...items];
    updated[index][field] = value;

    const duration = parseFloat(updated[index].duration.replace(/[^\d.]/g, '')) || 0;
    const rate = parseFloat(updated[index].rate.replace(/[^\d.]/g, '')) || 0;

    if (field === 'duration' || field === 'rate') {
      const calculatedAmount = duration * rate;
      updated[index].amount = calculatedAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 });
    } else if (field === 'amount') {
      const raw = parseFloat(value.replace(/,/g, ''));
      updated[index].amount = isNaN(raw) ? '' : raw.toLocaleString('en-MY', { minimumFractionDigits: 2 });
    }

    setItems(updated);
  };

  const addRow = () => {
    setItems([...items, { eventType: '', description: '', duration: '', rate: '', amount: '' }]);
  };

  useEffect(() => {
    const total = items.reduce((sum, item) => {
      const raw = parseFloat(item.amount.replace(/,/g, ''));
      return sum + (isNaN(raw) ? 0 : raw);
    }, 0);
    setInvoiceData(prev => ({
      ...prev,
      total: total.toLocaleString('en-MY', { minimumFractionDigits: 2 }),
      totalWords: numberToWords(total),
    }));
  }, [items]);

  return (
    <div className="min-h-screen bg-white text-black px-4 py-8 relative">
      {!isGeneratingPdf && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
          <div className="relative">
            <button
              onClick={() => setShowMenu(prev => !prev)}
              className="w-14 h-14 rounded-full bg-[#102866] text-white flex items-center justify-center shadow-lg text-xl font-bold"
            >
              ☰
            </button>
            <div className="absolute top-1/2 right-16 transform -translate-y-1/2 flex flex-col gap-4">
              <div className={`transition-all duration-300 ${showMenu ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                <button onClick={handleDownloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 shadow-md">
                  ⬇ PDF
                </button>
              </div>
              <div className={`transition-all duration-500 ${showMenu ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                <button onClick={uploadAndEmailInvoice} className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 shadow-md">
                  ✉ Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[800px] mx-auto">
        {!isGeneratingPdf && (
          <h1 className="text-2xl font-bold text-[#102866] mb-6">Invoice Preview</h1>
        )}

        <div ref={invoiceRef} className="bg-white border p-8 rounded shadow-md space-y-6 text-sm text-black">
          {/* Header */}
          <div className="flex justify-between">
            <img src={logo} alt="Logo" className="h-28" />
          </div>

          {/* Address & Metadata */}
          <div className="flex justify-between">
            <div>
              <p className="font-bold uppercase">PEEKING VISUALS</p>
              <p>A-1-6 Pusat Komersial Parklane,</p>
              <p>Jalan SS7/26 Petaling Jaya, 47301</p>
              <p>Petaling Jaya, Selangor</p>
            </div>
            <div className="text-right space-y-1">
              <p><strong>Invoice:</strong>{' '}
                {isGeneratingPdf ? <span>{invoiceData.invoiceNo}</span> :
                  <input value={invoiceData.invoiceNo} onChange={e => handleChange('invoiceNo', e.target.value)} className="border-b w-40" />}
              </p>
              <p><strong>Date:</strong>{' '}
                {isGeneratingPdf ? <span>{invoiceData.date}</span> :
                  <input value={invoiceData.date} onChange={e => handleChange('date', e.target.value)} className="border-b w-40" />}
              </p>
            </div>
          </div>

          {/* Client Info */}
          <div>
            <p><strong>Client Name:</strong>{' '}
              {isGeneratingPdf ? <span className="font-bold">{invoiceData.clientName}</span> :
                <input value={invoiceData.clientName} onChange={e => handleChange('clientName', e.target.value)} className="border-b w-60 font-bold" />}
            </p>
            <p><strong>Client Address:</strong>{' '}
              {isGeneratingPdf ? <span>{invoiceData.clientAddress}</span> :
                <input value={invoiceData.clientAddress} onChange={e => handleChange('clientAddress', e.target.value)} className="border-b w-96" />}
            </p>
          </div>

          {/* Event Info */}
          <div className="space-y-2">
            <p>
              {invoiceData.isMultipleDay ? (
                isGeneratingPdf ?
                  <>This invoice is for the event from {invoiceData.eventDate} to {invoiceData.eventEndDate}</> :
                  <>This invoice is for the event from{' '}
                    <input value={invoiceData.eventDate} onChange={(e) => handleChange('eventDate', e.target.value)} className="border-b w-32" /> to{' '}
                    <input value={invoiceData.eventEndDate} onChange={(e) => handleChange('eventEndDate', e.target.value)} className="border-b w-32" />
                  </>
              ) : (
                isGeneratingPdf ?
                  <>This invoice is for the event on {invoiceData.eventDate}</> :
                  <>This invoice is for the event on{' '}
                    <input value={invoiceData.eventDate} onChange={(e) => handleChange('eventDate', e.target.value)} className="border-b w-40" />
                  </>
              )}
            </p>
            {!isGeneratingPdf && (
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={invoiceData.isMultipleDay} onChange={e => handleChange('isMultipleDay', e.target.checked)} />
                Multiple day event
              </label>
            )}
          </div>

          {/* Items Table */}
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
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">
                    {isGeneratingPdf ? (
                      <>
                        <span>{item.eventType}</span>
                        <span className="block text-xs whitespace-pre-wrap">{item.description}</span>
                      </>
                    ) : (
                      <>
                        <input value={item.eventType} onChange={(e) => handleItemChange(i, 'eventType', e.target.value)} className="w-full" />
                        <textarea
                          placeholder="short description"
                          value={item.description}
                          onChange={(e) => handleItemChange(i, 'description', e.target.value)}
                          ref={el => { descriptionRefs.current[i] = el; }}
                          className="w-full text-xs mt-1 h-auto min-h-[40px] resize-y"
                        />
                      </>
                    )}
                  </td>
                  <td className="border px-2 py-1 text-right">
                    {isGeneratingPdf ? <span>{item.duration}</span> :
                      <input value={item.duration} onChange={(e) => handleItemChange(i, 'duration', e.target.value)} className="w-full text-right" />}
                  </td>
                  <td className="border px-2 py-1 text-right">
                    {isGeneratingPdf ? <span>{item.rate}</span> :
                      <input value={item.rate} onChange={(e) => handleItemChange(i, 'rate', e.target.value)} className="w-full text-right" />}
                  </td>
                  <td className="border px-2 py-1 text-right">
                    {isGeneratingPdf ? <span>{item.amount}</span> :
                      <input value={item.amount} onChange={(e) => handleItemChange(i, 'amount', e.target.value)} className="w-full text-right" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Item */}
          {!isGeneratingPdf && (
            <button onClick={addRow} className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700">
              Add Item
            </button>
          )}

          {/* Comments */}
          <div>
            <p><strong>Additional Comments:</strong></p>
            {isGeneratingPdf ? (
              <span>{invoiceData.comments}</span>
            ) : (
              <textarea value={invoiceData.comments} onChange={(e) => handleChange('comments', e.target.value)} className="w-full border p-2 rounded" rows={3} />
            )}
          </div>

          {/* Totals */}
          <div className="text-right space-y-2">
            <p><strong>Total Amount:</strong>{' '}
              {isGeneratingPdf ? <span>{invoiceData.total}</span> :
                <input value={invoiceData.total} onChange={(e) => handleChange('total', e.target.value)} className="border-b w-40 font-bold text-right" />}
            </p>
            <p className="italic">{invoiceData.totalWords}</p>
            <p className="italic text-xs">* Ringgit Malaysia Only *</p>
          </div>

          {/* Footer */}
          <div className="pt-6">
            <p><strong>Validity:</strong> 30 days from invoice date.</p>
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
