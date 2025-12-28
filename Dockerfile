# 1. Basis-Image
FROM node:20-alpine AS base

# 2. Abhängigkeiten installieren
FROM base AS deps
# libc6-compat wird oft für native Abhängigkeiten in Alpine benötigt
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# 3. Build-Prozess
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Kopiert den gesamten Quellcode (inkl. tailwind.config.js für korrektes CSS-Purging)
COPY . .
RUN npm run build

# 4. Produktions-Runner
FROM base AS runner
WORKDIR /app

# Wichtig für Performance und Sicherheit
ENV NODE_ENV=production

# Sicherheits-User anlegen (nicht als root ausführen)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remixjs
USER remixjs

# Nur die notwendigen Dateien aus dem Builder kopieren
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

# --- ENTSCHEIDEND FÜR DESIGN & ICONS ---
# Kopiert statische Assets wie CSS, Favicons und Apple-Touch-Icons
COPY --from=builder /app/public ./public 
# ---------------------------------------

EXPOSE 3000

# Startet den Remix-Server
CMD ["npm", "start"]