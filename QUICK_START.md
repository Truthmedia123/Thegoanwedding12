# Quick Start Guide

## Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository (if not already cloned):
   ```
   git clone <repository-url>
   cd weddingreplit
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Development

### Running the Development Server

To start the development server with live reload:

```bash
npm run pages:dev
```

The application will be available at: http://localhost:8787

### Building for Production

To create a production build:

```bash
npm run build:production
```

Output will be in the `dist/` directory.

## Deployment

### Cloudflare Pages Deployment

To deploy to Cloudflare Pages:

```bash
npm run pages:deploy
```

### Direct Worker Deployment

For staging:
```bash
npm run deploy:staging
```

For production:
```bash
npm run deploy:production
```

## Maintenance

### Updating Dependencies

To automatically update dependencies and check for vulnerabilities:

```bash
npm run update-deps
```

### Manual Security Audit

To check for vulnerabilities:

```bash
npm audit
```

To fix vulnerabilities (when possible):

```bash
npm audit fix --force
```

## Project Structure

```
weddingreplit/
├── client/           # Frontend React application
├── server/           # Backend worker code
├── dist/             # Build output directory
├── scripts/          # Utility scripts
├── shared/           # Shared code between frontend and backend
├── package.json      # Project dependencies and scripts
└── wrangler.toml     # Cloudflare configuration
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
D1_DB_PATH=./.db/dev.db
SITE_URL=http://localhost:8787
```

## Common Issues and Solutions

### Port Already in Use

If you get an "EADDRINUSE" error:
1. Check if another process is using port 8787
2. Kill the process or change the port in the configuration

### Build Errors

If you encounter build errors:
1. Clean the build: `rm -rf dist/`
2. Reinstall dependencies: `npm install`
3. Try building again: `npm run build:production`

### Database Issues

If you encounter database errors:
1. Ensure the `.db/` directory exists
2. Check that the D1_DB_PATH in your `.env` file is correct
3. Run database migrations if needed: `npm run db:push`

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run pages:dev` | Start Cloudflare Pages development server |
| `npm run build:production` | Create production build |
| `npm run pages:deploy` | Deploy to Cloudflare Pages |
| `npm run update-deps` | Update dependencies and check for vulnerabilities |
| `npm test` | Run tests |
| `npm run db:seed` | Seed database with initial data |

## Support

For issues or questions, please check:
1. The error messages in the terminal
2. The documentation in the repository
3. The Cloudflare Workers documentation