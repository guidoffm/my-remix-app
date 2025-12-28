FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# WICHTIG: Alles kopieren, damit Tailwind 4 die .tsx Dateien scannen kann
COPY . . 
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Kopiere die von Vite erzeugte Struktur
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

EXPOSE 3000

# Exakt der Pfad aus deinem erfolgreichen Log
CMD ["npx", "remix-serve", "./build/server/index.js"]