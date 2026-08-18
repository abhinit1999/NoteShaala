export default function FAQPage() {
  return (
    <div className="pt-32 max-w-4xl mx-auto px-6 mb-24 min-h-[70vh]">
      <div className="glass-panel p-8 md:p-12 rounded-3xl">
        <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
        <div className="space-y-8 text-on-surface-variant leading-relaxed">
          
          <div>
            <h3 className="text-xl text-white font-semibold mb-2">How do I access my purchased notes?</h3>
            <p>Immediately after a successful payment, you will receive an email with a direct download link. You can also log into your NoteShaala account and view all your purchases under the "Library" section.</p>
          </div>

          <div>
            <h3 className="text-xl text-white font-semibold mb-2">Are the materials updated?</h3>
            <p>Yes! We regularly update our AI prompts and technical guides to ensure they remain relevant with the latest model updates. If you have purchased lifetime access to a bundle, you will get these updates for free.</p>
          </div>

          <div>
            <h3 className="text-xl text-white font-semibold mb-2">Do you offer refunds?</h3>
            <p>Due to the digital nature of our products, we generally do not offer refunds once the file has been downloaded. However, if there is a technical defect or the file is corrupted, please contact our support team within 7 days.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
