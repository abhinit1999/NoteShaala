'use client'

import { motion, Variants } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { ProductCard } from '@/components/product-card'

interface HeroCardsProps {
  products: any[]
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const item: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export function HeroCards({ products }: HeroCardsProps) {
  if (!products || products.length === 0) return null

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 md:mt-20 w-full max-w-6xl mx-auto px-4 perspective-1000"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item} className="h-full">
          <Tilt 
            tiltMaxAngleX={10} 
            tiltMaxAngleY={10} 
            scale={1.02} 
            transitionSpeed={2500}
            className="h-full transform-style-3d"
            glareEnable={true}
            glareMaxOpacity={0.15}
            glareColor="#ffffff"
            glarePosition="all"
            glareBorderRadius="0.5rem"
          >
            <div className="h-full rounded-lg bg-card/50 backdrop-blur-sm border shadow-xl">
              <ProductCard product={product} />
            </div>
          </Tilt>
        </motion.div>
      ))}
    </motion.div>
  )
}
