"use client"

import { useEffect, useState } from "react"
import { useStripe, PaymentRequestButtonElement } from "@stripe/react-stripe-js"
import { HttpTypes } from "@medusajs/types"
import { placeOrder } from "@lib/data/cart"

type PaymentRequestButtonProps = {
  cart: HttpTypes.StoreCart
  onError: (error: string) => void
  onSuccess: () => void
}

const PaymentRequestButton: React.FC<PaymentRequestButtonProps> = ({
  cart,
  onError,
  onSuccess,
}) => {
  const stripe = useStripe()
  const [paymentRequest, setPaymentRequest] = useState<any>(null)
  const [canMakePayment, setCanMakePayment] = useState(false)

  useEffect(() => {
    // Don't create payment request until shipping is selected
    if (!stripe || !cart || !cart.shipping_address || !cart.shipping_methods || cart.shipping_methods.length === 0) {
      setPaymentRequest(null)
      setCanMakePayment(false)
      return
    }

    // Calculate total amount (including shipping and tax)
    // MedusaJS 2.0 stores amounts in major units (e.g., 12.5 for €12.50)
    // Stripe Payment Request API requires amounts in smallest currency subunit (cents/pence)
    const subtotal = cart.subtotal || 0
    const shippingTotal = cart.shipping_total || 0
    const taxTotal = cart.tax_total || 0
    const discountTotal = cart.discount_total || 0
    const giftCardTotal = cart.gift_card_total || 0
    
    // Use cart.total if available, otherwise calculate from components
    const totalMajor = cart.total ?? (subtotal + shippingTotal + taxTotal - discountTotal - giftCardTotal)
    
    if (!totalMajor || totalMajor <= 0) {
      setPaymentRequest(null)
      setCanMakePayment(false)
      return
    }
    
    const currency = cart.currency_code?.toUpperCase() || "EUR"
    
    // Convert to number if string
    const totalMajorNum = typeof totalMajor === 'string' ? parseFloat(totalMajor) : Number(totalMajor)
    
    if (isNaN(totalMajorNum) || totalMajorNum <= 0) {
      setPaymentRequest(null)
      setCanMakePayment(false)
      return
    }
    
    // Convert to smallest currency subunit
    const zeroDecimalCurrencies = ['JPY', 'KRW', 'CLP', 'VND', 'XAF', 'XOF', 'XPF']
    const isZeroDecimal = zeroDecimalCurrencies.includes(currency);
    const amountInSubunits = isZeroDecimal
      ? Math.round(totalMajorNum)
      : Math.round(totalMajorNum * 100)

    if (!amountInSubunits || amountInSubunits <= 0 || !Number.isInteger(amountInSubunits)) {
      setPaymentRequest(null)
      setCanMakePayment(false)
      return
    }

    // Create payment request
    try {
      const pr = stripe.paymentRequest({
        country: cart.shipping_address.country_code?.toUpperCase() || "IE",
        currency: currency.toLowerCase(),
        total: {
          label: "Nature's Elixir",
          amount: amountInSubunits,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: false,
      })

      // Check if payment method is available (Apple Pay, Google Pay, etc.)
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr)
          setCanMakePayment(true)
        } else {
          setCanMakePayment(false)
        }
      }).catch(() => {
        setPaymentRequest(null)
        setCanMakePayment(false)
      })

    // Handle payment method selection
    pr.on("paymentmethod", async (ev) => {
      const session = cart.payment_collection?.payment_sessions?.find(
        (s) => s.status === "pending"
      )

      if (!session?.data?.client_secret) {
        ev.complete("fail")
        onError("Payment session not found")
        return
      }

      try {
        // Confirm payment with the payment method from Apple Pay/Google Pay
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          session.data.client_secret as string,
          {
            payment_method: ev.paymentMethod.id,
          },
          { handleActions: false }
        )

        if (confirmError) {
          ev.complete("fail")
          onError(confirmError.message || "Payment failed")
        } else {
          ev.complete("success")
          
          // If payment succeeded, place the order
          // placeOrder() is a server action that redirects, so we call onSuccess
          // which will trigger the redirect in the parent component
          if (
            (paymentIntent && paymentIntent.status === "requires_capture") ||
            paymentIntent.status === "succeeded"
          ) {
            // Call placeOrder which will redirect to order confirmation
            placeOrder().catch((err) => {
              onError(err.message || "Failed to place order")
            })
          }
        }
      } catch (err: any) {
        ev.complete("fail")
        onError(err.message || "Payment failed")
      }
    })

    } catch (err: any) {
      setPaymentRequest(null)
      setCanMakePayment(false)
      return
    }

    return () => {
      // Cleanup
    }
  }, [
    stripe, 
    cart, 
    cart?.total, 
    cart?.subtotal, 
    cart?.shipping_total, 
    cart?.tax_total, 
    cart?.shipping_methods, 
    cart?.shipping_address,
    onError, 
    onSuccess
  ])

  if (!canMakePayment || !paymentRequest) {
    return null
  }

  return (
    <div className="mt-4 mb-4">
      <PaymentRequestButtonElement
        options={{
          paymentRequest,
          style: {
            paymentRequestButton: {
              theme: "dark",
              height: "48px",
            },
          },
        }}
      />
    </div>
  )
}

export default PaymentRequestButton

