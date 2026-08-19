export default function ContactPage() {
  return (
    <div className="pt-8 max-w-4xl mx-auto px-6 mb-12 min-h-[50vh]">
      <div className="glass-panel p-8 md:p-12 rounded-3xl">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <div className="space-y-6 text-on-surface-variant leading-relaxed">
          <p>We'd love to hear from you! Whether you have a question about a product, need technical support, or just want to say hi, we're here to help.</p>
          <div className="bg-surface-bright p-6 rounded-xl border border-border">
            <h3 className="text-white font-semibold mb-2">Email Support</h3>
            <p>support@noteshaala.com</p>
            <p className="text-sm mt-2">We aim to respond to all inquiries within 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
