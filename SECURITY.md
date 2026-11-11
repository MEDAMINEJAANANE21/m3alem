# Security Policy

## Supported versions

Only the latest version on the `main` branch receives security fixes.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Use GitHub's private vulnerability reporting instead: go to the repository's **Security** tab,
then **Report a vulnerability**. Include:

- a description of the issue and its impact;
- steps to reproduce (or a proof of concept);
- the affected files or endpoints, if known.

You will receive an answer as soon as possible. Once the fix is released, you will be credited
in the changelog unless you prefer to stay anonymous.

## Good practices for deployments

- Use a long random `JWT_SECRET` and never commit `.env` files.
- Serve the site over HTTPS only.
- Set `TRUST_PROXY` to the number of reverse proxies in front of the API.
- Never run `npm run seed` on a production database (the script refuses when `NODE_ENV=production`).
