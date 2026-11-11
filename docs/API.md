# REST API

Base URL: `/api` (through the frontend proxy, or `http://localhost:3000/api` directly).

- Requests and responses use JSON.
- Protected routes need the header `Authorization: Bearer <token>`.
- Errors always look like:

```json
{
  "error": {
    "message": "Données invalides",
    "details": [{ "field": "price", "message": "Prix invalide" }]
  }
}
```

| Status | Meaning                                                 |
| ------ | ------------------------------------------------------- |
| 400    | Invalid input (see `details`)                           |
| 401    | Missing, invalid or expired token / wrong credentials   |
| 403    | Authenticated but not allowed (wrong role or not owner) |
| 404    | Resource or route not found                             |
| 409    | Conflict (e-mail already used, forbidden status change) |
| 429    | Too many requests (rate limit)                          |

Roles: `client`, `prestataire` (provider), `admin`.

---

## Health & reference data

| Method | Path              | Auth | Description              |
| ------ | ----------------- | ---- | ------------------------ |
| GET    | `/api/health`     | —    | `{ "status": "ok" }`     |
| GET    | `/api/categories` | —    | List of the 9 categories |

## Auth

| Method | Path                 | Auth | Description                 |
| ------ | -------------------- | ---- | --------------------------- |
| POST   | `/api/auth/register` | —    | Create a client or provider |
| POST   | `/api/auth/login`    | —    | Get a token                 |
| GET    | `/api/auth/me`       | any  | Current user                |

**Register**

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Salma",
  "email": "salma@example.com",
  "password": "at-least-8-chars",
  "phone": "+212600000000",
  "role": "client"
}
```

`role` is `client` (default) or `prestataire`. `phone` is optional.

Response `201`:

```json
{
  "token": "eyJhbGciOi...",
  "user": { "_id": "...", "name": "Salma", "email": "salma@example.com", "role": "client" }
}
```

**Login** — body `{ "email", "password" }`, response `200` with the same shape.

## Services

| Method | Path                | Auth             | Description      |
| ------ | ------------------- | ---------------- | ---------------- |
| GET    | `/api/services`     | —                | List / filter    |
| GET    | `/api/services/:id` | —                | One service      |
| POST   | `/api/services`     | `prestataire`    | Create           |
| PATCH  | `/api/services/:id` | owner or `admin` | Update (partial) |
| DELETE | `/api/services/:id` | owner or `admin` | Delete → `204`   |

Query filters for `GET /api/services`: `category` (slug), `location` (case-insensitive text),
`provider` (user id).

Service fields:

| Field         | Type   | Notes                                    |
| ------------- | ------ | ---------------------------------------- |
| `title`       | string | required, 2–120 chars                    |
| `description` | string | optional, ≤ 500 chars                    |
| `category`    | string | required, one of `/api/categories` slugs |
| `price`       | number | required, ≥ 0                            |
| `priceLabel`  | string | optional display text, e.g. `"70-120 €"` |
| `pricingUnit` | string | `fixed` (default), `hour` or `unit`      |
| `minQuantity` | int    | minimum hours/units, default 1           |
| `location`    | string | optional                                 |

```http
POST /api/services
Authorization: Bearer <provider token>

{ "title": "Ménage régulier", "category": "menage", "price": 20, "pricingUnit": "hour", "minQuantity": 2 }
```

## Bookings

| Method | Path                       | Auth                    | Description                  |
| ------ | -------------------------- | ----------------------- | ---------------------------- |
| POST   | `/api/bookings`            | `client`                | Book a service               |
| GET    | `/api/bookings/me`         | any                     | Bookings visible to the user |
| PATCH  | `/api/bookings/:id/status` | client, provider, admin | Change the status            |

**Create**

```http
POST /api/bookings
Authorization: Bearer <client token>

{
  "service": "<service id>",
  "scheduledAt": "2030-06-01T10:00:00.000Z",
  "address": "12 rue Atlas, Rabat",
  "quantity": 3,
  "phone": "+212600000000",
  "notes": "Interphone 4B"
}
```

- `scheduledAt` must be in the future.
- `quantity` is used for `hour` / `unit` services and must be ≥ the service `minQuantity`.
- `totalPrice` is **computed by the server** (`price × quantity`, or `price` for fixed prices).

**GET /api/bookings/me** returns the client's own bookings, the provider's received bookings,
or every booking for an admin.

**Status workflow**

```text
pending ──► confirmed ──► completed
   │            │
   └──► cancelled ◄┘
```

| Who      | Allowed changes                                      |
| -------- | ---------------------------------------------------- |
| Client   | `cancelled` only (on their own booking)              |
| Provider | `confirmed`, `completed`, `cancelled` (own bookings) |
| Admin    | any allowed transition                               |

Body: `{ "status": "confirmed" }`. An invalid transition returns `409`.

## Reviews

| Method | Path               | Auth    | Description                             |
| ------ | ------------------ | ------- | --------------------------------------- |
| GET    | `/api/reviews`     | —       | 20 latest reviews                       |
| POST   | `/api/reviews`     | —       | `{ authorName, comment, rating (1–5) }` |
| DELETE | `/api/reviews/:id` | `admin` | Moderate → `204`                        |

## Admin

| Method | Path               | Auth    | Description                   |
| ------ | ------------------ | ------- | ----------------------------- |
| GET    | `/api/admin/users` | `admin` | All users (without passwords) |

## Rate limits (per IP, per 15 minutes)

| Scope                                | Limit |
| ------------------------------------ | ----- |
| All `/api` routes                    | 300   |
| `POST /auth/login`, `/auth/register` | 20    |
| `POST /reviews`                      | 10    |
