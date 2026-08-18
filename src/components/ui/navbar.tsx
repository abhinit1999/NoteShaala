import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MobileNav } from "./mobile-nav";

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin = !!(user && adminEmail && user.email === adminEmail);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-border shadow-xl">
      <div className="flex justify-between items-center h-20 px-6 max-w-screen-2xl mx-auto">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-white text-xl">N</div>
          <span className="text-xl font-bold tracking-tight text-white">NoteShaala</span>
        </Link>
        
        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-primary font-bold border-b-2 border-primary pb-1">Explore</Link>
          <Link href="/categories/handwritten-notes" className="text-sm font-medium text-on-surface-variant hover:text-white transition-colors">Notes</Link>
          <Link href="/categories/ai-video-prompts" className="text-sm font-medium text-on-surface-variant hover:text-white transition-colors">AI Prompts</Link>
          <Link href="/categories/premium-bundles" className="text-sm font-medium text-on-surface-variant hover:text-white transition-colors">Bundles</Link>
          <Link href="/free-resources" className="text-sm font-medium text-on-surface-variant hover:text-white transition-colors">Free Resources</Link>
          <Link href="/blog" className="text-sm font-medium text-on-surface-variant hover:text-white transition-colors">Blog</Link>
          <Link href="/about" className="text-sm font-medium text-on-surface-variant hover:text-white transition-colors">About</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button aria-label="Search" className="p-2 text-on-surface-variant hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          </button>
          
          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin/dashboard" className="hidden lg:block px-4 py-2 text-sm font-medium text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/10 transition-colors">Admin Panel</Link>
              )}
              <Link href="/library" className="hidden lg:block px-4 py-2 text-sm font-medium text-white border border-border rounded-lg hover:bg-white/5 transition-colors">My Library</Link>
              <Link href="/account" className="hidden lg:block px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">Account</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden lg:block px-4 py-2 text-sm font-medium text-white border border-border rounded-lg hover:bg-white/5 transition-colors">Login</Link>
              <Link href="/signup" className="hidden lg:block px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">Get Started</Link>
            </>
          )}

          {/* Mobile Hamburger Menu */}
          <MobileNav user={user} isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  );
}
