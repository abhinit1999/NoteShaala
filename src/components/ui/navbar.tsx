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
        <Link href="/" className="flex items-center gap-3 group">
          {/* Logo Icon */}
          <div className="relative flex items-center justify-center w-10 h-10 transition-transform group-hover:scale-105">
            {/* Glow behind */}
            <div className="absolute inset-0 bg-primary/40 blur-md rounded-full"></div>
            {/* SVG Logo */}
            <svg className="relative z-10 w-full h-full" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4L4 10.5L16 17L28 10.5L16 4Z" fill="url(#logoGrad)" stroke="#e9d5ff" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 12.5V20.5C8 20.5 12 25 16 25C20 25 24 20.5 24 20.5V12.5" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 14.5L16 20L26 14.5" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 25V17" stroke="#e9d5ff" strokeWidth="2" strokeLinecap="round"/>
              <rect x="13" y="14" width="6" height="8" fill="white" />
              <defs>
                <linearGradient id="logoGrad" x1="4" y1="4" x2="28" y2="25" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a855f7" />
                  <stop offset="1" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Logo Text */}
          <div className="flex flex-col justify-center">
            <span className="text-2xl font-bold tracking-tight text-white leading-none">
              Note<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Shaala</span>
            </span>
            <span className="text-[10px] text-on-surface-variant font-medium tracking-wide mt-1">
              Learn. Create. Excel.
            </span>
          </div>
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
