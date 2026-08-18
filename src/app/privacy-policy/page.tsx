export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 max-w-4xl mx-auto px-6 mb-24 min-h-[70vh]">
      <div className="glass-panel p-8 md:p-12 rounded-3xl">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <div className="space-y-6 text-on-surface-variant leading-relaxed">
          <p><strong>Last Updated: August 2026</strong></p>
          <p>Your privacy is critically important to us at NoteShaala. This Privacy Policy outlines how we collect, use, and protect your personal information.</p>
          
          <h3 className="text-xl text-white font-semibold mt-8 mb-2">Information We Collect</h3>
          <p>We only collect the essential information required to deliver our services. This includes your name and email address when you create an account or make a purchase. Payment details are securely handled directly by Razorpay; we do not store your credit card or UPI details on our servers.</p>

          <h3 className="text-xl text-white font-semibold mt-8 mb-2">How We Use Your Information</h3>
          <p>We use your email address to deliver digital products, send receipts, and provide customer support. If you opt-in to our newsletter, we may occasionally send you updates about new AI resources or promotional discounts.</p>

          <h3 className="text-xl text-white font-semibold mt-8 mb-2">Data Protection</h3>
          <p>Our platform uses industry-standard security protocols, including encryption and secure database hosting via Supabase, to ensure your data is protected against unauthorized access.</p>
        </div>
      </div>
    </div>
  );
}
