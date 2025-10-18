# CI/CD Workflows

This project uses GitHub Actions for automated testing, building, and deployment.

## Workflows

### 1. PR Checks (`pr-checks.yml`)
**Triggers:** Pull requests to `main` or `develop`

**What it does:**
- ✅ Runs ESLint
- ✅ Type checking with TypeScript
- ✅ Builds the project
- ✅ Verifies build output

**Purpose:** Ensures code quality before merging

---

### 2. Deploy to Staging (`deploy-staging.yml`)
**Triggers:** Push to `develop` branch

**What it does:**
- 🏗️ Builds Docker image with tag `staging`
- 📦 Pushes to Docker Hub
- 🚀 Deploys to staging server (port 3003)
- ✅ Verifies deployment

**Access:** https://rnltlabs.de/staging/runicorn/ (after nginx config)

---

### 3. Deploy to Production (`deploy-production.yml`)
**Triggers:** Push to `main` branch

**What it does:**
- 💾 Creates backup of current production container
- 🏗️ Builds Docker image with tags `latest` and `vX.X.X`
- 📦 Pushes to Docker Hub
- 🚀 Deploys to production server (port 3002)
- ✅ Verifies deployment
- 🏷️ Creates GitHub release

**Access:** https://rnltlabs.de/runicorn/

---

## Required GitHub Secrets

Configure these in: Settings → Secrets and variables → Actions

| Secret Name | Description |
|-------------|-------------|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token |
| `VITE_GRAPHHOPPER_API_KEY` | GraphHopper API key |
| `SERVER_HOST` | Server hostname (rnltlabs.de) |
| `SERVER_USER` | SSH username (root) |
| `SSH_PRIVATE_KEY` | SSH private key for server access |

---

## Development Workflow

### Starting a new feature:
```bash
git checkout develop
git pull
git checkout -b feature/my-new-feature

# ... develop ...
git add .
git commit -m "Add new feature"
git push origin feature/my-new-feature

# Create PR: feature/my-new-feature → develop
```

### Fixing a bug:
```bash
git checkout develop
git checkout -b bugfix/fix-something

# ... fix ...
git commit -m "Fix: description"
git push origin bugfix/fix-something

# Create PR: bugfix/fix-something → develop
```

### Hotfix for production:
```bash
git checkout main
git checkout -b hotfix/critical-fix

# ... fix ...
git commit -m "Hotfix: description"
git push origin hotfix/critical-fix

# Create PR: hotfix/critical-fix → main
# Then also merge to develop!
```

### Releasing to production:
```bash
# After testing on staging, create PR:
# develop → main

# After merge, automatic deployment to production happens
```
