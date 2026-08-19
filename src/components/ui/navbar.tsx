import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MobileNav } from "./mobile-nav";
import { NavLink } from "./nav-link";
import { SearchBar } from "./search-bar";

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
          <NavLink href="/">Explore</NavLink>
          <NavLink href="/categories/handwritten-notes">Notes</NavLink>
          <NavLink href="/categories/ai-video-prompts">AI Prompts</NavLink>
          <NavLink href="/categories/premium-bundles">Bundles</NavLink>
          <NavLink href="/free-resources">Free Resources</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/about">About</NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <SearchBar />
          
          {user ? (
            <>
              {isAdmin && (
                <>
                  <Link href="/admin/dashboard" className="hidden lg:block px-4 py-2 text-sm font-medium text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/10 transition-colors">Admin Panel</Link>
                  <Link href="/library" className="hidden lg:block px-4 py-2 text-sm font-medium text-white border border-border rounded-lg hover:bg-white/5 transition-colors">My Library</Link>
                </>
              )}
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
