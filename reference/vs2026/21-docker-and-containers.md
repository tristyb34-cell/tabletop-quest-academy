## Docker and Containers

### Container Tools

**Path: Tools > Options > Container Tools > General**

| Setting | Description |
|---------|-------------|
| Container Runtime | Choose between Docker Desktop and Podman (new in VS 2026) |
| Pull required Docker images on project open | Auto-pull base images |
| Pull updated Docker images on project open | Keep base images current |
| Remove containers on project close | Clean up after development |

### Supported Features

| Feature | Description |
|---------|-------------|
| Add Docker Support | Right-click project > Add > Docker Support. Generates a Dockerfile |
| Docker Compose | Add container orchestration with docker-compose.yml |
| Container debugging | F5 builds image, runs container, and attaches debugger |
| Container Explorer | View running containers, images, volumes, and networks |
| Dockerfile IntelliSense | Autocomplete for Dockerfile instructions |
| Hot Reload in containers | Edit code while container is running (.NET) |

### Podman Support (New in VS 2026)

VS 2026 supports Podman as an alternative to Docker Desktop:
- Daemonless container engine (no background service required)
- Compatible with Docker CLI commands
- OCI-compliant
- Rootless containers for improved security
- Configure in **Tools > Options > Container Tools > General > Container Runtime**

---
