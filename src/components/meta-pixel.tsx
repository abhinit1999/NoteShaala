'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect } from 'react'

import { Suspense } from 'react'

function MetaPixelInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

  useEffect(() => {
    if (!pixelId) return

    // Initialize fbq if it doesn't exist yet
    if (typeof window !== 'undefined' && !(window as any).fbq) {
      ;(function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return
        n = f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }
        if (!f._fbq) f._fbq = n
        n.push = n
        n.loaded = !0
        n.version = '2.0'
        n.queue = []
        t = b.createElement(e)
        t.async = !0
        t.src = v
        s = b.getElementsByTagName(e)[0]
        s.parentNode.insertBefore(t, s)
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

      // Initialize with Pixel ID
      ;(window as any).fbq('init', pixelId)
    }

    // Track PageView on route change
    if (typeof window !== 'undefined' && (window as any).fbq) {
      ;(window as any).fbq('track', 'PageView')
    }
  }, [pathname, searchParams, pixelId])

  if (!pixelId) return null

  return (
    <Script
      id="fb-pixel-noscript"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          <noscript>
            <img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />
          </noscript>
        `,
      }}
    />
  )
}

export function MetaPixel() {
  return (
    <Suspense fallback={null}>
      <MetaPixelInner />
    </Suspense>
  )
}
