"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface MobileNavProps {
  user: any;
  isAdmin?: boolean;
}

export function MobileNav({ user, isAdmin }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close the menu if the window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="lg:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 text-on-surface-variant hover:text-white transition-colors focus:outline-none"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-surface-bright/95 backdrop-blur-xl border-b border-border shadow-xl py-6 px-6 flex flex-col gap-6 z-50 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-base font-medium text-white">Explore</Link>
            <Link href="/categories/handwritten-notes" onClick={() => setIsOpen(false)} className="text-base font-medium text-white">Notes</Link>
            <Link href="/categories/ai-video-prompts" onClick={() => setIsOpen(false)} className="text-base font-medium text-white">AI Prompts</Link>
            <Link href="/categories/premium-bundles" onClick={() => setIsOpen(false)} className="text-base font-medium text-white">Bundles</Link>
            <Link href="/free-resources" onClick={() => setIsOpen(false)} className="text-base font-medium text-white">Free Resources</Link>
            <Link href="/blog" onClick={() => setIsOpen(false)} className="text-base font-medium text-white">Blog</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="text-base font-medium text-white">About</Link>
          </nav>
          
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="w-full px-4 py-3 text-center text-sm font-medium text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/10 transition-colors">Admin Panel</Link>
                )}
                <Link href="/library" onClick={() => setIsOpen(false)} className="w-full px-4 py-3 text-center text-sm font-medium text-white border border-border rounded-lg hover:bg-white/5 transition-colors">My Library</Link>
                <Link href="/account" onClick={() => setIsOpen(false)} className="w-full px-5 py-3 text-center text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">Account</Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full px-4 py-3 text-center text-sm font-medium text-white border border-border rounded-lg hover:bg-white/5 transition-colors">Login</Link>
                <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full px-5 py-3 text-center text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
