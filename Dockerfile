# -------------------------------------------------------------
# Stage 1: Build
# -------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate

# Copy dependency specifications and Prisma schema
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install all dependencies (termasuk devDependencies untuk build)
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
RUN pnpm run db:gen

# Copy source code and TypeScript configuration
COPY tsconfig.json ./
COPY src ./src
COPY public ./public

# Compile TypeScript to JavaScript in dist/
RUN pnpm run build

# -------------------------------------------------------------
# Stage 2: Runner
# node_modules di-copy dari builder — tidak install ulang
# agar menghindari masalah lifecycle scripts (husky, prisma, dll)
# -------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install openssl untuk Prisma runtime
RUN apk add --no-cache openssl

# Copy package.json untuk metadata
COPY package.json ./

# Copy node_modules (sudah include Prisma Client yang ter-generate)
# dari builder — tidak perlu install ulang
COPY --from=builder /app/node_modules ./node_modules

# Copy built application and static assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/constants ./src/constants

# Expose Express application port
EXPOSE 3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

# Start the Express server
CMD ["node", "dist/index.js"]
