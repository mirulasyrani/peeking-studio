export default function PaymentPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6 text-center">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">Payment</h1>

      <p className="text-lg text-gray-700 mb-6">
        After confirming your booking, you will receive a payment request via email or WhatsApp.
      </p>

      <div className="border rounded-md p-6 bg-gray-50 shadow">
        <p className="mb-4 font-semibold">💳 Online payment options available:</p>
        <ul className="list-disc list-inside text-left text-gray-600 mb-6">
          <li>FPX Online Banking</li>
          <li>Credit/Debit Card</li>
          <li>eWallets (TnG, Boost, etc.)</li>
        </ul>
        <p className="text-sm text-gray-500">
          * For now, payments are processed manually after booking. A secure online payment form will be added soon.
        </p>
      </div>
    </div>
  );
}
