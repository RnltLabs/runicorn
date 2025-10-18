# 🦄 Runicorn

> Draw unicorns, propose with GPS, get more kudos than your 5K PR.

A creative GPS route drawing tool that lets you turn your runs into art. Draw custom routes, export to GPX, and make your activities legendary.

---

## ⚖️ License

**Copyright © 2025 Roman Reinelt / RNLT Labs. All rights reserved.**

This software is **proprietary and confidential**. This repository is public only to comply with GitHub's requirements for using GitHub Actions on the free tier.

**NO LICENSE IS GRANTED** for use, modification, distribution, or copying of this code without explicit written permission from the copyright holder.

For licensing inquiries, contact: Roman Reinelt / RNLT Labs

---

## 🚀 Features

- **Interactive Route Drawing** - Draw custom GPS routes on an interactive map
- **Snap to Roads** - Automatically snap your drawings to actual roads
- **Elevation Profile** - Get elevation gain/loss for your routes
- **GPX Export** - Export your routes as GPX files for upload to activity tracking apps
- **Dark Theme** - Beautiful dark mode interface
- **Mobile-Friendly** - Works on desktop and mobile devices

---

## 🛠️ Tech Stack

- **React** + TypeScript
- **Vite** - Fast build tool
- **Leaflet** - Interactive maps
- **GraphHopper** - Routing & elevation data
- **Tailwind CSS** - Styling
- **Docker** - Containerized deployment

---

## 🔒 Security

This is a production application with proper security measures:
- All sensitive credentials stored in GitHub Secrets
- Environment variables never committed to repository
- API keys managed securely via build-time injection
- Discord webhook notifications for deployments

---

## 📦 Development

This project uses a professional CI/CD workflow:

- **Main Branch** → Production (https://rnltlabs.de/runicorn/)
- **Develop Branch** → Staging (https://staging.rnltlabs.de/runicorn/)
- **Feature Branches** → Pull Requests → Review → Merge

### Local Development

```bash
npm install
npm run dev
```

### Version Management

```bash
npm version patch  # Bug fixes (1.0.0 → 1.0.1)
npm version minor  # New features (1.0.0 → 1.1.0)
npm version major  # Breaking changes (1.0.0 → 2.0.0)
```

---

## 🏢 About

Developed by **Roman Reinelt** / **RNLT Labs**

This repository is part of a portfolio of professional web applications.

---

**© 2025 Roman Reinelt / RNLT Labs. All rights reserved.**
