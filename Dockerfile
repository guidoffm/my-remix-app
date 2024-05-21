FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app
COPY package*.json ./
RUN chown -R nextjs:nodejs /app
USER nextjs
RUN npm install
COPY . .
USER root
RUN chown -R nextjs:nodejs /app
USER nextjs
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]