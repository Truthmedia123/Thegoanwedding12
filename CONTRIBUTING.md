# Contributing to TheGoanWedding

Thank you for your interest in contributing to TheGoanWedding! This document provides guidelines and best practices for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

## Code of Conduct

This project follows a code of conduct that emphasizes respect, inclusivity, and professionalism. By participating, you are expected to uphold these standards.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Docker (for Meilisearch)

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/thegoanwedding.git
   cd thegoanwedding
   ```
3. Install dependencies:
   ```bash
   npm install
   cd directus-cms && npm install && cd ..
   ```
4. Set up environment variables (copy `.env.example` to `.env` and configure)
5. Start development services:
   ```bash
   npm run dev:all
   ```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- Feature branches - Create from `develop` for new features
- Hotfix branches - Create from `main` for urgent fixes

### Creating a Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Making Changes

1. Write code following the project's coding standards
2. Add or update tests as needed
3. Update documentation if required
4. Run tests to ensure nothing is broken
5. Commit changes with clear, descriptive messages

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Prefer functional components in React
- Use hooks for state and side effects

### CSS/Tailwind

- Use Tailwind CSS utility classes
- Follow the existing color palette and design system
- Use responsive design principles
- Maintain accessibility standards

### Git Commit Messages

Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Maintenance tasks

## Testing

### Unit Tests

Run unit tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### End-to-End Tests

Run Playwright tests:
```bash
npm run test:e2e
```

### Test Coverage

Aim for at least 70% test coverage for new features.

## Documentation

### Code Documentation

- Use JSDoc/TSDoc for functions and components
- Comment complex logic
- Update README.md when adding new features

### API Documentation

- Document API endpoints
- Include example requests and responses
- Update schema documentation

## Pull Request Process

### Before Submitting

1. Ensure all tests pass
2. Update documentation
3. Squash commits if necessary
4. Rebase on latest `develop` branch

### Pull Request Guidelines

- Provide a clear title and description
- Reference related issues
- Include screenshots for UI changes
- Request review from maintainers

### Review Process

1. Automated checks must pass
2. Code review by at least one maintainer
3. Manual testing for significant changes
4. Merge to `develop` after approval

## Project Structure

```
thegoanwedding/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and API clients
│   │   └── utils/          # Helper functions
├── directus-cms/          # Directus CMS
├── server/                # Backend services
├── scripts/               # Utility scripts
└── e2e/                   # End-to-end tests
```

## Technology Stack

### Frontend
- React with TypeScript
- Tailwind CSS
- React Query for data fetching
- React Router for routing
- Jest and Playwright for testing

### Backend
- Cloudflare Workers
- Directus CMS
- Meilisearch for search
- SQLite for development database

### Development Tools
- Vite for development server
- Wrangler for Cloudflare deployment
- ESLint and Prettier for code quality
- GitHub Actions for CI/CD

## Community

### Communication

- GitHub Issues for bug reports and feature requests
- GitHub Discussions for general questions and discussions
- Slack for real-time communication (if available)

### Reporting Issues

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment information

### Feature Requests

- Explain the problem the feature solves
- Describe the proposed solution
- Include examples or mockups if relevant

## License

By contributing to TheGoanWedding, you agree that your contributions will be licensed under the MIT License.