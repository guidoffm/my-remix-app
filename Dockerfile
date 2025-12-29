# 1. Basis-Image
FROM node:20-alpine AS base
WORKDIR /app
# Notwendig fuer einige native Node-Module unter Alpine Linux
RUN apk add --no-cache libc6-compat

# 2. Abhaengigkeiten installieren
FROM base AS deps
COPY package*.json ./
# Installiert exakt die Versionen aus der package-lock.json
RUN npm ci

# 3. Das Projekt bauen
FROM base AS builder
WORKDIR /app

# Umgebungsvariablen fuer stabilen Build
ENV NODE_ENV=production
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Kopiere node_modules aus dem deps-Schritt
COPY --from=deps /app/node_modules ./node_modules

# Kopiere den gesamten Quellcode
COPY . . 

# Loesche zur Sicherheit lokale Build-Ordner, falls sie mitkopiert wurden
RUN rm -rf build .cache

# Fuehre den Remix/Vite Build aus
RUN npm run build

# 4. Produktions-Image (Runner)
FROM base AS runner
WORKDIR /app

# Umgebung auf Produktion stellen
ENV NODE_ENV=production

# Kopiere nur die notwendigen Dateien fuer den Betrieb
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Port fuer Remix
EXPOSE 3000

# Startbefehl fuer die Server-Datei
CMD ["npx", "remix-serve", "./build/server/index.js"]