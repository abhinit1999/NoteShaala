export default function SupportPage() {
  return (
    <div className="pt-8 max-w-4xl mx-auto px-6 mb-12 min-h-[50vh]">
      <div className="glass-panel p-8 md:p-12 rounded-3xl text-center">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🛠️</span>
        </div>
        <h1 className="text-4xl font-bold mb-6">Support Center</h1>
        <div className="space-y-6 text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
          <p>Need help with your account, a recent purchase, or navigating the platform? Our dedicated support team is here to assist you.</p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-12 text-left">
            <div className="glass-panel p-6 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
              <h3 className="text-white font-bold mb-2">Technical Support</h3>
              <p className="text-sm">Issues downloading files, accessing the library, or password resets.</p>
            </div>
            <div className="glass-panel p-6 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
              <h3 className="text-white font-bold mb-2">Billing & Payments</h3>
              <p className="text-sm">Questions about Razorpay, duplicate charges, or refund requests.</p>
            </div>
          </div>

          <p className="mt-12">
            Please email us at <strong className="text-white">support@noteshaala.com</strong> and include your Order ID for faster resolution.
          </p>
        </div>
      </div>
    </div>
  );
}
