# Sanity + Astro Modern Monorepo 🚀

A modern, production-ready monorepo featuring Astro 5 frontend, Sanity CMS, and shared utilities. Built with 2025 best practices including Turborepo, TypeScript, and comprehensive testing.

## 📦 Packages

- **`frontend/`** - Astro 5 SSR application with HTMX, View Transitions, and Content Layer API
- **`studio/`** - Sanity Studio v3 with custom schemas and validation
- **`shared/`** - Shared TypeScript types, utilities, and constants

## 🏗️ Architecture

```
├── .changeset/          # Changeset configuration for versioning
├── .github/             # GitHub Actions CI/CD workflows
├── frontend/            # Astro frontend application
├── shared/              # Shared code and types
├── studio/              # Sanity CMS studio
├── turbo.json           # Turborepo configuration
└── package.json         # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (recommended)
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Build shared package first
npm run build --workspace=@sanity-astro/shared
```

### Development

```bash
# Run all packages in development mode
npm run dev

# Run specific package
npm run dev:frontend
npm run dev:studio
```

### Building

```bash
# Build all packages
npm run build

# Build specific package
npm run build:frontend
npm run build:studio
```

### Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch
```

## 🛠️ Modern Stack

### Frontend (Astro)
- **Astro 5.11** with SSR and View Transitions
- **Content Layer API** for optimal content loading
- **HTMX** for dynamic interactions
- **Modern Image Optimization** (AVIF, WebP, LQIP)
- **Enhanced Security** (CSP, rate limiting)
- **Vitest** for testing

### Studio (Sanity)
- **Sanity v3** with TypeScript schemas
- **Custom validation** and slug generation
- **Scheduled content** support
- **Norwegian localization**
- **Comprehensive testing**

### Monorepo Tooling
- **Turborepo** for build orchestration and caching
- **Changesets** for version management
- **Shared TypeScript** configurations
- **Centralized ESLint & Prettier**
- **GitHub Actions** CI/CD

## 📝 Available Scripts

| Script | Description |
|--------|------------|
| `npm run dev` | Start all packages in development mode |
| `npm run build` | Build all packages |
| `npm run test` | Run all tests |
| `npm run lint` | Lint all packages |
| `npm run typecheck` | Type check all packages |
| `npm run clean` | Clean all build outputs |
| `npm run changeset` | Create a changeset for versioning |
| `npm run version` | Version packages based on changesets |
| `npm run release` | Build and publish packages |

## 🔧 Configuration

### Environment Variables

Create `.env.local` files in respective packages:

#### Frontend (`frontend/.env.local`)
```env
PUBLIC_SANITY_PROJECT_ID=your-project-id
PUBLIC_SANITY_DATASET=production
SITE_URL=https://your-site.com
```

#### Studio (`studio/.env.local`)
```env
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

### Turborepo Remote Caching

To enable Turborepo remote caching:

1. Create an account at [turbo.build](https://turbo.build)
2. Get your token and team
3. Add to environment:
```bash
export TURBO_TOKEN=your-token
export TURBO_TEAM=your-team
```

## 🧪 Testing

The monorepo includes comprehensive testing:

- **Unit Tests** - Component and utility testing
- **Integration Tests** - API and data flow testing
- **59+ tests** across all packages
- **Vitest** with Happy DOM for fast testing

## 🚢 Deployment

### GitHub Actions

The repository includes two workflows:

1. **CI Workflow** (`ci.yml`) - Runs on every push/PR
   - Builds all packages
   - Runs tests and linting
   - Type checking
   - Creates changesets

2. **Deploy Workflow** (`deploy.yml`) - Runs after successful CI
   - Deploys frontend to hosting provider
   - Deploys Sanity Studio

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy frontend (example with Vercel)
cd frontend && vercel --prod

# Deploy studio
cd studio && npx sanity deploy
```

## 📚 Documentation

- [Astro Documentation](https://docs.astro.build)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Changesets Documentation](https://github.com/changesets/changesets)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run changeset` to create a changeset
4. Submit a pull request

## 📄 License

MIT

---

Built with ❤️ using modern web technologies for 2025 and beyond.
