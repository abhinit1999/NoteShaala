export default function HowToDownloadPage() {
  return (
    <div className="pt-8 max-w-4xl mx-auto px-6 mb-12 min-h-[50vh]">
      <div className="glass-panel p-8 md:p-12 rounded-3xl">
        <h1 className="text-4xl font-bold mb-6">How to Download</h1>
        <div className="space-y-6 text-on-surface-variant leading-relaxed">
          <p>Accessing your purchased digital products is incredibly simple.</p>
          
          <div className="bg-surface-bright p-6 rounded-xl border border-border mt-6">
            <h3 className="text-white font-semibold text-lg mb-4">Step-by-Step Guide</h3>
            <ol className="list-decimal list-inside space-y-4">
              <li><strong>Complete your purchase:</strong> Once your payment is verified through Razorpay, you will be redirected to a success page.</li>
              <li><strong>Check your email:</strong> We automatically send a receipt containing direct download links to the email address provided during checkout.</li>
              <li><strong>Access the Library:</strong> If you are logged into your NoteShaala account, you can click on your profile and navigate to the <strong>Library</strong> section. All your past purchases are stored securely there for lifetime access.</li>
              <li><strong>Download:</strong> Click the "Download" button next to any product to save the PDF or ZIP file directly to your device.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
