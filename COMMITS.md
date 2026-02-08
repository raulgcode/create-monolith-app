# Conventional Commits Examples

This file provides examples of conventional commit messages for semantic-release.

## Patch Release (1.0.0 → 1.0.1)

```bash
fix: resolve issue with project name validation
fix: correct database connection string format
perf: optimize template cloning process
refactor: improve error handling
```

## Minor Release (1.0.0 → 1.1.0)

```bash
feat: add --template option for custom templates
feat: support TypeScript strict mode configuration
feat: add Docker support for development
```

## Major Release (1.0.0 → 2.0.0)

```bash
feat!: redesign CLI interface

BREAKING CHANGE: The --yes flag now requires explicit confirmation
```

Or:

```bash
feat: new project structure

BREAKING CHANGE: Changed default directory structure. Existing projects need migration.
```

## No Release

```bash
docs: update README with new examples
docs: add contributing guidelines

style: format code with prettier
style: fix indentation in index.ts

chore: update dependencies
chore: configure husky for git hooks

test: add unit tests for CLI options
test: improve coverage for validation functions

ci: update GitHub Actions workflow
ci: add caching for node_modules

build: update tsup configuration
build: optimize bundle size
```

## Multiple Changes in One Commit

```bash
feat: add template system and improve CLI

- Add support for custom templates
- Improve error messages
- Update documentation

BREAKING CHANGE: Removed legacy --old-flag option
```

## Quick Reference

| Type                           | When to Use              | Version Impact |
| ------------------------------ | ------------------------ | -------------- |
| `fix:`                         | Bug fixes                | Patch          |
| `feat:`                        | New features             | Minor          |
| `feat!:` or `BREAKING CHANGE:` | Breaking changes         | Major          |
| `perf:`                        | Performance improvements | Patch          |
| `refactor:`                    | Code refactoring         | Patch          |
| `docs:`                        | Documentation only       | None           |
| `style:`                       | Code style/formatting    | None           |
| `test:`                        | Adding/updating tests    | None           |
| `chore:`                       | Maintenance tasks        | None           |
| `ci:`                          | CI/CD changes            | None           |
| `build:`                       | Build system changes     | None           |
