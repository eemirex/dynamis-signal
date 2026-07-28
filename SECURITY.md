# Security policy

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Contact the repository owner through the email listed on the associated GitHub profile and include the affected surface, reproduction steps, and expected impact. Avoid including live credentials or customer data.

## Supported version

Security fixes are applied to the latest version on `main`.

## Deployment checklist

- Keep `NEXT_PUBLIC_DEMO_MODE=false` for a connected deployment.
- Use only the browser-safe Supabase publishable key in `NEXT_PUBLIC_*` variables.
- Keep service-role keys and webhook secrets in server-only environment variables.
- Apply all database migrations and verify row-level security before importing data.
- Restrict OAuth redirect URLs to controlled domains.
- Rotate webhook signing secrets and provider tokens after suspected exposure.
- Use HTTPS for every external webhook endpoint.
- Review audit logs and failed webhook deliveries regularly.
- Treat meeting transcripts as sensitive business data and retain them only as long as required.
