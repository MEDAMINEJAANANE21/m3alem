# Contributing to M3alem.ma

Thanks for your interest! Every contribution is welcome: bug reports, ideas, documentation, code.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting started

1. Fork the repository and clone your fork.
2. Install dependencies: `npm install` (from the repository root).
3. Copy `backend/.env.example` to `backend/.env` and set `JWT_SECRET`.
4. Start MongoDB, then `npm run seed` and `npm run dev`.

See the [README](README.md#getting-started) for details.

## Workflow

1. Open an issue first for anything bigger than a small fix, so we can agree on the approach.
2. Create a branch from `main`:

   | Prefix      | Use for                         | Example                       |
   | ----------- | ------------------------------- | ----------------------------- |
   | `feat/`     | New feature                     | `feat/provider-dashboard`     |
   | `fix/`      | Bug fix                         | `fix/cart-total-rounding`     |
   | `docs/`     | Documentation only              | `docs/api-examples`           |
   | `refactor/` | Code change without new feature | `refactor/booking-controller` |
   | `test/`     | Tests only                      | `test/review-api`             |
   | `chore/`    | Tooling, dependencies           | `chore/update-eslint`         |

3. Make your changes, with tests when you change backend behaviour.
4. Check everything passes locally:

   ```bash
   npm run lint
   npm run format:check
   npm test
   npm run build
   ```

5. Commit using [Conventional Commits](https://www.conventionalcommits.org):

   ```text
   feat(bookings): allow providers to add a comment when cancelling
   fix(frontend): keep the cart after login redirect
   ```

6. Open a pull request and fill in the template. CI must be green.

## Naming conventions

The project follows the file naming rules of the
[Angular style guide](https://angular.dev/style-guide), also used by NestJS, applied to both
backend and frontend:

- **kebab-case** for every file and folder: `booking-status.constants.js`, not `bookingStatus.js`.
- **`<feature>.<type>.js`**: the name says _what_ it is about, then _what kind_ of file it is.

| Type          | Suffix           | Example                                         |
| ------------- | ---------------- | ----------------------------------------------- |
| Controller    | `.controller.js` | `backend/src/controllers/booking.controller.js` |
| Model         | `.model.js`      | `backend/src/models/user.model.js`              |
| Router        | `.router.js`     | `backend/src/routes/auth.router.js`             |
| Middleware    | `.middleware.js` | `backend/src/middlewares/auth.middleware.js`    |
| Validator     | `.validator.js`  | `backend/src/validators/service.validator.js`   |
| Service       | `.service.js`    | `backend/src/services/token.service.js`         |
| Constants     | `.constants.js`  | `backend/src/constants/roles.constants.js`      |
| Config        | `.config.js`     | `backend/src/config/env.config.js`              |
| Error         | `.error.js`      | `backend/src/errors/api.error.js`               |
| Utility       | `.util.js`       | `frontend/src/utils/dom.util.js`                |
| Store (state) | `.store.js`      | `frontend/src/stores/cart.store.js`             |
| Component     | `.component.js`  | `frontend/src/components/layout.component.js`   |
| Page script   | `.page.js`       | `frontend/src/pages/home.page.js`               |
| Page style    | `.page.css`      | `frontend/src/styles/pages/home.page.css`       |
| Test          | `.test.js`       | `backend/tests/booking.test.js`                 |

Entry points keep their conventional names: `app.js`, `server.js`, `seed.js`, `vite.config.js`,
and HTML pages (`index.html`, `services.html`…).

Inside the code:

- `camelCase` for variables and functions, `PascalCase` for classes, `UPPER_SNAKE_CASE` for
  constants.
- Names in English; user-facing text in French.
- Small functions with explicit names. Comments explain _why_, not _what_.

## Code style

- Formatting is handled by **Prettier** (`npm run format`) and linting by **ESLint**.
- Backend: controllers read `req.validated` only (never `req.body` directly) and throw `ApiError`.
- Frontend: build DOM with the `el()` helper — never insert user data with `innerHTML`.

## Reporting bugs

Use the **Bug report** issue template, with steps to reproduce, expected and actual behaviour.
For security issues, **do not open a public issue**: see [SECURITY.md](SECURITY.md).
