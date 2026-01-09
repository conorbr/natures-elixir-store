# Nature's Elixir - Medusa Configuration

## Current Configuration

### Environment Setup

The Medusa backend is configured in `backend/medusa-config.js` with the following modules:

- **File Storage**: MinIO (with local fallback)
- **Email Notifications**: Resend
- **Payment Processing**: Stripe
- **Search**: MeiliSearch (optional)

### Required Environment Variables

#### Database

- `DATABASE_URL` - PostgreSQL connection string

#### Authentication & Security

- `JWT_SECRET` - JWT token signing secret
- `COOKIE_SECRET` - Cookie signing secret

#### CORS Configuration

- `ADMIN_CORS` - Admin dashboard CORS origins
- `AUTH_CORS` - Authentication CORS origins
- `STORE_CORS` - Storefront CORS origins

#### Email (Resend)

- `RESEND_API_KEY` - Resend API key for transactional emails
- `RESEND_FROM_EMAIL` - Sender email address for transactional emails

#### Payment (Stripe)

- `STRIPE_API_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret

#### File Storage (MinIO - Optional)

- `MINIO_ENDPOINT` - MinIO server endpoint
- `MINIO_ACCESS_KEY` - MinIO access key
- `MINIO_SECRET_KEY` - MinIO secret key
- `MINIO_BUCKET` - MinIO bucket name (default: medusa-media)

#### Search (MeiliSearch - Optional)

- `MEILISEARCH_HOST` - MeiliSearch server host
- `MEILISEARCH_ADMIN_KEY` - MeiliSearch admin API key

#### Infrastructure (Optional)

- `REDIS_URL` - Redis connection string (for event bus and workflows)
- `BACKEND_PUBLIC_URL` - Public URL for the backend
- `MEDUSA_WORKER_MODE` - Worker mode (server/worker/shared)
- `MEDUSA_DISABLE_ADMIN` - Disable admin dashboard (true/false)

## Store Configuration

### Regions

**Default Region**: Ireland/Europe

- Currency: EUR (primary)
- Countries: Ireland (IE) - primary
- Additional countries: UK (GB) - if applicable, EU countries - if applicable

**Additional Regions**: [To be configured based on shipping requirements]

### Sales Channels

- **Default Sales Channel**: Primary online store
- **Additional Channels**: [To be configured if needed]

### Currency Configuration

- **Primary Currency**: EUR (Ireland)
- **Supported Currencies**: EUR (primary), GBP (if UK shipping enabled)

## Custom Modules

### Email Notifications

- **Location**: `backend/src/modules/email-notifications/`
- **Provider**: Resend
- **Templates**:
  - Order placed
  - User invite
  - Base template for all emails

### File Storage

- **Location**: `backend/src/modules/minio-file/`
- **Provider**: MinIO (with local fallback)

## API Keys

### Admin API Keys

- [To be generated and documented]

### Store API Keys

- [To be generated and documented]

## Configuration Checklist

- [ ] Configure default region and currency
- [ ] Set up sales channels
- [ ] Configure shipping options (see shipping-fulfillment.md)
- [ ] Set up tax regions
- [ ] Configure payment providers (Stripe)
- [ ] Set up email notifications (Resend)
- [ ] Configure file storage (MinIO or local)
- [ ] Set up search (MeiliSearch if needed)
- [ ] Generate and document API keys
- [ ] Configure CORS for production domains

## Production Considerations

### Domain Configuration

- **Backend Domain**: [To be configured]
- **Storefront Domain**: natureselixir.com
- **Admin Domain**: [To be configured]

### SSL/TLS

- Ensure all domains have valid SSL certificates
- Configure HTTPS redirects

### Performance

- Enable Redis for production (event bus and workflows)
- Configure MinIO for cloud file storage
- Set up MeiliSearch for product search optimization

## Notes

- All configuration should be environment-based
- Use `.env` files for local development
- Never commit sensitive credentials to version control
- Update this document when configuration changes are made
