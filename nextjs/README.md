# FormAPI nextjs starter

Create a free account at https://getformapi.com/en, verify your email and create a form.
Replace `https://getformapi.com/f/YOUR_FORM_ID` in app/page.tsx with your public endpoint. This identifier is public, not an authentication key.

Alternatively set `NEXT_PUBLIC_FORMAPI_ENDPOINT` in `.env.local` before building. This endpoint is public. Never place private keys in `NEXT_PUBLIC_` variables.

Run `npm install` then `npm run dev`. Build with `npm run build` before deployment.

This example uses JavaScript for inline errors. Translate labels and messages to match your website. For Spanish HTML redirects add `?lang=es` to the endpoint if switching to a traditional form POST.

Only flat text fields are supported. No uploads, outgoing webhooks, payments or automatic replies. If your FormAPI form restricts an origin, match the exact deployed origin. CAPTCHA starts disabled in this example: if enabled in FormAPI, integrate the widget and send a fresh `cf-turnstile-response` token too.

Before publishing test empty fields, invalid email, network failure, a 429 response and a valid submission. Use an authorized QA form. Confirm the exact test message in your inbox and email notification when enabled; a success UI alone is insufficient. Accepted tests consume quota. Monthly quotas are shared across all forms; annual billing does not create an annual message pool.

Free: 3 forms, 100 submissions/month, 30-day retention. Pro: 20 forms, 2,000/month, 90-day retention; USD 16/month or USD 144/year (USD 12/month equivalent), applicable taxes included. Prices can change: https://getformapi.com/en#pricing.

Retries retain the idempotency key for unchanged payloads. Keep retries within 24 hours. Your endpoint is public: it does not verify visitor identity. Never include passwords, API secrets or sensitive records in frontend code.
