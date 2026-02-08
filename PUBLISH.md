# 📦 GitHub Packages Publishing Guide

This guide will help you publish the `create-monolith-app` package to GitHub Packages.

## 📋 Prerequisites

1. **GitHub Repository**: You must have a GitHub repository (https://github.com/raulgcode/create-monolith-app)
2. **Personal Access Token (PAT)**: You need a token with `write:packages` and `read:packages` permissions

### Creating a Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click on "Generate new token (classic)"
3. Select the following scopes:
   - ✅ `write:packages` - To publish packages
   - ✅ `read:packages` - To read packages
   - ✅ `repo` - To access the repository
4. Click on "Generate token"
5. **IMPORTANT!** Copy the token (you won't be able to see it again)

## 🔐 Configure Authentication

### Option 1: Using local .npmrc (Recommended)

Create an `.npmrc` file at the project root:

```bash
echo "@raulgcode:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE" >> .npmrc
```

**⚠️ IMPORTANT**: Add `.npmrc` to your `.gitignore` to avoid uploading the token:

```bash
echo ".npmrc" >> .gitignore
```

### Option 2: Global configuration

```bash
npm config set @raulgcode:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken YOUR_TOKEN_HERE
```

### Option 3: Using environment variable

```bash
# Windows (PowerShell)
$env:NODE_AUTH_TOKEN="YOUR_TOKEN_HERE"

# Linux/Mac
export NODE_AUTH_TOKEN=YOUR_TOKEN_HERE
```

## 📤 Publishing the Package

### 1. Make sure the project is built

```bash
pnpm build
```

This will run `tsup` and generate files in the `dist/` folder.

### 2. Verify everything is correct

```bash
# See which files will be published
npm pack --dry-run

# The result should show:
# - dist/index.js
# - dist/bin/create-monolith-app.js
# - package.json
# - README.md
```

### 3. Publish

```bash
npm publish
```

If you have issues, try:

```bash
npm publish --registry=https://npm.pkg.github.com
```

## 🤖 Automatic Release and Publishing (Recommended)

This project is configured with **semantic-release** and **GitHub Actions** to automate versioning and publishing.

### How it works

1. **Semantic Release**: Automatically determines version numbers based on commit messages
2. **GitHub Actions**: Runs the release process on every push to the `main` branch
3. **Changelog**: Automatically generates a CHANGELOG.md file
4. **GitHub Release**: Creates GitHub releases with release notes
5. **Package Publishing**: Publishes to GitHub Packages automatically

### Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
# Patch release (1.0.0 -> 1.0.1)
fix: fixed a bug in the CLI
perf: improved performance

# Minor release (1.0.0 -> 1.1.0)
feat: added new option --template
feat: support for custom templates

# Major release (1.0.0 -> 2.0.0)
feat!: redesigned CLI interface
feat: new API

BREAKING CHANGE: removed --legacy flag

# No release
docs: updated README
style: formatted code
chore: updated dependencies
test: added unit tests
```

### Release Types

| Commit Type                          | Version Bump | Example       |
| ------------------------------------ | ------------ | ------------- |
| `fix:`                               | Patch        | 1.0.0 → 1.0.1 |
| `perf:`                              | Patch        | 1.0.0 → 1.0.1 |
| `refactor:`                          | Patch        | 1.0.0 → 1.0.1 |
| `feat:`                              | Minor        | 1.0.0 → 1.1.0 |
| `BREAKING CHANGE:`                   | Major        | 1.0.0 → 2.0.0 |
| `feat!:` or `fix!:`                  | Major        | 1.0.0 → 2.0.0 |
| `docs:`, `style:`, `test:`, `chore:` | No release   | -             |

### Triggering a Release

Simply push commits to the `main` branch:

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

The GitHub Actions workflow will:

1. Analyze your commits
2. Determine the new version number
3. Build the package
4. Update package.json and CHANGELOG.md
5. Create a git tag
6. Create a GitHub release
7. Publish to GitHub Packages

### Manual Configuration (If needed)

The workflow is already configured in [.github/workflows/release.yml](.github/workflows/release.yml). The workflow includes:

- Automated versioning with semantic-release
- Build process
- Package publishing
- Changelog generation

**Configuration file**: `.releaserc.json`

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/github"
  ]
}
```

### First Release

For the first release after setting up semantic-release:

```bash
git add .
git commit -m "feat: initial release"
git push origin main
```

This will create version `1.0.0` (or bump from current version).

## 📤 Manual Publishing (Alternative)

If you prefer to publish manually without semantic-release:

### 1. Make sure the project is built

```bash
pnpm build
```

### 2. Verify everything is correct

```bash
npm pack --dry-run
```

### 3. Update version manually

```bash
npm version patch  # or minor, or major
```

### 4. Publish

```bash
npm publish
```

## ✅ Verify the Publication

1. Go to your repository on GitHub
2. Click on "Packages" (right side)
3. You should see `create-monolith-app` listed

Or visit: https://github.com/raulgcode/create-monolith-app/packages

## � Installing the Published Package

### For End Users

Users will need to configure npm to use GitHub Packages:

```bash
# Authenticate
npm login --registry=https://npm.pkg.github.com --scope=@raulgcode

# Use the package
npx @raulgcode/create-monolith-app my-app
```

### User Configuration (.npmrc in their project)

Users can create an `.npmrc` file in their HOME or project:

```
@raulgcode:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=THEIR_TOKEN
```

## �🐛 Troubleshooting

### Error: "You must sign in to publish packages"

- Verify that your token is configured correctly
- Make sure the token has `write:packages` permissions

### Error: "Package name must start with @raulgcode/"

- Verify that the `name` in `package.json` is `@raulgcode/create-monolith-app`

### Error: "Version already exists"

- With semantic-release: This shouldn't happen as it manages versions automatically
- If publishing manually: Increment the version with `npm version patch/minor/major`
- Check if a version tag already exists: `git tag`

### Error: "404 Not Found"

- Verify that the repository https://github.com/raulgcode/create-monolith-app exists
- Verify that the `repository` field in `package.json` is correct

## 📝 Additional Notes

- GitHub Packages requires the package name to have a scope (e.g., `@raulgcode/`)
- The package is private by default. To make it public, go to the package settings on GitHub
- You can also publish to the regular npm registry by changing `publishConfig.registry`

## 🆚 Publishing to npm Registry (Alternative)

If you prefer to publish to the public npm registry instead of GitHub Packages:

1. Remove `publishConfig` from `package.json`
2. Create an account at https://www.npmjs.com
3. Login:
   ```bash
   npm login
   ```
4. Publish:
   ```bash
   npm publish --access public
   ```

The package name can be `create-monolith-app` (without scope) if available, or keep `@raulgcode/create-monolith-app`.
