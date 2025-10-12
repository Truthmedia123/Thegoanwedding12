# Correct Approach for Running TheGoanWedding Application

## Issue Identified
The blank screen on port 8787 was caused by a mismatch between the development server and the files being served. The Cloudflare Pages dev server was serving the production build (dist/public) while the React app in development mode expects to be served via the Express dev server with module hot-reload and correct API proxying.

## Root Cause
You likely ran `npm run pages:dev` without first building the production assets, so `dist/public` was empty or stale. The Pages dev server was serving `dist/public/index.html`, which didn't contain the latest bundles from `/client/src`, resulting in a blank page.

## Correct Solutions

### For Full Development with HMR and Live React Source:
1. Use `npm run dev` 
2. Open http://localhost:3001/ (not 8787)
3. This uses your Express/Vite server to serve the live React app and proxy /api calls

### For Testing Production Build on Port 8787:
1. Build the production assets:
   ```bash
   npm run build:production
   ```
2. Start Pages dev on the built output:
   ```bash
   npx wrangler pages dev dist/public --port 8787
   ```
3. Open http://localhost:8787/ — now it will serve the freshly built dist/public files

## Current Status

1. **Development Server**: Running on http://localhost:3001 with hot-reload
2. **Production Build**: Successfully built with `npm run build:production`
3. **Pages Dev Server**: Attempted to run on port 8787 but encountered some issues

## Recommendations

1. **For Active Development**: Use `npm run dev` + port 3001
2. **For Production Testing**: Use `npm run build:production` + `npx wrangler pages dev dist/public --port 8787`

This alignment will eliminate the blank page by ensuring the dev server and served files match.

## Next Steps

1. Access http://localhost:3001 for active development with hot-reload
2. Fix any issues with the Pages dev server if production testing is needed
3. Document the correct development workflow for future reference