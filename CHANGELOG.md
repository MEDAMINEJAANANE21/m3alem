# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.0.0] — 2026-11-11

First open-source release: complete rework of the original student project.

### Added

- Working REST API (Express 5 + MongoDB): auth with roles, services, bookings, reviews, admin.
- Booking workflow with server-side pricing and status transitions.
- "My account" page for clients and providers.
- Seed script with the demo catalog and demo accounts.
- 28 API integration tests (in-memory MongoDB), ESLint, Prettier, GitHub Actions CI, Dependabot.
- Docker stack: nginx + API + MongoDB + mongo-express (database UI), with a one-shot seed service.
- Render blueprint and a free hosting guide (MongoDB Atlas + Render).
- Demo banner on every page (`DEMO_MODE`).
- Documentation: README (EN + FR), architecture, API, deployment, contributing, security.

### Changed

- Frontend and backend separated into npm workspaces; the frontend proxies `/api` to the backend
  (Vite in development, nginx in production).
- Consistent file naming (`<feature>.<type>.js`) and clean page URLs.
- Shared header and footer; reviews, sign-in and checkout connected to the API.
- Visual redesign: warm neutral palette with the brand blue as the only accent, Instrument Sans +
  Geist Mono, split hero with a real photo and a "work order" booking card, calmer copy.
- Bootstrap and Bootstrap Icons installed from npm.

### Fixed

- Backend could not start (empty files, missing imports).
- XSS in customer reviews (`innerHTML` with user input).
- Admin accounts could be requested at sign-up; mass assignment on services and bookings.
- Unescaped user input in the location regex filter.
- Missing icons, duplicated Bootstrap loading, broken footer styles, horizontal scroll on mobile.

### Removed

- Unused jQuery plugins, TemplateMo theme files and stock images.

[Unreleased]: https://github.com/MEDAMINEJAANANE21/m3alem/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/MEDAMINEJAANANE21/m3alem/releases/tag/v1.0.0
