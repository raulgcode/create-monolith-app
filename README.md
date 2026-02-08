# create-monolith-app

CLI to create full-stack monorepo applications with NestJS, React Router, Prisma, and shadcn/ui preconfigured.

## 🚀 Features

- **Complete preconfigured stack**: NestJS (backend) + React Router (frontend) + Prisma (ORM)
- **Monorepo with pnpm**: Optimized dependency and workspace management
- **Modern UI**: shadcn/ui preinstalled and configured
- **Ready-to-use database**: PostgreSQL with Docker Compose
- **Automatic configuration**: Renames the project and sets up environment variables
- **Authentication included**: JWT authentication system preconfigured

## 📦 Installation

### Direct usage with npx (Recommended)

```bash
npx @raulgcode/create-monolith-app my-app
```

### Global installation

```bash
npm install -g @raulgcode/create-monolith-app
create-monolith-app my-app
```

### Installation from GitHub Packages

First, configure npm to authenticate with GitHub Packages:

```bash
npm login --registry=https://npm.pkg.github.com --scope=@raulgcode
```

Then install the package:

```bash
npx @raulgcode/create-monolith-app my-app
```

## 🎯 Usage

### Interactive mode

```bash
npx @raulgcode/create-monolith-app my-app
```

The CLI will prompt you for:

- Database username (default: `my-app`)
- Database password (default: `my-app_dev`)
- Database name (default: `my-app_db`)
- Whether to run setup automatically (default: `Y`)

### Mode with default values

```bash
npx @raulgcode/create-monolith-app my-app --yes
```

Uses default values for all configurations and runs setup automatically.

### Mode without automatic setup

```bash
npx @raulgcode/create-monolith-app my-app --no-setup
```

Creates the project but doesn't run `pnpm setup` (to run it manually later).

### Combining options

```bash
npx @raulgcode/create-monolith-app my-app -y --no-setup
```

## 📋 Options

| Option       | Alias | Description                                            |
| ------------ | ----- | ------------------------------------------------------ |
| `--yes`      | `-y`  | Uses default values for all configurations             |
| `--no-setup` | -     | Doesn't run automatic setup after creating the project |

## 🏗️ Generated project structure

```
my-app/
├── apps/
│   ├── api/              # NestJS application
│   │   ├── src/
│   │   ├── prisma/       # Prisma schema
│   │   └── package.json
│   └── web/              # React Router application
│       ├── src/
│       ├── components/   # shadcn/ui components
│       └── package.json
├── packages/             # Shared packages
├── docker-compose.yml    # Configured PostgreSQL
├── .env.example          # Environment variables
├── package.json          # Monorepo configuration
└── pnpm-workspace.yaml   # Workspace configuration
```

## 🚦 Next steps after creating the project

```bash
cd my-app
```

If you didn't run the automatic setup:

```bash
pnpm setup
```

Start development mode:

```bash
pnpm dev
```

This will start:

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **Database**: PostgreSQL on port 5432

### Default credentials

- **Email**: `admin@my-app.dev`
- **Password**: `Admin123!`

## 🛠️ Available commands in the generated project

```bash
# Install dependencies
pnpm install

# Development mode (backend + frontend)
pnpm dev

# Run only backend
pnpm --filter api dev

# Run only frontend
pnpm --filter web dev

# Build for production
pnpm build

# Run Prisma Studio
pnpm --filter api prisma:studio

# Database migrations
pnpm --filter api prisma:migrate

# Generate Prisma client
pnpm --filter api prisma:generate
```

## 🐳 Docker

The project includes a `docker-compose.yml` with preconfigured PostgreSQL:

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down
```

## 📝 Customization

The generated project is fully customized with the name you provided:

- Package names (`@my-app/api`, `@my-app/web`)
- Docker container names
- Database credentials
- Environment variables
- Application branding

## 🛠️ Development

### Contributing

This project uses **semantic-release** for automated versioning and publishing. When contributing:

1. Fork the repository
2. Create a feature branch
3. Use [Conventional Commits](https://www.conventionalcommits.org/) for your commit messages:
   - `feat:` for new features (minor version bump)
   - `fix:` for bug fixes (patch version bump)
   - `feat!:` or `BREAKING CHANGE:` for breaking changes (major version bump)
   - `docs:`, `chore:`, `test:` for non-release changes

4. Push to your fork and create a Pull Request

See [COMMITS.md](COMMITS.md) for commit message examples and [PUBLISH.md](PUBLISH.md) for publishing details.

### Automated Releases

The project is configured with GitHub Actions to automatically:

- Analyze commits and determine version numbers
- Generate changelogs
- Create GitHub releases
- Publish to GitHub Packages

When commits are pushed to the `master` branch, the release workflow runs automatically.

## 🤝 Prerequisites

- **Node.js**: 20.8.1+
- **pnpm**: 8+ (will be installed automatically if not present)
- **Git**: To clone the template
- **Docker** (optional): For PostgreSQL database

## 📄 License

MIT

## 👤 Author

**raulgcode**

## 🐛 Report issues

If you find any issues, please open an issue at: https://github.com/raulgcode/create-monolith-app/issues
