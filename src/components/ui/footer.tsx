import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-border w-full py-16 mt-20">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 px-6 max-w-screen-2xl mx-auto">
        <div className="col-span-2 lg:col-span-1">
          <div className="mb-6 -ml-2 scale-90 origin-left">
            <Logo />
          </div>
          <p className="text-sm text-on-surface-variant mb-6">Learn. Create. Grow.</p>
          <p className="text-xs text-on-surface-variant/60">
            © 2026 NoteShaala. All rights reserved.<br/>
            Made with ❤️ for learners & creators.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li><Link className="hover:text-white transition-colors" href="/">Explore</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/products">Notes</Link></li>
            <li><Link className="hover:text-white transition-colors" href="#">AI Prompts</Link></li>
            <li><Link className="hover:text-white transition-colors" href="#">Bundles</Link></li>
            <li><Link className="hover:text-white transition-colors" href="#">Free Resources</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Resources</h4>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li><Link className="hover:text-white transition-colors" href="/blog">Blog</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/faq">FAQs</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/contact">Contact Us</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/about">About Us</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/terms">Terms of Use</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Support</h4>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li><Link className="hover:text-white transition-colors" href="/how-to-download">How to Download</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/payment-refund">Payment & Refunds</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/support">Support Center</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Connect With Us</h4>
          <div className="flex gap-3">
            <a className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center hover:bg-primary transition-colors text-white" href="#">Y</a>
            <a className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center hover:bg-primary transition-colors text-white" href="#">I</a>
            <a className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center hover:bg-primary transition-colors text-white" href="#">T</a>
            <a className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center hover:bg-primary transition-colors text-white" href="#">L</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
