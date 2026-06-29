# TOKNAV Website CMS

This project now runs as a Next.js website with a lightweight CMS admin at `/admin`.

## What The CMS Supports

- Login-protected admin dashboard
- Page management with SEO fields and editable blocks
- Blog create / edit / delete / draft / publish
- Product create / edit / delete / draft / publish
- Inquiry capture and follow-up status management
- Customer records for new and old buyers
- Media library upload / delete / copy URL / image alt text
- Global settings for site name, logo, favicon, default SEO, social links, contact email and footer text
- One-click sync of current website pages and product model data into the CMS

## Admin Paths

- `/admin/login`
- `/admin/dashboard`
- `/admin/pages`
- `/admin/pages/new`
- `/admin/pages/[id]/edit`
- `/admin/blog`
- `/admin/blog/new`
- `/admin/blog/[id]/edit`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]/edit`
- `/admin/inquiries`
- `/admin/customers`
- `/admin/media`
- `/admin/settings`

## Environment Variables

Copy `.env.example` to `.env.local` for local development.

Required:

- `CMS_SESSION_SECRET`: long random secret for admin sessions

Recommended production mode:

- `CMS_STORAGE_MODE=github`
- `CMS_GITHUB_TOKEN`: GitHub token with permission to update repository contents
- `CMS_GITHUB_REPO=emmalin101/toknavgnss-md`
- `CMS_GITHUB_BRANCH=main`

Local-only mode:

- `CMS_STORAGE_MODE=local`

Local mode writes to:

- `content/cms-data.json`
- `content/cms-auth.json`
- `public/uploads`

On Vercel, use GitHub mode because serverless local file writes are not persistent.

## Initialize CMS Data

Run:

```bash
node scripts/seed-cms.mjs
```

This creates `content/cms-data.json` with:

- Home page editable hero and CTA blocks
- Existing markdown blog posts
- Existing product records that can be detected from the product data file
- Default TOKNAV settings

The dashboard also includes **Sync Current Website Content**. Use it when you want to import the current visible website pages and product models into the CMS without touching code. It adds:

- Home, Products, About, Contact, Inquiry, Blog and News pages
- Product category pages
- Existing product model records
- Product type, summary, applications, highlights, gallery and specifications

## Edit Product Parameters

Go to:

```text
/admin/products
```

Open a product model and edit:

- `Product type / kicker`: the short product category shown near the title
- `Short summary`: text shown on product cards and the product hero
- `Detailed product page description`: main product detail text
- `Applications`: one application per line
- `Highlights`: one selling point per line
- `Specs / parameters`: one row per line in `Label | Value` format
- `Main image` and `Gallery URLs`: product image and gallery
- `SEO title` and `SEO description`: product page metadata

Published products are used by the frontend first. If a CMS product has specs, those specs override the older hardcoded specification table for that model.

## Manage Inquiries and Customers

Website inquiry forms submit to `/api/inquiry`. New inquiries are stored in the CMS and automatically matched to customer records by email or WhatsApp.

Use:

- `/admin/inquiries`: review inquiry messages, change lead status, edit product interest and add follow-up notes
- `/admin/customers`: add or edit customer profiles, product interests, company details and long-term notes

If email delivery is not configured, inquiry records are still saved in the CMS.

## Create Administrator Account

Open `/admin/login`.

If no admin exists yet, the first successful login creates the administrator account. Use:

- Email: your admin email, for example `your-admin@example.com`
- Password: at least 10 characters

The password is stored as a scrypt hash in `content/cms-auth.json` or via the configured storage mode.

You can also generate a hash for env-based setup:

```bash
node scripts/create-admin-hash.mjs "your-secure-password"
```

Then set:

```bash
CMS_ADMIN_EMAIL="your-admin@example.com"
CMS_ADMIN_PASSWORD_HASH="scrypt$..."
```

## Upload Images

Go to `/admin/media`.

Allowed types:

- jpg
- jpeg
- png
- webp
- gif
- safe svg

Default max size is 5MB. Change it with:

```bash
CMS_MAX_UPLOAD_MB=5
```

## Deployment

The site is configured for Next.js on Vercel.

Important:

- `vercel.json` now uses `framework: "nextjs"`.
- Old `.html` URLs are preserved with Next rewrites.
- `/admin` is blocked in `robots.txt`.

For production CMS saving, set GitHub storage variables in Vercel. When the CMS writes content to GitHub, Vercel can redeploy from the updated repository.

## Frontend Data Fallback

The current website design is preserved.

Frontend pages read CMS data first where implemented:

- Home page hero and CTA
- Products, About, Contact, Inquiry, Blog and News page hero/SEO fields
- Product category page hero/SEO fields
- Extra CMS page blocks: rich text, image, gallery, CTA and FAQ
- Blog index and details
- Product index, category and details
- Footer settings and social links

If CMS data is missing, existing hardcoded content is still used as fallback so pages do not go blank.

## Extend Block Types

Block types live in:

- `app/lib/cms/types.ts`
- `app/admin/components/PageEditor.tsx`
- `app/lib/cms/public.ts`

To add a block type:

1. Add the type to `CmsBlockType`.
2. Add an editor UI in `PageEditor.tsx`.
3. Read the block on the frontend with `getBlockData`.
