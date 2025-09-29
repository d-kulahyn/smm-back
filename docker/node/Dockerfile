FROM node:18-alpine AS dependencies

WORKDIR /app

# Устанавливаем curl для healthcheck
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

FROM node:18-alpine AS runtime

# Устанавливаем curl для healthcheck
RUN apk add --no-cache curl

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

COPY --chown=nodejs:nodejs . .

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1024 --enable-source-maps=false"

USER nodejs

EXPOSE 3000

CMD ["node", "server.js"]
