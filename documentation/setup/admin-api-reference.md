# Admin API Reference

Quick reference for authenticating with the MedusaJS 2.0 Admin API.

## ⚠️ Common Gotcha: Header Format

**The most common mistake:** Using `x-medusa-access-token` or `Authorization: Bearer` with secret API keys.

**Correct method:** Use `Authorization: Basic` with your secret key.

## Authentication Methods

### 1. Secret API Key (Recommended for Scripts)

Use your **secret API key** (starts with `sk_`) with the `Authorization: Basic` header:

```bash
curl -X GET "https://your-backend-url.com/admin/products?limit=1" \
  -H "Authorization: Basic sk_your_secret_key_here" \
  -H "Content-Type: application/json"
```

**JavaScript/Node.js:**
```javascript
const response = await fetch('https://your-backend-url.com/admin/products?limit=1', {
  headers: {
    'Authorization': `Basic ${SECRET_KEY}`,  // ← Use Basic, not Bearer!
    'Content-Type': 'application/json'
  }
});
```

**Important:**
- ✅ Use `Authorization: Basic {secret_key}`
- ❌ Do NOT use `x-medusa-access-token`
- ❌ Do NOT use `Authorization: Bearer` (that's for JWT tokens)

### 2. JWT Token (After User Login)

**Step 1: Get JWT Token**
```bash
curl -X POST "https://your-backend-url.com/auth/user/emailpass" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'
```

**Step 2: Use JWT Token**
```bash
curl -X GET "https://your-backend-url.com/admin/products?limit=1" \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json"
```

### 3. Cookie Session (Browser/SSR)

Requires JWT token first, then create session. See [MedusaJS docs](https://docs.medusajs.com/api/admin#authentication) for details.

## Key Differences

| Method | Header | Use Case |
|--------|--------|----------|
| **Secret API Key** | `Authorization: Basic {sk_...}` | Scripts, automation, server-to-server |
| **JWT Token** | `Authorization: Bearer {jwt}` | After user login, client apps |
| **Cookie Session** | `Cookie: connect.sid={sid}` | Browser apps, SSR |

## API Key Types

- **Publishable Key** (`pk_...`): Used for **Store API** (`/store/*` routes) - public access
- **Secret Key** (`sk_...`): Used for **Admin API** (`/admin/*` routes) - requires authentication

## Quick Checklist

- [ ] Using `Authorization: Basic` (not `Bearer` or `x-medusa-access-token`)
- [ ] Secret key is **Active** (check in admin dashboard: Settings → Secret API Keys)
- [ ] Accessing `/admin/*` routes (not `/store/*`)
- [ ] Backend URL is correct

## Reference Links

- [MedusaJS Admin API Docs](https://docs.medusajs.com/api/admin#authentication)
- [Secret API Keys Guide](https://docs.medusajs.com/user-guide/settings/developer/secret-api-keys)

