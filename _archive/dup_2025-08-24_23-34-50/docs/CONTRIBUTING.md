# Contributing to Cabana

Thank you for your interest in contributing to Cabana! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork the repository** and clone your fork
2. **Install dependencies**: `npm install`
3. **Start development servers**: `npm run dev`
4. **Create a feature branch**: `git checkout -b feature/your-feature-name`

## 💻 Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git for version control

### Environment Setup
1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
2. Configure required environment variables (see CLAUDE.md for details)
3. Start both servers: `npm run dev`

### Architecture Overview
Cabana uses a **dual-server architecture**:
- **Frontend**: Vite dev server (port 8080) - React application
- **Backend**: Express API server (port 3001) - AI integrations, database, payments

For detailed architecture information, see `CLAUDE.md`.

## 🔧 Development Workflow

### Making Changes
1. **Create feature branch** from `main`
2. **Make your changes** following the project patterns
3. **Test thoroughly** - run `npm test` and `npm run test:e2e`
4. **Check code quality** - run `npm run lint` and `npm run typecheck`
5. **Commit with clear messages** following conventional commits

### Testing
- **Unit Tests**: `npm test` (Vitest)
- **E2E Tests**: `npm run test:e2e` (Playwright)
- **Type Checking**: `npm run typecheck`
- **Linting**: `npm run lint`

### Code Style
- **TypeScript** for type safety
- **ESLint** for code quality
- **Tailwind CSS** for styling
- **Component patterns** following existing structure

## 🏗️ Project Structure

```
src/
├── components/     # React components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── features/      # Feature modules (addon system)
├── types/         # TypeScript definitions
└── integrations/  # Third-party integrations

api/
└── server.ts      # Express backend server
```

## 🎯 Feature Development

### Addon System
Cabana uses a modular addon system. To create new features:

1. **Create addon directory**: `src/features/addons/your-addon/`
2. **Follow addon structure**:
   ```
   your-addon/
   ├── components/    # React components
   ├── services/      # Business logic
   ├── types.ts       # TypeScript definitions
   ├── config.ts      # Configuration
   └── index.ts       # Main exports
   ```
3. **Register in addon registry**: Update `src/features/addons/addon-registry.ts`
4. **Add feature flag**: Update `src/features/addons/feature-flags.ts`

### API Development
- **Add endpoints** to `api/server.ts`
- **Follow security patterns** (CSRF, rate limiting, validation)
- **Use Zod schemas** for request/response validation
- **Implement proper error handling**

## 🔒 Security Guidelines

- **Never commit secrets** (API keys, tokens)
- **Validate all inputs** using Zod schemas
- **Follow security patterns** in existing codebase
- **Use environment variables** for configuration

## 📋 Pull Request Process

1. **Update documentation** if needed
2. **Add/update tests** for new functionality
3. **Ensure CI passes** - all tests and checks must pass
4. **Write clear PR description** explaining changes
5. **Link related issues** if applicable

### PR Template
```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)
```

## 🐛 Bug Reports

When reporting bugs, please include:
- **Clear description** of the issue
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (OS, Node version, etc.)
- **Screenshots/logs** if relevant

## 💡 Feature Requests

For feature requests:
- **Use GitHub Issues** with the "enhancement" label
- **Describe the problem** you're trying to solve
- **Propose a solution** if you have ideas
- **Consider the addon system** for new features

## 📚 Resources

- **Architecture Guide**: See `CLAUDE.md`
- **API Documentation**: Check `api/server.ts`
- **Component Library**: Browse `src/components/ui/`
- **Testing Examples**: Look at existing test files

## ❓ Questions?

- **GitHub Issues** for public questions
- **GitHub Discussions** for general discussion
- **Code of Conduct**: See `CODE_OF_CONDUCT.md`

## 🙏 Recognition

Contributors are recognized in:
- **GitHub Contributors** page
- **Release notes** for significant contributions
- **Project README** for major contributors

Thank you for contributing to Cabana! 🎉