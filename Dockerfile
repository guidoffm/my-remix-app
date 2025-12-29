# 1. Basis-Image
FROM node:20-alpine AS base
WORKDIR /app
# Notwendig für einige native Node-Module unter Alpine Linux
RUN apk add --no-cache libc6-compat

# 2. Abhängigkeiten installieren
FROM base AS deps
COPY package*.json ./
# Installiert exakt die Versionen aus der package-lock.json
RUN npm ci

# 3. Das Projekt bauen
FROM base AS builder
WORKDIR /app
# Wichtig: Für Tailwind v4 Build-Optimierungen auf production setzen
ENV NODE_ENV=production

# Kopiere node_modules aus dem deps-Schritt
COPY --from=deps /app/node_modules ./node_modules

# Kopiere den gesamten Quellcode
COPY . . 

# SICHERHEITS-CHECK: Lösche lokale Build-Ordner, falls sie mitkopiert wurden,
# damit der Tailwind-Scanner nicht über alte Dateien stolpert.
RUN rm -rf build .cache

# Führe den Remix/Vite Build aus
RUN npm run build

# 4. Produktions-Image (Runner)
FROM base AS runner
WORKDIR /app

# Umgebung auf Produktion stellen
ENV NODE_ENV=production

# Kopiere nur die notwendigen Dateien für den Betrieb
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Port für Remix (remix-serve nutzt standardmäßig 3000)
EXPOSE 3000

# Startbefehl
CMD ["npx", "remix-serve", "./build/server/index.js"]