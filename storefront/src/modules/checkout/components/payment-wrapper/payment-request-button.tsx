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
    if (!stripe || !cart || !cart.shipping_address) {
      return
    }

    // Calculate total amount (including shipping and tax)
    const total = cart.total || 0
    const currency = cart.currency_code?.toUpperCase() || "EUR"

    // Create payment request
    const pr = stripe.paymentRequest({
      country: cart.shipping_address.country_code?.toUpperCase() || "IE",
      currency: currency.toLowerCase(),
      total: {
        label: "Nature's Elixir",
        amount: total,
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

    return () => {
      // Cleanup
    }
  }, [stripe, cart, onError, onSuccess])

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

