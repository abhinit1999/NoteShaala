export default function BlogPage() {
  return (
    <div className="pt-32 max-w-4xl mx-auto px-6 mb-24 min-h-[70vh]">
      <div className="glass-panel p-8 md:p-12 rounded-3xl text-center">
        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📰</span>
        </div>
        <h1 className="text-4xl font-bold mb-6">NoteShaala Blog</h1>
        <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto mb-8">
          Welcome to the NoteShaala Blog! We are currently writing our first set of deep-dive tutorials on Generative AI, prompt engineering, and study techniques.
        </p>
        <p className="text-white font-semibold">
          Stay tuned. New articles are dropping very soon!
        </p>
      </div>
    </div>
  );
}
