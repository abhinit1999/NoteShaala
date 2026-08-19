"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden md:block">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-48 lg:w-64 bg-surface/50 border border-border text-white text-sm px-4 py-1.5 pl-9 rounded-full focus:outline-none focus:border-primary transition-colors"
      />
      <button 
        type="submit" 
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
}
