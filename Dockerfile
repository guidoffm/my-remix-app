FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

FROM deps AS builder
WORKDIR /app
COPY --chown=nextjs:nodejs package*.json ./
# RUN chown -R nextjs:nodejs /app
# USER nextjs
RUN npm ci
COPY --chown=nextjs:nodejs . .
# USER root
# RUN chown -R nextjs:nodejs /app
# USER nextjs
RUN npm run build

FROM deps AS runner
WORKDIR /app
# USER nextjs
COPY --from=builder /app/package*.json ./
# USER root
# RUN chown -R nextjs:nodejs /app
# USER nextjs
RUN npm ci --omit=dev
COPY --from=builder /app/build ./build
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/next.config.js ./next.config.js
# RUN chown -R nextjs:nodejs /app
# USER nextjs
EXPOSE 3000
CMD ["npm", "start"]