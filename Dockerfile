# ==============================
# Stage 1: Dependencies
# ==============================
FROM node:20-alpine AS deps
WORKDIR /app

RUN npm install -g pnpm@9

# Copy package files and npmrc for install config
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# ==============================
# Stage 2: Build
# ==============================
FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@9

# Declare Railway env vars as build args so they're available during `next build`
# Railway auto-injects all service variables as Docker build args
ARG DATABASE_URI
ARG BUILD_DATABASE
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SERVER_URL
ARG S3_BUCKET
ARG S3_ACCESS_KEY_ID
ARG S3_SECRET_ACCESS_KEY
ARG S3_REGION
ARG S3_ENDPOINT
ARG CRON_SECRET
ARG PREVIEW_SECRET
# NOTE: Do NOT pass RAILWAY_DEPLOYMENT_ID here — the build container
# can't reach Railway's private network. Without this ARG, payload.config.ts
# falls back to BUILD_DATABASE (public URL). At runtime, Railway injects
# it as a regular env var so the internal URL is used correctly.

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the app (triggers postbuild for sitemap generation too)
RUN pnpm build

# ==============================
# Stage 3: Production Runner (Minimal)
# ==============================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Cap Node.js heap at 512MB to prevent V8 from expanding into available RAM
ENV NODE_OPTIONS="--max-old-space-size=512"

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output (minimal footprint)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000

# Run standalone server directly (no pnpm/next overhead)
CMD ["node", "server.js"]
