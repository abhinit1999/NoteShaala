"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  isMobile?: boolean;
}

export function NavLink({ href, children, className, onClick, isMobile }: NavLinkProps) {
  const pathname = usePathname();
  
  // Check if active
  const isActive = pathname === href || (pathname.startsWith(href) && href !== '/');
  const exactActive = pathname === href;
  const active = href === '/' ? exactActive : isActive;

  if (isMobile) {
    return (
      <Link 
        href={href}
        onClick={onClick}
        className={`text-base font-medium transition-colors ${
          active ? "text-primary font-bold" : "text-white"
        } ${className || ""}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`text-sm font-medium transition-colors ${
        active 
          ? "text-primary font-bold border-b-2 border-primary pb-1" 
          : "text-on-surface-variant hover:text-white"
      } ${className || ""}`}
    >
      {children}
    </Link>
  );
}
