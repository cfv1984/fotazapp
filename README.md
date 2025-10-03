# PROJECT

Monorepo with **frontend** and **backend** (compiled to native with Bun), a shared **common/configs** package, Docker configs in `docker/`, deploy scripts in `scripts/`, and Nginx example in `nginx/`.

## Structure
See `REQUIREMENTS.md` for the exact target tree. This repo matches it.

## Local run (no Docker)
Terminal 1:
```bash
cd apps/backend
bun install
BACKEND_PORT=8081 DATA_DIR=./data bun run server.ts
```

Terminal 2:
```bash
cd apps/frontend
bun install
FRONTEND_PORT=8080 BACKEND_URL=http://localhost:8081 bun run server.ts
```

## docker-compose workflow (Windows)
This compiles both apps to native executables, copies them into containers, and restarts:
```powershell
.\scripts\deploy-to-docker.ps1
```
- Frontend: http://localhost:8080  
- Backend:  http://localhost:8081

## Remote deploy (Ubuntu server with Bun, Nginx, SQLite installed)
1) Copy `scripts/serverside-deploy.sh` to the server and make it executable:
```bash
scp scripts/serverside-deploy.sh user@server:~/serverside-deploy.sh
ssh user@server "chmod +x ~/serverside-deploy.sh"
```
2) From Windows, compile Linux binaries inside a Bun Docker builder, pack, upload and deploy:
```powershell
.\scripts\deploy-remote.ps1 -Server user@server
```
The script uploads `dist/backend` and `dist/frontend` plus `nginx/project.conf`. The server script atomically swaps `current` -> `releases/<timestamp>`, preserves data across releases, and restarts services + nginx.

### Systemd services (expected by the server-side script)
`/etc/systemd/system/project-backend.service`:
```ini
[Unit]
Description=Project Backend (compiled)
After=network.target

[Service]
WorkingDirectory=/var/www/project/current
Environment=BACKEND_PORT=8081
Environment=DATA_DIR=/var/www/project/current/data
ExecStart=/var/www/project/current/bin/backend
Restart=always
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

`/etc/systemd/system/project-frontend.service`:
```ini
[Unit]
Description=Project Frontend (compiled)
After=network.target

[Service]
WorkingDirectory=/var/www/project/current
Environment=FRONTEND_PORT=8080
Environment=BACKEND_URL=http://127.0.0.1:8081
ExecStart=/var/www/project/current/bin/frontend
Restart=always
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

### Nginx with Bearer token
The example `nginx/project.conf` requires `Authorization: Bearer 0xdeadbeef` on **all** requests. Requests without it receive `401` and are **not** proxied.

## License
CC-BY-NC-SA 4.0 — see `LICENSE.md`.

**Recommendations to keep the code under this license:**
- Add header to source files: `SPDX-License-Identifier: CC-BY-NC-SA-4.0`
- Set `"license": "CC-BY-NC-SA-4.0"` in all package.json files
- Include a `NOTICE` file for third-party licenses
- Add a CI check to enforce the SPDX tag presence
- Add image labels or binary metadata noting the license for releases
- State in CONTRIBUTING.md that contributions are accepted under the same license
