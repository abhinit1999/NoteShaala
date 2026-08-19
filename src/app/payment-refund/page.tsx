export default function PaymentRefundPage() {
  return (
    <div className="pt-8 max-w-4xl mx-auto px-6 mb-12 min-h-[50vh]">
      <div className="glass-panel p-8 md:p-12 rounded-3xl">
        <h1 className="text-4xl font-bold mb-6">Payment and Refunds</h1>
        <div className="space-y-6 text-on-surface-variant leading-relaxed">
          
          <h3 className="text-xl text-white font-semibold mt-8 mb-2">Supported Payment Methods</h3>
          <p>We use Razorpay as our secure payment gateway. We accept all major Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and popular mobile wallets. All transactions are fully encrypted and secure.</p>

          <h3 className="text-xl text-white font-semibold mt-8 mb-2">Refund Policy</h3>
          <p>At NoteShaala, we strive to provide the highest quality digital resources. Because digital goods are delivered instantly and cannot be "returned," <strong>all sales are generally considered final</strong>.</p>
          <p>However, we may offer a refund within 7 days of purchase under the following exceptional circumstances:</p>
          <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
            <li>The file you downloaded is corrupted and we are unable to provide a working replacement.</li>
            <li>You were accidentally charged multiple times for the same product due to a technical glitch.</li>
          </ul>
          
          <p className="mt-8">To request a refund for an eligible reason, please contact our support team with your order ID.</p>
        </div>
      </div>
    </div>
  );
}
