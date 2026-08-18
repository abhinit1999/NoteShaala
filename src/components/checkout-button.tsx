'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface CheckoutButtonProps {
  productId: string
  isFree: boolean
  className?: string
}

export function CheckoutButton({ productId, isFree, className }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.id = 'razorpay-script'
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      // 1. Create order on our server
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?next=/products`)
          return
        }
        alert(data.error || 'Failed to initialize checkout')
        setIsLoading(false)
        return
      }

      if (data.isFree) {
        // Free product, access granted immediately
        alert('Product added to your library!')
        router.push('/library')
        return
      }

      // 2. Load Razorpay SDK
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        alert('Failed to load payment gateway. Please check your connection.')
        setIsLoading(false)
        return
      }

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Knowledge Marketplace',
        description: 'Digital Educational Resource',
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          // 4. Verify payment on success
          try {
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                internal_order_id: data.orderId
              }),
            })

            const verifyData = await verifyRes.json()

            if (verifyRes.ok) {
              // Redirect to library
              router.push('/library')
              router.refresh()
            } else {
              alert(verifyData.error || 'Payment verification failed. If amount was deducted, please contact support.')
            }
          } catch (err) {
            console.error('Verification error', err)
            alert('An error occurred while verifying the payment.')
          }
        },
        theme: {
          color: '#0f172a', // primary color
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      
      paymentObject.on('payment.failed', function (response: any) {
        alert('Payment failed. ' + response.error.description)
      })

      paymentObject.open()

    } catch (error) {
      console.error('Checkout Error:', error)
      alert('An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      size="lg" 
      className={`w-full text-lg font-semibold h-14 shadow-md ${className}`} 
      onClick={handleCheckout}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : (isFree ? 'Get Access Now' : 'Buy Now')}
    </Button>
  )
}
