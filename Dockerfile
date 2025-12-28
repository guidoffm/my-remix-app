FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# --- SCHRITT 1: Dependencies ---
FROM base AS deps
COPY package*.json ./
RUN npm ci

# --- SCHRITT 2: Builder (Hier wird das CSS generiert) ---
FROM base AS builder
WORKDIR /app
# Hol die installierten Module
COPY --from=deps /app/node_modules ./node_modules
# Kopiere ALLES (Configs, App-Ordner, etc.)
COPY . .
# Führe den Build aus - Tailwind scannt jetzt den kopierten Code
RUN npm run build

# --- SCHRITT 3: Runner ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Erst jetzt legen wir den eingeschränkten User an
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remixjs
USER remixjs

# Kopiere nur das Nötigste für den Betrieb
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public 

EXPOSE 3000
CMD ["npm", "start"]