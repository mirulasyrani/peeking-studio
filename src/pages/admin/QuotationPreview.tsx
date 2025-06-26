import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
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

export default function QuotationPreview() {
  const { id } = useParams();
  const quotationRef = useRef<HTMLDivElement>(null);

  interface QuotationItem {
    description: string;
    quantity: number;
    unit_price: string;
    total: string;
  }

  interface Quotation {
    quotation_no: string;
    date: string;
    client_name: string;
    client_address: string;
    items: QuotationItem[];
    total_amount: string;
    amount_in_words?: string;
  }

  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const res = await axios.get(`/quotations/${id}`);
        setQuotation(res.data as Quotation);
      } catch (err) {
        console.error('Failed to fetch quotation:', err);
      }
    };
    fetchQuotation();
  }, [id]);

  const pdfOptions = {
    margin: 0,
    filename: `Quotation-${quotation?.quotation_no || id}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
      scale: 3, // Scale retained for better fidelity
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
    // Delay retained for better fidelity
    await new Promise(resolve => setTimeout(resolve, 300)); 

    if (quotationRef.current) {
      html2pdf().set(pdfOptions).from(quotationRef.current).save();
    }
    setIsGeneratingPdf(false);
  };

  const uploadAndEmailQuotation = async () => {
    try {
      setIsGeneratingPdf(true);
      // Delay retained for better fidelity
      await new Promise(resolve => setTimeout(resolve, 300)); 

      if (!quotationRef.current || !quotation) {
        setIsGeneratingPdf(false);
        return;
      }
      const pdfBlob = await html2pdf().set(pdfOptions).from(quotationRef.current).outputPdf('blob');
      const formData = new FormData();
      formData.append('pdf', pdfBlob, `Quotation-${quotation.quotation_no}.pdf`);
      await axios.post(`/quotations/${id}/pdf`, formData);
      await axios.post(`/quotations/${id}/email`);
      alert('✅ Quotation emailed successfully.');
    } catch (err) {
      console.error('❌ Email send failed:', err);
      alert('❌ Failed to email quotation.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!quotation) return <p className="p-10 text-black">Loading...</p>;

  const items = quotation.items || [];
  const total = parseFloat(quotation.total_amount || '0').toLocaleString('en-MY', { minimumFractionDigits: 2 });
  const totalWords = quotation.amount_in_words || numberToWords(parseFloat(quotation.total_amount || '0'));

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
                <button onClick={uploadAndEmailQuotation} className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 shadow-md">
                  ✉ Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {!isGeneratingPdf && (
          <h2 className="text-2xl font-bold text-[#102866] mb-4">Preview</h2>
        )}
        <h1 className="text-center text-3xl font-bold underline mb-4">Quotation</h1>

        <div
          ref={quotationRef}
          className="bg-white border p-8 rounded shadow-md text-sm w-full"
          style={{ width: '794px', minHeight: '1123px', margin: '0 auto' }}
        >
          <div className="flex justify-between mb-4">
            {/* Company logo and address */}
            <div className="flex flex-col items-start">
              <img src={logo} alt="Logo" className="h-20 mb-2" />
              <div className="text-left text-xs">
                <p className="font-bold">PEEKING VISUALS</p>
                <p>A-1-6 Pusat Komersial Parklane,</p>
                <p>Jalan SS7/26 Petaling Jaya, 47301</p>
                <p>Petaling Jaya, Selangor</p>
              </div>
            </div>
            <div className="text-right">
              <p><strong>Date:</strong> {quotation.date?.split('T')[0]}</p>
            </div>
          </div>

          <div className="mb-4">
            <p><strong>Client Name:</strong> <span className="font-bold">{quotation.client_name}</span></p>
            <p><strong>Client Address:</strong> {quotation.client_address}</p>
          </div>

          <table className="w-full border mt-4 text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              {/* Reverted table header alignment to original request (text-center, white-space: nowrap, vertical-align: middle) */}
              <tr className="bg-gray-200 text-black">
                <th className="border px-2 py-1 text-center" style={{ width: '40%', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Description</th>
                <th className="border px-2 py-1 text-center" style={{ width: '15%', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Qty</th>
                <th className="border px-2 py-1 text-center" style={{ width: '20%', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Unit Price</th>
                <th className="border px-2 py-1 text-center" style={{ width: '25%', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: QuotationItem, index: number) => (
                <tr key={index}>
                  {/* Reverted data cell alignment to original states */}
                  <td className="border px-2 py-1">{item.description}</td>
                  <td className="border px-2 py-1 text-center">{item.quantity}</td>
                  <td className="border px-2 py-1 text-right">
                    RM {(parseFloat(item.unit_price) || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="border px-2 py-1 text-right">
                    RM {(parseFloat(item.total) || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right space-y-2 pt-4">
            <p><strong>Total Amount:</strong> <span className="font-bold">RM {total}</span></p>
            <p className="italic">{totalWords}</p>
          </div>

          <div className="pt-6">
            <p className="font-bold">TERMS & CONDITIONS:</p>
            <p>This quotation is valid for 30 days from the issue date.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
