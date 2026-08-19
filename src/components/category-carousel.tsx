"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function CategoryCarousel({ categories }: { categories: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeft(scrollLeft > 0)
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  // Check on mount and window resize
  useEffect(() => {
    handleScroll()
    window.addEventListener('resize', handleScroll)
    return () => window.removeEventListener('resize', handleScroll)
  }, [categories])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" })
    }
  }

  const categoryStyles = [
    { bg: 'bg-purple-500/20', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]', emoji: '📝' },
    { bg: 'bg-blue-500/20', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]', emoji: '🎬' },
    { bg: 'bg-emerald-500/20', shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]', emoji: '🖼️' },
    { bg: 'bg-indigo-500/20', shadow: 'shadow-[0_0_20px_rgba(99,102,241,0.3)]', emoji: '🤖' },
    { bg: 'bg-orange-500/20', shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]', emoji: '💼' },
    { bg: 'bg-pink-500/20', shadow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]', emoji: '🎁' },
    { bg: 'bg-yellow-500/20', shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]', emoji: '📈' },
    { bg: 'bg-cyan-500/20', shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]', emoji: '☁️' },
    { bg: 'bg-red-500/20', shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]', emoji: '⚙️' }
  ]

  return (
    <div className="relative group">
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* Left Gradient Fade */}
      {showLeft && <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />}
      
      <button 
        onClick={() => scroll("left")}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-20 w-10 h-10 rounded-full bg-surface border border-border shadow-lg flex items-center justify-center hover:bg-white/10 transition-all ${showLeft ? 'opacity-0 group-hover:opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-6 py-4 px-2 snap-x snap-mandatory hide-scroll scroll-smooth"
      >
        {categories.map((category, index) => {
          const style = categoryStyles[index % categoryStyles.length]
          
          return (
            <Link 
              key={category.id} 
              href={`/categories/${category.slug}`} 
              className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors cursor-pointer group/card snap-start shrink-0 w-[160px] md:w-[180px]"
            >
              <div className={`w-16 h-16 rounded-xl ${style.bg} flex items-center justify-center mb-4 group-hover/card:scale-110 transition-transform ${style.shadow}`}>
                <span className="text-3xl">{style.emoji}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{category.title}</h3>
              <p className="text-xs text-on-surface-variant line-clamp-1">{category.description || 'Explore resources'}</p>
            </Link>
          )
        })}
      </div>

      <button 
        onClick={() => scroll("right")}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-20 w-10 h-10 rounded-full bg-surface border border-border shadow-lg flex items-center justify-center hover:bg-white/10 transition-all ${showRight ? 'opacity-0 group-hover:opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Right Gradient Fade */}
      {showRight && <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />}
    </div>
  )
}
