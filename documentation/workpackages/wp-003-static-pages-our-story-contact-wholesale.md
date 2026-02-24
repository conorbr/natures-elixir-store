# WP-003: Add Our Story, Contact Us, and Wholesale Pages

## Summary

Add three new static pages to the storefront:

1. **Our Story** – Brand/story page (content-driven).
2. **Contact Us** – General contact page (contact form and/or contact details).
3. **Wholesale** – Wholesale enquiries page: **contact form + phone number** (no extra complexity).

All pages use the existing main layout (Nav + Footer) and respect the `[countryCode]` route segment.

## Current State

- **Routing**: Next.js App Router under `storefront/src/app/[countryCode]/(main)/`. Static pages follow the same pattern (e.g. `store/page.tsx`).
- **Layout**: `(main)/layout.tsx` provides Nav and Footer. New pages will render inside this layout.
- **Navigation**: Footer has Categories, Collections, and a “Medusa” link block (placeholder). Nav has Search, Account, Cart. No existing “Our Story”, “Contact”, or “Wholesale” links.
- **Forms**: No dedicated contact form in the storefront today; checkout and account forms exist and can inform patterns. Backend: Resend is used for transactional email; contact form submission could use an API route + Resend or a third-party form service.

## Scope

### In scope

1. **Our Story page**
   - Route: `/[countryCode]/our-story` (e.g. folder `(main)/our-story/page.tsx`).
   - Content: Client-supplied copy (and optional imagery). Page can be a simple template with editable content (hardcoded for now or sourced from CMS/config later).
   - Metadata: Title and description for SEO.

2. **Contact Us page**
   - Route: `/[countryCode]/contact` (e.g. folder `(main)/contact/page.tsx`).
   - Content: Contact form and/or displayed contact details (email, phone, address as provided by client). Form behaviour: either submit to an API route that sends email (e.g. via Resend) or use a client-preferred method (e.g. form service).

3. **Wholesale page**
   - Route: `/[countryCode]/wholesale` (e.g. folder `(main)/wholesale/page.tsx`).
   - Content: **Contact form + phone number** only. Same form approach as Contact Us (API route + email or external form). Phone number displayed as provided by client (e.g. clickable `tel:` link).

4. **Discovery**
   - Add links to these pages in Footer and/or Nav (e.g. “Our Story”, “Contact”, “Wholesale”) so they are discoverable. Footer is the usual place for such links; update the placeholder “Medusa” block or add a “Company”/“Info” column.

### Out of scope (unless agreed)

- CMS or admin-editable page content (can be a later WP).
- Chat widgets, map embeds, or complex contact UX beyond form + details.
- Wholesale-specific logic (e.g. wholesale pricing, registration); this WP is page + form + phone only.

## Acceptance criteria

- [ ] **Our Story**: Page at `/[countryCode]/our-story` with client content (placeholder copy acceptable until final copy); title/description set; accessible from nav/footer.
- [ ] **Contact Us**: Page at `/[countryCode]/contact` with a contact form and/or contact details; form submits successfully (e.g. sends email or to agreed endpoint); linked from nav/footer.
- [ ] **Wholesale**: Page at `/[countryCode]/wholesale` with a contact form and a visible phone number (clickable where appropriate); form behaviour consistent with Contact Us; linked from nav/footer.
- [ ] All three pages use the main layout, work for all supported country codes, and have appropriate metadata.
- [ ] Footer (and/or nav) updated so “Our Story”, “Contact”, and “Wholesale” are clearly available.

## Technical notes

- **Routes**: Add `our-story`, `contact`, and `wholesale` under `storefront/src/app/[countryCode]/(main)/`, each with a `page.tsx`.
- **Templates**: Can add simple templates under `storefront/src/modules/` (e.g. a shared “static page” or “contact page” template) or keep page components self-contained.
- **Contact form**: Implement form in React, POST to an API route (e.g. `app/api/contact/route.ts` or `app/api/wholesale/route.ts`); backend can use Resend to send to client email. Alternatively, use a form service (e.g. Formspree, Typeform) and link from the page.
- **Phone number**: Store in env (e.g. `NEXT_PUBLIC_WHOLESALE_PHONE`) or constants; render as `<a href={`tel:${phone}`}>...</a>`.
- **Content**: Our Story and any static contact details (address, email) can live in constants, a JSON file, or (later) CMS. Client to supply copy and contact details.

## Dependencies

- Client: Final or placeholder copy for Our Story; contact details (phone, email, address) for Contact and Wholesale; phone number for Wholesale.
- Decision: Form submission via Resend/API vs third-party form service.
- Resend (or chosen email path) configured for storefront-originated emails if using API route.

## Notes

- Nature’s Elixir is the brand; ensure page titles and footer/nav labels match client preference (“Our Story” vs “About Us”, “Contact” vs “Contact Us”, etc.).
- Wholesale page is intentionally minimal: contact form + phone number only.
