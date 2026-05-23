# #region File Overview
# =============================================================================
# Dockerfile — Production container for the D3NTIQ Next.js frontend.
#
# Multi-stage build:
#   Stage 1 (deps)    — installs production dependencies only
#   Stage 2 (builder) — builds the Next.js application
#   Stage 3 (runner)  — minimal runtime image with only what is needed to serve
#
# Result: a lean, secure image that runs `next start` on port 3000.
# Used by: CI/CD pipeline for DigitalOcean Droplet deployment.
# =============================================================================
# #endregion

# ── Stage 1: Install dependencies ────────────────────────────────────────────
FROM node:20-bullseye-slim AS deps

WORKDIR /app

COPY package*.json ./

# Install production + build dependencies (devDeps needed for `next build`)
RUN npm ci

# ── Stage 2: Build the application ───────────────────────────────────────────
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files needed for the build
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./
COPY postcss.config.mjs ./
COPY tailwind.config.ts ./
COPY src ./src
COPY public ./public

# Build the Next.js application
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 3: Production runtime ───────────────────────────────────────────────
FROM node:20-bullseye-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create a non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

# Copy only what is needed to run the app
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy the standalone Next.js output (requires `output: 'standalone'` in next.config.ts)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode < 500 ? 0 : 1)})"

# Start the production server
CMD ["node", "server.js"]
