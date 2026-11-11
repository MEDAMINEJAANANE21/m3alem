# Deployment

This guide puts M3alem.ma online for free with:

| Part     | Host                                              | Plan      |
| -------- | ------------------------------------------------- | --------- |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas)    | Free (M0) |
| API      | [Render](https://render.com) web service (Docker) | Free      |
| Website  | Render static site, proxying `/api/*` to the API  | Free      |

The architecture stays the same as in development: the browser only talks to the website, which
forwards `/api` requests to the API.

> Free plans change over time — check the current limits when you sign up. On Render's free
> plan the API goes to sleep when unused, so the first request after a pause can take up to a
> minute.

## 1. Database — MongoDB Atlas

1. Create a free account and a free **M0** cluster.
2. **Database Access** → add a database user with a strong password.
3. **Network Access** → allow `0.0.0.0/0` (Render's free plan has no fixed outgoing IP).
4. **Connect → Drivers** → copy the connection string and add the database name `m3alem`:

   ```text
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/m3alem?retryWrites=true&w=majority
   ```

## 2. API and website — Render

1. Push the repository to GitHub.
2. On Render: **New → Blueprint**, select the repository. Render reads [`render.yaml`](../render.yaml)
   and creates two services: `m3alem-api` and `m3alem`.
3. When asked for `MONGODB_URI`, paste the Atlas connection string. `JWT_SECRET` is generated
   automatically.
4. Wait for both deploys to finish, then open the `m3alem` URL (e.g. `https://m3alem.onrender.com`).

If the API did not get the URL `https://m3alem-api.onrender.com` (the name was already taken),
copy its real URL into the `routes` section of `render.yaml` and push again.

## 3. Demo data (optional)

The seed script refuses to run in production, so run it once from your own computer, pointed at
Atlas:

```bash
# PowerShell
$env:MONGODB_URI="mongodb+srv://..."; $env:NODE_ENV="development"; npm run seed

# bash
MONGODB_URI="mongodb+srv://..." NODE_ENV=development npm run seed
```

It **deletes** existing services, bookings and reviews before inserting the demo data.

## Checklist before sharing the link

- [ ] `DEMO_MODE` is `true` in `frontend/src/config/app.config.js` (banner on every page), unless
      you really run the service.
- [ ] The Web3Forms key in the same file is yours (contact messages are e-mailed to its owner).
- [ ] You have the right to publish the photos in `frontend/public/img`.
- [ ] mongo-express is **not** deployed — it is a local tool only.

## Other options

- **Any VPS with Docker** (Hetzner, OVH, Oracle Cloud free tier…): copy the repository, create
  `.env` and run `docker compose up -d --build`. Put a reverse proxy with HTTPS in front (for
  example Caddy) and do not expose ports 3000, 8081 and 27017.
- **Vercel / Netlify** for the website, with a rewrite of `/api/*` to the API URL.
