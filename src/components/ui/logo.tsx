import Link from "next/link";

export function Logo() {
  return (
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
  );
}
