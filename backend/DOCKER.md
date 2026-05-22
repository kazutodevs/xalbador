# Docker Setup for Xalbador Backend

This backend can run in Docker for both development and production environments.

## Files

- **Dockerfile** - Production-optimized, multi-stage build for minimal image size
- **Dockerfile.dev** - Development image with hot-reload via nodemon
- **docker-compose.yml** - Local development orchestration
- **.dockerignore** - Excludes unnecessary files from build context

## Requirements

- Docker 20.10+
- Docker Compose 2.0+ (for development)

## Quick Start

### Option 1: Development with Docker Compose (Recommended)

This mode includes hot-reload when you edit files.

```bash
# Copy .env if using environment variables
cp .env.example .env  # if needed

# Build and start the development container
docker-compose up --build

# Server runs at https://xalbador-9rlr6wzb5-novalgamedev-9048s-projects.vercel.app
```

The container watches for file changes and restarts automatically.

### Option 2: Production Image

```bash
# Build production image
docker build -t xalbador-backend:latest .

# Run production container
docker run -d \
  --name xalbador-backend \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e SUPABASE_URL=your_supabase_url \
  -e SUPABASE_SERVICE_KEY=your_service_key \
  -e JWT_SECRET=your_jwt_secret \
  -e DISCORD_CLIENT_ID=your_discord_id \
  -e DISCORD_CLIENT_SECRET=your_discord_secret \
  -e MAYAR_API_KEY=your_mayar_key \
  -e FRONTEND_URL=https://yourdomain.com \
  xalbador-backend:latest
```

## Environment Variables

Set environment variables either in:
1. `.env` file (for docker-compose)
2. Environment variables directly (for `docker run`)
3. Vercel dashboard (for production deployment)

Required for production:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `MAYAR_API_KEY`
- `FRONTEND_URL`
- `BACKEND_URL`

Optional:
- `PORT` (default: 3001)
- `HOST` (default: 127.0.0.1, use 0.0.0.0 for Docker)
- `NODE_ENV` (default: development)
- `PAYMENT_MODE` (default: test)

## Common Commands

```bash
# Development - start with volume mounts
docker-compose up

# Development - build and start
docker-compose up --build

# Development - stop containers
docker-compose down

# Development - view logs
docker-compose logs -f backend

# Production - build image
docker build -t xalbador-backend:latest .

# Production - run container
docker run -p 3001:3001 -e NODE_ENV=production ... xalbador-backend:latest

# Production - tag for registry
docker tag xalbador-backend:latest your-registry/xalbador-backend:latest

# Production - push to registry
docker push your-registry/xalbador-backend:latest
```

## Health Check

The production image includes a health check at `/api/health`:

```bash
curl https://xalbador-9rlr6wzb5-novalgamedev-9048s-projects.vercel.app/api/health
# Response: { "status": "ok", "timestamp": "...", "environment": "production" }
```

## Deployment

### Vercel (Recommended for serverless)

Docker images aren't needed for Vercel. Instead:
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Docker Registry / Self-Hosted

```bash
# Build and push to Docker Hub or your registry
docker build -t your-username/xalbador-backend:v1 .
docker push your-username/xalbador-backend:v1

# Run on your server
docker pull your-username/xalbador-backend:v1
docker run -d \
  --name xalbador-backend \
  -p 3001:3001 \
  -e NODE_ENV=production \
  ... (other env vars) \
  your-username/xalbador-backend:v1
```

### Docker Compose on Production

For multi-service deployments, create a `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: your-username/xalbador-backend:v1
    container_name: xalbador-backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - HOST=0.0.0.0
      # Add all required env vars here
    restart: always
    networks:
      - xalbador-network

networks:
  xalbador-network:
    driver: bridge
```

Then run with:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Port already in use
If port 3001 is already in use:
```bash
docker-compose down  # stop current containers
```

### View logs
```bash
docker-compose logs -f backend
# or
docker logs -f xalbador-backend
```

### Rebuild image
```bash
docker-compose up --build --no-deps backend
```

### Clear unused Docker resources
```bash
docker system prune -a
```

## Performance Notes

- Production image uses `node:20-alpine` for minimal size (~200MB)
- Multi-stage build reduces final image size
- Health checks configured for Kubernetes/orchestration compatibility
- Uses `dumb-init` for proper signal handling

## Security Notes

- Images run as non-root user (nodejs:1001)
- `.dockerignore` excludes sensitive files (env.local, .git, etc.)
- Keep `SUPABASE_SERVICE_KEY` and `JWT_SECRET` secure
- Use Docker secrets or a secrets manager in production

## Next Steps

1. Set up CI/CD to automatically build and push images
2. Use Docker Compose in production for multi-container apps
3. Configure container orchestration (Kubernetes, Docker Swarm) for auto-scaling
4. Set up monitoring and logging with tools like Datadog, New Relic, or ELK
