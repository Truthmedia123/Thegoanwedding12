# Start All Services

## Step 1: Start Docker Desktop

1. Click on the Docker Desktop icon in your system tray (bottom right corner of your screen), or
2. Search for "Docker Desktop" in your Start Menu and launch it
3. Wait for Docker Desktop to fully initialize (you'll see the whale icon in the system tray turn steady)

## Step 2: Start All Services

After Docker Desktop is running, open a new terminal in this directory and run:

```bash
npm run dev:all
```

This will start all three services:
- Directus CMS on http://localhost:8055
- Main Application on http://127.0.0.1:8787
- Meilisearch on http://localhost:7700

## Alternative: Start Services Individually

If you prefer to start services one by one:

1. **Directus**: `npm run dev:directus`
2. **Main Application**: `npm run pages:dev`
3. **Meilisearch**: `npm run dev:search`

## Access URLs

- **Main Website**: http://127.0.0.1:8787
- **Directus Admin**: http://localhost:8055/admin
- **Meilisearch Dashboard**: http://localhost:7700 (use master key: `sp7MZNSdzPOgs_LJi9xux51hJfnX2RMtjt10B8b9qSY`)

## Troubleshooting

If you see "The system cannot find the file specified" errors:
1. Make sure Docker Desktop is running
2. Restart Docker Desktop if needed
3. Wait a few moments after starting Docker Desktop before running the commands

If services fail to start due to "port in use" errors:
1. Run `netstat -ano | findstr :8055` to check Directus port
2. Run `netstat -ano | findstr :7700` to check Meilisearch port
3. Use `taskkill /F /PID [process_id]` to kill the processes using those ports