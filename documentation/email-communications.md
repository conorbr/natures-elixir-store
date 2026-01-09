# Nature's Elixir - Email Communications

## Email Service Configuration

### Provider: Resend

**Configuration**:
- Service: Resend
- Module Location: `backend/src/modules/email-notifications/`
- Templates Location: `backend/src/modules/email-notifications/templates/`

**Environment Variables**:
- `RESEND_API_KEY` - Resend API key
- `RESEND_FROM_EMAIL` - Sender email address

## Email Templates

### Base Template

**Location**: `backend/src/modules/email-notifications/templates/base.tsx`

**Purpose**: Base template for all transactional emails with consistent branding

**Customization Notes**:
- Update with Nature's Elixir branding
- Use natural, authentic tone
- Health-focused design elements

### Order Confirmation

**Template**: `order-placed.tsx`
**Trigger**: Order placed event
**Subscriber**: `backend/src/subscribers/order-placed.ts`

**Content Should Include**:
- Order number
- Order items (tea, oils, sponges)
- Shipping address
- Billing address
- Payment method
- Order total
- Estimated delivery date
- Tracking information (when available)

**Tone**: Professional, friendly, natural

### User Invitation

**Template**: `invite-user.tsx`
**Trigger**: User invite created
**Subscriber**: `backend/src/subscribers/invite-created.ts`

**Content Should Include**:
- Invitation link
- Account setup instructions
- Welcome message

**Tone**: Welcoming, friendly

## Email Subscribers

### Order Placed

**File**: `backend/src/subscribers/order-placed.ts`

**Functionality**:
- Sends order confirmation email
- Includes order details
- Provides order tracking information

### Invite Created

**File**: `backend/src/subscribers/invite-created.ts`

**Functionality**:
- Sends user invitation email
- Includes account setup link

## Email Customization Checklist

- [ ] Customize base template with Nature's Elixir branding
- [ ] Update order confirmation email template
- [ ] Update user invitation email template
- [ ] Test all email templates
- [ ] Configure sender email address
- [ ] Set up email domain authentication (SPF, DKIM)
- [ ] Test email delivery
- [ ] Review email content for brand consistency

## Brand Guidelines for Emails

### Tone
- Natural and authentic
- Health-focused
- Friendly and approachable
- Professional but warm

### Design Elements
- Natural color palette
- Clean, simple design
- Easy to read
- Mobile-responsive

### Content Guidelines
- Clear and concise
- Include all relevant order information
- Provide helpful next steps
- Include customer support contact information

## Email Notifications

### Customer-Facing Emails

1. **Order Confirmation**
   - Sent immediately after order placement
   - Includes order details and payment confirmation

2. **Order Shipped**
   - Sent when order is marked as shipped
   - Includes tracking information

3. **Order Delivered**
   - Sent when order is marked as delivered
   - Includes delivery confirmation

4. **Password Reset**
   - Sent when customer requests password reset
   - Includes reset link

5. **Account Verification**
   - Sent for new account registrations
   - Includes verification link

### Admin Notifications

- [To be configured if needed]
- Low stock alerts
- New order notifications
- Payment issues

## Email Testing

### Test Scenarios
- [ ] Order confirmation email
- [ ] User invitation email
- [ ] Password reset email
- [ ] Email rendering on different email clients
- [ ] Mobile responsiveness
- [ ] Link functionality
- [ ] Image loading

## Email Deliverability

### Best Practices
- Use authenticated domain (SPF, DKIM)
- Maintain good sender reputation
- Avoid spam trigger words
- Include unsubscribe links (if applicable)
- Test email deliverability

### Domain Setup
- Configure SPF records
- Configure DKIM records
- Set up DMARC policy
- Verify domain with Resend

## Notes

- All transactional emails should maintain brand consistency
- Test emails thoroughly before going live
- Monitor email deliverability rates
- Update templates as brand evolves
- Keep email content clear and helpful

