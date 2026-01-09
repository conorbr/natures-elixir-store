# Apple Pay & Google Pay Setup Guide

## Overview

Apple Pay and Google Pay have been added to the checkout flow using Stripe's Payment Request Button. This provides a seamless, one-click payment experience for customers.

## How It Works

The Payment Request Button automatically detects:
- **Apple Pay** on Safari (macOS, iOS, iPadOS)
- **Google Pay** on Chrome and other supported browsers
- Other payment methods supported by the browser

The button only appears if the customer's device/browser supports these payment methods.

## Requirements

### 1. HTTPS Required

✅ **Already configured** - Your Railway deployment uses HTTPS by default

Apple Pay and Google Pay require HTTPS to function. Since your store is deployed on Railway, this is already handled.

### 2. Stripe Configuration

✅ **Already configured** - Stripe is set up in your backend

No additional Stripe configuration is needed. The Payment Request Button uses your existing Stripe integration.

### 3. Domain Verification (Optional)

For production, you may want to verify your domain with:
- **Apple Pay**: Domain verification in Apple Developer account (optional for most use cases)
- **Google Pay**: No domain verification needed

## Implementation Details

### Component Location

- **Component**: `storefront/src/modules/checkout/components/payment-wrapper/payment-request-button.tsx`
- **Integration**: `storefront/src/modules/checkout/components/payment/index.tsx`

### How It Appears

1. The button appears **above** the card input field
2. It only shows if the customer's device/browser supports Apple Pay or Google Pay
3. If not supported, the button is hidden and only the card input is shown
4. A divider with "Or" separates the payment methods
5. The button automatically shows the correct payment method (Apple Pay on Apple devices, Google Pay on others)

### Technical Details

- Uses Stripe's `PaymentRequestButtonElement` component
- Automatically detects available payment methods
- Requires shipping address to be set (uses cart shipping address)
- Uses cart total and currency for payment amount
- Integrates with existing Stripe payment flow

### Payment Flow

1. Customer clicks Apple Pay/Google Pay button
2. Native payment sheet opens (Apple Pay or Google Pay)
3. Customer authenticates (Face ID, Touch ID, or password)
4. Payment is processed through Stripe
5. Order is automatically placed
6. Customer is redirected to order confirmation

## Testing

### Testing Apple Pay

1. **On macOS/iOS Safari**:
   - Open your store in Safari
   - Add items to cart
   - Go to checkout
   - Apple Pay button should appear if you have a card in Wallet
   - Click to test

2. **Requirements**:
   - Safari browser
   - macOS with Touch ID/Face ID or iPhone/iPad
   - Card added to Apple Wallet

### Testing Google Pay

1. **On Chrome/Edge**:
   - Open your store in Chrome
   - Add items to cart
   - Go to checkout
   - Google Pay button should appear if you have a card saved
   - Click to test

2. **Requirements**:
   - Chrome, Edge, or other Chromium-based browser
   - Google account with saved payment method
   - Or card saved in browser

### Testing Without Payment Methods

If you don't have Apple Pay or Google Pay set up:
- The button will not appear (this is expected)
- Only the card input form will be shown
- This is normal behavior

## Customization

### Button Style

You can customize the button appearance in `payment-request-button.tsx`:

```typescript
style: {
  paymentRequestButton: {
    theme: "dark", // Options: "dark", "light", "light-outline"
    height: "48px",
  },
}
```

### Button Position

The button appears above the card input. To change the position, edit `payment/index.tsx` where `PaymentRequestButton` is rendered.

## Troubleshooting

### Button Not Appearing

**Possible causes:**
1. **Not HTTPS**: Check that your site is served over HTTPS (Railway should handle this)
2. **Browser not supported**: Try Safari for Apple Pay, Chrome for Google Pay
3. **No payment method saved**: Customer needs to have a card saved in their wallet/browser
4. **Local development**: May not work on `localhost` - test on deployed site

### Payment Fails

- Check Stripe dashboard for error logs
- Verify Stripe keys are correct
- Ensure cart has shipping address (required for Payment Request)

## Benefits

✅ **Faster checkout** - One-click payment  
✅ **Higher conversion** - Reduces checkout friction  
✅ **Better UX** - Native payment experience  
✅ **Secure** - Uses device authentication  
✅ **Mobile-friendly** - Great for mobile customers  

## Notes

- The button automatically adapts to show Apple Pay on Apple devices and Google Pay on other devices
- No additional fees - uses your existing Stripe account
- Works with all currencies you've configured (EUR, GBP)
- Automatically uses the correct currency based on the cart

