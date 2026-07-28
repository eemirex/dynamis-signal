# Contributing

Thank you for considering a contribution to Dynamis Signal.

## Workflow

1. Open an issue for substantial product or architecture changes.
2. Fork the repository and create a focused branch.
3. Keep UI additions consistent with the existing Dynamis design tokens.
4. Add or update validation when changing a server route.
5. Preserve organization scoping and row-level security for every new database table.
6. Run the full quality suite before opening a pull request:

   ```bash
   pnpm typecheck
   pnpm lint
   pnpm build
   ```

## Pull requests

Explain the user problem, the chosen approach, verification performed, and any schema or environment changes. Include desktop and mobile captures for visual changes.

Never include credentials, customer data, provider payloads, or private transcripts in an issue, fixture, commit, or screenshot.
