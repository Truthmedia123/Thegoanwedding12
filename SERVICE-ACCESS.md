# Service Access Information

## Working Services

1. **Main Application (React)**
   - URL: http://127.0.0.1:8787
   - This is the frontend wedding planning application

2. **Directus Admin**
   - URL: http://localhost:8055/admin
   - Admin credentials will be displayed in the Directus terminal output
   - Note: Use `localhost:8055` not `0.0.0.0:8055`

3. **Dev Dashboard**
   - URL: http://localhost:3000
   - Development dashboard for monitoring services

## Services with Issues

1. **Meilisearch Dashboard**
   - Intended URL: http://localhost:7700
   - Status: Fixed - now working with Docker or direct binary execution

## How to Access Services

### Start All Services
From the project root directory, run each service in a separate terminal:

1. Terminal 1: `npm run dev:directus`
2. Terminal 2: `npm run dev:search` (This will start Meilisearch)
3. Terminal 3: `npm run pages:dev`

### Alternative Methods for Meilisearch

1. **Using Docker** (if installed):
   ```
   docker run -it --rm -p 7700:7700 -e MEILI_MASTER_KEY=dev-key getmeili/meilisearch:v1.10
   ```

2. **Using the downloaded binary**:
   ```
   .\meilisearch.exe --http-addr 127.0.0.1:7700 --master-key dev-key
   ```

3. **Using the batch script**:
   ```
   start-meilisearch.bat
   ```

## Troubleshooting

1. **If services won't start due to "port in use" errors:**
   - Find the process: `netstat -ano | findstr :[PORT]`
   - Kill the process: `taskkill /F /PID [PID]`

2. **If Directus shows extension warnings:**
   - These are non-critical and can be ignored for basic functionality

3. **If you see "0.0.0.0:8055" in logs but can't access it:**
   - Use http://localhost:8055 instead
   - The 0.0.0.0 address is for binding, not accessing

4. **If Meilisearch won't start:**
   - Make sure Docker is installed and running
   - Or try running the meilisearch.exe binary directly
   - Check that port 7700 is not already in use