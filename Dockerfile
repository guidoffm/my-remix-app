FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1. Abhängigkeiten
FROM base AS deps
COPY package*.json ./
RUN npm ci

# 2. Builder (Vite Build)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Vite Build erzeugt build/client und build/server
RUN npm run build

# 3. Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remixjs
USER remixjs

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# WICHTIG: Den gesamten build-Ordner inkl. Unterordner client/server kopieren
COPY --from=builder /app/build ./build
# WICHTIG: Den public-Ordner für Icons/Bilder kopieren
COPY --from=builder /app/public ./public 

EXPOSE 3000

# Start-Befehl für Vite-Builds (Pfad zum Server-Index)
CMD ["npx", "remix-serve", "./build/server/index.js"]